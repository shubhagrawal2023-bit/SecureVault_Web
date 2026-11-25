# SecureVault Lite — Web Edition

A beginner-friendly file encryption/decryption web app built with Flask (Python), HTML, CSS, JavaScript, and the `cryptography` library.

## Features
- Web interface for file selection
- Password-based encryption and decryption
- Supports binary files (PDF, images, text, etc.)
- Download processed file from the browser
- Wrong-password and invalid-file messages
- Original local file is not modified
- 20 MB upload limit for this classroom version

## Setup (Windows / VS Code)

1. Extract this folder.
2. Open `SecureVault_Web` in VS Code.
3. Open **Terminal → New Terminal**.
4. Install dependencies:

```powershell
py -m pip install -r requirements.txt
```

5. Start the local server:

```powershell
py app.py
```

6. Open this address in Chrome or Edge:

```text
http://127.0.0.1:5000
```

Keep the terminal open while using the website. Press `Ctrl + C` in the terminal to stop the server.

## How to demonstrate
1. Make a sample text file with non-sensitive test text.
2. On the website, select the file and enter a password.
3. Click **Encrypt file** and download the `.enc` file.
4. Select that `.enc` file, enter the same password, and click **Decrypt file**.
5. Open the restored file and compare the contents.
6. Try a wrong password to demonstrate error handling.

## Project architecture
- `app.py`: Flask routes, file upload handling, and download response.
- `encryption.py`: Password key derivation and encryption/decryption functions.
- `templates/index.html`: Web page structure.
- `static/style.css`: Interface styling.
- `static/script.js`: File selection, drag-and-drop, and password visibility.

## Security / scope note
This is an educational local application, not a production-ready file security service. It does not store uploaded files permanently, but files are processed by the local Python server. Do not expose the development server to the public internet or use it for highly sensitive data. Password recovery is not available.
