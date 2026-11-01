# LinkSpace V2 — Vanilla HTML/CSS/JavaScript

## Run
1. Extract the ZIP.
2. Open `index.html` in a browser, preferably through VS Code Live Server.
3. Click the ✳ button to open admin.
4. Local preview credentials: `admin` / `admin123`.

## Netlify setup

The Netlify Function in `netlify/functions/profile-data.mjs` reads and writes profile content in the connected GitHub repository. The first admin save creates `data/profiles.json`; later admin edits commit updates to that file. GitHub commits trigger the usual Netlify deploy. The GitHub token stays in Netlify and is never sent to the browser.

In Netlify, open **Site configuration → Environment variables** and add:

- `GITHUB_TOKEN`: a fine-grained GitHub token restricted to this repository, with **Contents: Read and write** permission.
- `ADMIN_PASSWORD`: a strong password for the deployed admin panel.

Optional variables:

- `ADMIN_USERNAME` (defaults to `admin`)
- `GITHUB_REPOSITORY` (defaults to `Kumarswamy-palakuri/self-linktree`)
- `GITHUB_BRANCH` (defaults to `main`)
- `GITHUB_DATA_PATH` (defaults to `data/profiles.json`)

After setting the variables, trigger a Netlify deploy so the function receives them. Use the configured username and password in the deployed admin panel. Do not put the GitHub token in frontend files or share it in chat.

## Features
- Multiple profile pages managed in one browser
- Profile name, bio, image and slug editor
- Link create, edit, delete and reorder
- Local click and profile-view counters
- Per-profile theme colors and settings
- QR code generation and PNG download
- Share profile URL
- Responsive mobile-first UI
- GitHub-backed profile persistence on Netlify, with local browser cache

## Profile URLs
The app uses a query-string slug, for example `index.html?p=aditya-ranjan`. When hosted, the same pattern works on your site URL, such as `https://yourdomain.com/?p=aditya-ranjan`.

## Important limitations
On Netlify, profile content (profile details, links, appearance and avatar) is read from and committed to the GitHub data file. View and click analytics remain local to each visitor's browser. The admin password is checked by the Netlify Function; the GitHub token remains server-side. Local preview mode still uses the demo password and browser storage only. Multiple profiles are managed within this one site, not separate hosted user accounts.

The QR code library is loaded from cdnjs, so QR generation requires an internet connection.
