# Ajaytips — Ajay Sir Linktree

A link-in-bio website for **Ajay Sir** (**Ajaytips**), Quantitative Aptitude & Reasoning Expert. Built with vanilla HTML, modern CSS, and JavaScript with support for local preview and Netlify GitHub-backed persistence.

## Run
1. Open `index.html` in a browser, preferably through VS Code Live Server or any static web server.
2. Click the ✳ button at the top-left to open the Admin dashboard.
3. Local preview demo credentials: `admin` / `admin123`.

## Official Links Included
- **YouTube Channel**: [Ajaytips (@ajaytips0806)](https://www.youtube.com/@ajaytips0806)
- **Android App**: [Ajaytips App on Google Play Store](https://play.google.com/store/apps/details?id=com.diy18.ajaytips)
- **WhatsApp Channel**: [Ajaytips Official Broadcast](https://whatsapp.com/channel/0029Vajra07KGGGDcCB23G1G)
- **Instagram**: [@ajay_tips](https://www.instagram.com/ajay_tips)
- **Telegram**: [Ajaytips Official Channel](https://t.me/ajaytips)
- **X (Twitter)**: [@ajay_tips](https://x.com/ajay_tips)

## Netlify Setup

The Netlify Function in `netlify/functions/profile-data.mjs` reads and writes profile content in the connected GitHub repository (`data/profiles.json`). Commits made via the admin panel trigger Netlify automatic deployments.

In Netlify, open **Site configuration → Environment variables** and add:
- `GITHUB_TOKEN`: A fine-grained GitHub token restricted to this repository, with **Contents: Read and write** permission.
- `ADMIN_PASSWORD`: A strong password for your deployed admin panel.

Optional variables:
- `ADMIN_USERNAME` (defaults to `admin`)
- `GITHUB_REPOSITORY` (defaults to `Kumarswamy-palakuri/self-linktree`)
- `GITHUB_BRANCH` (defaults to `main`)
- `GITHUB_DATA_PATH` (defaults to `data/profiles.json`)

Open `https://your-site.netlify.app/admin` to go directly to the admin sign-in page.

## Features
- Mobile-first responsive Linktree design with smooth animations
- Verified educator profile presentation for Ajay Sir
- Profile avatar with custom "AJ" monogram badge fallback and custom image upload
- Dynamic links manager: create, reorder (up/down), edit, and remove links
- Supported platforms: YouTube, Play Store / App, WhatsApp, Telegram, Instagram, X (Twitter), Facebook, Website, Education
- Per-profile theme customization: background color, card color, text color, and new-tab toggle
- QR code generator with one-click PNG download and share link button
- Built-in analytics for page views and link clicks
- GitHub-backed persistence on Netlify with automatic local fallback

## Profile URLs
The app uses a query-string slug, for example:
- `index.html?p=ajaytips`
- `index.html?p=ajay-sir`
When hosted on a domain: `https://yourdomain.com/?p=ajaytips` (default is root `/`).
