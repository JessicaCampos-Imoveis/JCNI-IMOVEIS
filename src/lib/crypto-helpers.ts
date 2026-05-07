/**
 * crypto-helpers.ts
 * AES-256-GCM para criptografar/descriptografar chaves de API em repouso.
 * A chave de derivacao e lida de CHAT_ENCRYPTION_KEY (ou JWT_SECRET como fallback).
 */
import {
  randomBytes,
  createCipheriv,
  createDecipheriv,
  createHash,
} from "crypto";

function deriveKey(): Buffer {
  const secret =
    process.env.CHAT_ENCRYPTION_KEY ??
    process.env.JWT_SECRET ??
    "jcni-insecure-dev-key-change-in-production";
  return createHash("sha256").update(secret, "utf8").digest();
}

/**
 * Criptografa um texto (ex.: API key) com AES-256-GCM.
 * Retorna base64 no formato: IV(12) + AuthTag(16) + Ciphertext.
 */
export function encryptApiKey(plaintext: string): string {
  const key = deriveKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

/**
 * Descriptografa um texto previamente cifrado por encryptApiKey.
 * Lanca erro se o ciphertext for invalido ou adulterado.
 */
export function decryptApiKey(encoded: string): string {
  const key = deriveKey();
  const buf = Buffer.from(encoded, "base64");
  if (buf.length < 29) throw new Error("Dados criptografados invalidos.");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const enc = buf.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return decipher.update(enc).toString("utf8") + decipher.final("utf8");
}
