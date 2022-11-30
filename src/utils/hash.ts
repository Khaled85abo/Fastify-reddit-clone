import crypto from "crypto";
export function hashPassword(pass: string) {
  const salt = crypto.randomBytes(16).toString("hex");

  const hash = crypto
    .pbkdf2Sync(pass, salt, 1000, 64, "sha512")
    .toString("hex");
  return { hash, salt };
}

export function verfiyPassword({
  candidatePass,
  salt,
  hash,
}: {
  candidatePass: string;
  salt: string;
  hash: string;
}) {
  const candidateHash = crypto
    .pbkdf2Sync(candidatePass, salt, 1000, 64, "sha512")
    .toString("hex");
  return candidateHash === hash;
}
