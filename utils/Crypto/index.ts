import crypto from "crypto";

const algorithm = "aes-256-ctr";
const secretKey = "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3";
const iv = crypto.randomBytes(16);

const getKey = (key?: string) => {
  return key
    ? key.length === 32
      ? key
      : key.length > 32
      ? key.substring(0, 32)
      : key.padEnd(32, "X")
    : secretKey;
};

export const encrypt = (text: string, key?: string) => {
  const cipher = crypto.createCipheriv(algorithm, getKey(key), iv);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
};

export const decrypt = (
  hash: { iv: string; content: string },
  key?: string
) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    getKey(key),
    Buffer.from(hash.iv, "hex")
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, "hex")),
    decipher.final(),
  ]);

  return decrpyted.toString();
};
