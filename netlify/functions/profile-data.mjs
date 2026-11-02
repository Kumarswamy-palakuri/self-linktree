import { timingSafeEqual } from "node:crypto";

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

function safeEqual(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && timingSafeEqual(a, b);
}

function getConfig() {
  const token = process.env.GITHUB_TOKEN;
  const password = process.env.ADMIN_PASSWORD;
  if (!token || !password) throw new Error("Missing Netlify environment configuration");
  return {
    token,
    password,
    username: process.env.ADMIN_USERNAME || "admin",
    repo: process.env.GITHUB_REPOSITORY || "Kumarswamy-palakuri/self-linktree",
    branch: process.env.GITHUB_BRANCH || "main",
    path: process.env.GITHUB_DATA_PATH || "data/profiles.json",
  };
}

function validData(data) {
  if (!data || !Array.isArray(data.profiles) || data.profiles.length < 1 || data.profiles.length > 100) return false;
  return data.profiles.every((profile) =>
    profile && typeof profile.id === "string" && typeof profile.name === "string" &&
    typeof profile.slug === "string" && Array.isArray(profile.links) && profile.theme &&
    profile.links.every((link) => link && typeof link.id === "string" && typeof link.title === "string" && typeof link.url === "string")
  );
}

function githubUrl(config) {
  const path = config.path.split("/").map(encodeURIComponent).join("/");
  return `https://api.github.com/repos/${config.repo}/contents/${path}`;
}

async function readFile(config) {
  const response = await fetch(`${githubUrl(config)}?ref=${encodeURIComponent(config.branch)}`, {
    headers: { Authorization: `Bearer ${config.token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`GitHub read failed (${response.status})`);
  const file = await response.json();
  let content = file.content;
  if (!content && file.sha) {
    const blob = await fetch(`https://api.github.com/repos/${config.repo}/git/blobs/${file.sha}`, {
      headers: { Authorization: `Bearer ${config.token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
    });
    if (!blob.ok) throw new Error(`GitHub blob read failed (${blob.status})`);
    content = (await blob.json()).content;
  }
  return JSON.parse(Buffer.from(content.replace(/\s/g, ""), "base64").toString("utf8"));
}

async function saveFile(config, data) {
  const url = githubUrl(config);
  const current = await fetch(`${url}?ref=${encodeURIComponent(config.branch)}`, {
    headers: { Authorization: `Bearer ${config.token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
  });
  let sha;
  if (current.ok) sha = (await current.json()).sha;
  else if (current.status !== 404) throw new Error(`GitHub read failed (${current.status})`);

  const body = {
    message: "Update Ajaytips profiles from admin",
    content: Buffer.from(JSON.stringify(data, null, 2), "utf8").toString("base64"),
    branch: config.branch,
  };
  if (sha) body.sha = sha;
  const response = await fetch(url, {
    method: "PUT",
    headers: { Authorization: `Bearer ${config.token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`GitHub write failed (${response.status})`);
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: { Allow: "GET, POST, OPTIONS" }, body: "" };
  if (event.httpMethod !== "GET" && event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  let config;
  try { config = getConfig(); }
  catch { return json(503, { error: "Admin sync is not configured" }); }

  if (event.httpMethod === "GET") {
    try {
      const data = await readFile(config);
      return data ? json(200, data) : json(404, { error: "No saved profile data" });
    } catch {
      return json(502, { error: "Unable to read profile data from GitHub" });
    }
  }

  let body;
  try { body = JSON.parse(event.body || "{}"); }
  catch { return json(400, { error: "Invalid JSON" }); }

  if (body.action === "login") {
    const valid = safeEqual(body.username || "", config.username) && safeEqual(body.password || "", config.password);
    return valid ? json(200, { ok: true }) : json(401, { error: "Invalid admin credentials" });
  }

  const authorization = event.headers?.authorization || event.headers?.Authorization || "";
  const encoded = authorization.match(/^Basic\s+(.+)$/i)?.[1];
  let username = "", password = "";
  try { [username, password] = Buffer.from(encoded || "", "base64").toString("utf8").split(/:(.*)/s, 2); }
  catch { /* Invalid credentials are rejected below. */ }
  if (!safeEqual(username, config.username) || !safeEqual(password, config.password)) return json(401, { error: "Unauthorized" });
  if (body.action !== "save" || !validData(body.data)) return json(400, { error: "Invalid profile data" });
  if (Buffer.byteLength(JSON.stringify(body.data), "utf8") > 3_000_000) return json(413, { error: "Profile data is too large" });

  try {
    await saveFile(config, body.data);
    return json(200, { ok: true });
  } catch {
    return json(502, { error: "Unable to save profile data to GitHub" });
  }
}
