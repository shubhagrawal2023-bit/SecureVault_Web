# SecureVault Lite — GitHub Pages + Render Edition

This version publishes the **frontend on GitHub Pages** and runs the **Python/Flask encryption API on Render**.

GitHub Pages only hosts static files; it cannot run Python. The browser frontend therefore sends file data to the Flask API hosted separately.

## Folder structure

```text
SecureVault_GitHubPages_Render/
├── app.py                 # Flask API (deploy to Render)
├── encryption.py          # Password key derivation + Fernet encryption
├── requirements.txt
├── .gitignore
└── docs/                  # Publish this folder with GitHub Pages
    ├── index.html
    ├── style.css
    ├── script.js
    └── config.js
```

## Part A — Publish the Python backend on Render

1. Push the contents of this folder to your GitHub repository.
2. On Render, create a **New → Web Service** and connect the repository. Authorize Render to access this repository if it is private.
3. Set:
   - Runtime: `Python 3`
   - Build command: `pip install -r requirements.txt`
   - Start command: `gunicorn app:app --bind 0.0.0.0:$PORT`
4. Add environment variable:
   - Key: `FRONTEND_ORIGIN`
   - Value: `https://shubhagrawal2023-bit.github.io`
5. Deploy. Copy the service URL, for example `https://your-service-name.onrender.com`.

## Part B — Connect the frontend to Render

Open `docs/config.js` and replace:

```javascript
API_BASE_URL: "https://YOUR-RENDER-SERVICE.onrender.com"
```

with the actual Render service URL, e.g.:

```javascript
API_BASE_URL: "https://your-service-name.onrender.com"
```

Commit and push this change to GitHub.

## Part C — Enable GitHub Pages

For GitHub Free, the repository must be public to publish a Pages site.

1. In GitHub, open the repository → **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch `main` and folder `/docs`.
4. Click **Save**.
5. Wait for the Pages deployment to finish. GitHub will display the website URL under Settings → Pages.

For the repository `SecureVault_Web` owned by `shubhagrawal2023-bit`, the expected project URL is:

`https://shubhagrawal2023-bit.github.io/SecureVault_Web/`

## Local development

1. Install dependencies: `py -m pip install -r requirements.txt`
2. Start backend: `py app.py`
3. In `docs/config.js`, temporarily set `API_BASE_URL` to `http://127.0.0.1:5000`.
4. Open `docs/index.html` using VS Code Live Server or another static server.

The browser origin must be allowed by CORS. For local development, temporarily set `FRONTEND_ORIGIN` to the local origin shown by Live Server, for example `http://127.0.0.1:5500`.

## Security and limitations

- Educational demonstration only; not a professionally audited security service.
- Maximum upload size is 20 MB.
- The backend processes uploads in memory and does not intentionally save uploaded files to disk.
- Render free web services can spin down after inactivity so the first request may be delayed.
- Do not upload confidential documents, real cryptocurrency wallet files, or private keys.
- Use a strong unique password; password recovery is not available.
- The repository source code is public when using GitHub Free Pages on a public repository; do not commit secrets.

## Project team

- **Shubh Agrawal** — Team Leader — `S26CSEU0383`
- **Aditya Ved** — Team Member — `S26CSEU0378`
- **Pranjul Agrawal** — Team Member — `S26CSEU0359`
- **Raghav Tiwari** — Team Member — `S26CSEU0362`
- **Lakshay** — Team Member — `S26CSEU0380`
