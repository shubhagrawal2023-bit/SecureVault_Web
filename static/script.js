const fileInput = document.getElementById("fileInput");
const fileLabel = document.getElementById("fileLabel");
const fileHint = document.getElementById("fileHint");
const dropZone = document.getElementById("dropZone");
const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");
const form = document.getElementById("vaultForm");
const working = document.getElementById("workingMessage");

fileInput.addEventListener("change", () => {
  if (fileInput.files.length) {
    const file = fileInput.files[0];
    fileLabel.textContent = file.name;
    fileHint.textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB · Selected`;
  }
});

togglePassword.addEventListener("click", () => {
  const isHidden = password.type === "password";
  password.type = isHidden ? "text" : "password";
  togglePassword.textContent = isHidden ? "HIDE" : "SHOW";
});

["dragenter", "dragover"].forEach(eventName => {
  dropZone.addEventListener(eventName, event => {
    event.preventDefault();
    dropZone.classList.add("dragging");
  });
});
["dragleave", "drop"].forEach(eventName => {
  dropZone.addEventListener(eventName, event => {
    event.preventDefault();
    dropZone.classList.remove("dragging");
  });
});
dropZone.addEventListener("drop", event => {
  const files = event.dataTransfer.files;
  if (files.length) {
    fileInput.files = files;
    fileLabel.textContent = files[0].name;
    fileHint.textContent = `${(files[0].size / 1024 / 1024).toFixed(2)} MB · Selected`;
  }
});

form.addEventListener("submit", () => {
  working.style.display = "block";
});
