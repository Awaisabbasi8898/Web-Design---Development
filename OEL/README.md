# JobPulse

## API used
  - ArbeitNow Job Board API — https://arbeitnow.com/api/job-board-api

## What the app does
  - Fetches jobs from the ArbeitNow API and displays them as cards with pagination.
  - Provides keyword + location search and a "Remote only" toggle (client-side filtering).
  - Links out to the original job posting. Navbar contains a link to the GitHub repo.

## Important files
  - `index.html` — main UI and layout (hero, search pane, stats, results, footer).
  - `main.js` — fetches jobs, implements client-side search/filtering, renders cards & pagination.
  - `app.css` — styling (theme, ribbons, layout tweaks).

## Run locally (recommended)
  1. Ensure PHP CLI is installed (or any static file server).
  2. Open a terminal in the project folder:
     - cd "c:\Users\KBR\Desktop\2022_SE_35-OEL"
  3. Start the PHP built-in server:
     - php -S 127.0.0.1:8000 -t .
  4. Open in your browser:
     - http://127.0.0.1:8000/index.html

## CORS note
  - The front-end currently fetches directly from ArbeitNow. If the browser blocks requests due to CORS, run a simple PHP proxy and point the fetch to it (or place `proxy.php` in the project root and update `main.js` BASE to `/proxy.php`).
  - Minimal proxy example (save as `proxy.php` in project root):
```php
<?php
header('Content-Type: application/json');
$up = 'https://arbeitnow.com/api/job-board-api';
$ch = curl_init($up . (isset($_SERVER['QUERY_STRING']) ? ('?' . $_SERVER['QUERY_STRING']) : ''));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_USERAGENT, 'JobPulse PHP Proxy');
$res = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE) ?: 502;
http_response_code($code);
if ($res === false) echo json_encode(['error'=>'upstream_failed']);
else echo $res;
curl_close($ch);
```

## Customization
  - Change the GitHub link shown in the navbar/footer by editing `index.html`:
    - Navbar button `#githubBtn` href
    - Footer link `#repoLink` href
  - Adjust styling in `app.css`.

## Troubleshooting
  - If jobs do not load: check browser console for network/CORS errors.
  - If images (ArbeitNow logo) fail to load, an onerror fallback will display text.

- That's all — start the PHP server and open index.html to try JobPulse locally.
---
### By Khurram Bashir Raja(2022-SE-35) & Awais Abbasi(2022-SE-29) 