import crypto from "crypto";

export const generateHash = (data) => {
  return crypto
    .createHmac("sha256", process.env.HASH_SECRET_KEY)
    .update(data)
    .digest("hex");
};
