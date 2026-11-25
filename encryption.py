"""Encryption functions for SecureVault Lite Web."""
import base64
import hashlib
import secrets
from cryptography.fernet import Fernet, InvalidToken

MAGIC = b"SVLT"
SALT_SIZE = 16


def derive_key(password: str, salt: bytes) -> bytes:
    raw_key = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), salt, 200_000, dklen=32
    )
    return base64.urlsafe_b64encode(raw_key)


def encrypt_bytes(data: bytes, password: str) -> bytes:
    salt = secrets.token_bytes(SALT_SIZE)
    token = Fernet(derive_key(password, salt)).encrypt(data)
    return MAGIC + salt + token


def decrypt_bytes(data: bytes, password: str) -> bytes:
    if not data.startswith(MAGIC) or len(data) <= len(MAGIC) + SALT_SIZE:
        raise ValueError("Not a valid SecureVault file.")
    salt = data[len(MAGIC):len(MAGIC) + SALT_SIZE]
    token = data[len(MAGIC) + SALT_SIZE:]
    try:
        return Fernet(derive_key(password, salt)).decrypt(token)
    except InvalidToken as exc:
        raise ValueError("Wrong password or damaged encrypted file.") from exc
