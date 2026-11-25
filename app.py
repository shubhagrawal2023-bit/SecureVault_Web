from flask import Flask, render_template, request, send_file
from werkzeug.utils import secure_filename
import io
from encryption import encrypt_bytes, decrypt_bytes

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 20 * 1024 * 1024  # 20 MB


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/process", methods=["POST"])
def process_file():
    uploaded = request.files.get("file")
    password = request.form.get("password", "")
    action = request.form.get("action", "")

    if not uploaded or not uploaded.filename:
        return render_template("index.html", error="Please select a file.")
    if not password:
        return render_template("index.html", error="Please enter a password.")
    if action not in ("encrypt", "decrypt"):
        return render_template("index.html", error="Choose Encrypt or Decrypt.")

    filename = secure_filename(uploaded.filename) or "uploaded_file"
    data = uploaded.read()

    try:
        if action == "encrypt":
            output = encrypt_bytes(data, password)
            output_name = filename + ".enc"
        else:
            output = decrypt_bytes(data, password)
            output_name = filename[:-4] if filename.endswith(".enc") else filename + ".restored"

        return send_file(
            io.BytesIO(output),
            as_attachment=True,
            download_name=output_name,
            mimetype="application/octet-stream"
        )
    except ValueError as error:
        return render_template("index.html", error=str(error))
    except Exception:
        app.logger.exception("SecureVault processing error")
        return render_template("index.html", error="An unexpected error occurred.")


@app.errorhandler(413)
def file_too_large(_error):
    return render_template("index.html", error="File too large. Maximum size is 20 MB."), 413


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)
