const form = document.getElementById("vaultForm");
const fileInput = document.getElementById("fileInput");
const fileLabel = document.getElementById("fileLabel");
const fileHint = document.getElementById("fileHint");
const dropZone = document.getElementById("dropZone");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const message = document.getElementById("message");
const working = document.getElementById("workingMessage");
const actionButtons = [...document.querySelectorAll("[data-action]")];

function showMessage(text, type) {
  message.textContent = text;
  message.className = `alert ${type}`;
  message.hidden = false;
}

function clearMessage() {
  message.hidden = true;
  message.textContent = "";
}

function updateSelectedFile(file) {
  if (!file) return;
  fileLabel.textContent = file.name;
  fileHint.textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB · Selected`;
}

fileInput.addEventListener("change", () => updateSelectedFile(fileInput.files[0]));

togglePassword.addEventListener("click", () => {
  const show = passwordInput.type === "password";
  passwordInput.type = show ? "text" : "password";
  togglePassword.textContent = show ? "HIDE" : "SHOW";
});

["dragenter", "dragover"].forEach(name => {
  dropZone.addEventListener(name, event => {
    event.preventDefault();
    dropZone.classList.add("dragging");
  });
});
["dragleave", "drop"].forEach(name => {
  dropZone.addEventListener(name, event => {
    event.preventDefault();
    dropZone.classList.remove("dragging");
  });
});
dropZone.addEventListener("drop", event => {
  const files = event.dataTransfer.files;
  if (files.length) {
    fileInput.files = files;
    updateSelectedFile(files[0]);
  }
});

actionButtons.forEach(button => {
  button.addEventListener("click", () => {
    form.dataset.action = button.dataset.action;
  });
});

form.addEventListener("submit", async event => {
  event.preventDefault();
  clearMessage();

  const file = fileInput.files[0];
  const password = passwordInput.value;
  const action = form.dataset.action;

  if (!file) return showMessage("Please select a file.", "error");
  if (!password) return showMessage("Please enter a password.", "error");
  if (!action) return showMessage("Choose Encrypt or Decrypt.", "error");

  const apiBase = window.SECUREVAULT_CONFIG?.API_BASE_URL || "";
  if (!apiBase || apiBase.includes("YOUR-RENDER-SERVICE")) {
    return showMessage("The Python backend URL has not been configured yet. Follow the README deployment steps.", "error");
  }

  const body = new FormData();
  body.append("file", file);
  body.append("password", password);
  body.append("action", action);

  working.hidden = false;
  actionButtons.forEach(button => button.disabled = true);

  try {
    const response = await fetch(`${apiBase.replace(/\/$/, "")}/api/process`, {
      method: "POST",
      body
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(result.error || `Request failed (${response.status}).`);
    }

    const blob = await response.blob();
    const fallbackName = action === "encrypt"
      ? `${file.name}.enc`
      : (file.name.endsWith(".enc") ? `restored_${file.name.slice(0, -4)}` : `restored_${file.name}`);
    const disposition = response.headers.get("Content-Disposition") || "";
    const match = disposition.match(/filename="?([^";]+)"?/i);
    const filename = match ? match[1] : fallbackName;

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    showMessage(`${action === "encrypt" ? "Encryption" : "Decryption"} completed. Your download should begin shortly.`, "success");
  } catch (error) {
    showMessage(error.message || "Unable to contact the Python backend.", "error");
  } finally {
    working.hidden = true;
    actionButtons.forEach(button => button.disabled = false);
    passwordInput.value = "";
  }
});
