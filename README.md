# LinkSpace V2 — Vanilla HTML/CSS/JavaScript

## Run
1. Extract the ZIP.
2. Open `index.html` in a browser, preferably through VS Code Live Server.
3. Click the ✳ button to open admin.
4. Demo credentials: `admin` / `admin123`.

## Features
- Multiple profile pages managed in one browser
- Profile name, bio, image and slug editor
- Link create, edit, delete and reorder
- Local click and profile-view counters
- Per-profile theme colors and settings
- QR code generation and PNG download
- Share profile URL
- Responsive mobile-first UI
- Browser localStorage persistence

## Profile URLs
The app uses a query-string slug, for example `index.html?p=aditya-ranjan`. When hosted, the same pattern works on your site URL, such as `https://yourdomain.com/?p=aditya-ranjan`.

## Important limitations
This is a frontend-only demo. The admin login (`admin` / `admin123`) is not secure: anyone who can inspect the JavaScript can see it. Profile data and analytics are stored only in the current browser. Multiple profiles are local profiles, not separate hosted user accounts. Real secure authentication, public profile hosting, reliable analytics, custom routes/domains and cross-device sync require a backend and database.

The QR code library is loaded from cdnjs, so QR generation requires an internet connection.
