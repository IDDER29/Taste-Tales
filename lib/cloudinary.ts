import crypto from "crypto";
import { ApiError } from "./errors";

// Server-side Cloudinary signing. The API secret lives ONLY here.
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

export const isCloudinarySigningConfigured = (): boolean =>
  Boolean(CLOUD_NAME && API_KEY && API_SECRET);

export interface SignedUpload {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
}

/**
 * Produce a signed-upload payload the browser can POST directly to Cloudinary.
 * The signature covers exactly the params the client must echo back (folder,
 * timestamp), per Cloudinary's signed-upload spec.
 */
export function signUpload(folder = "taste-tales"): SignedUpload {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    throw new ApiError("SERVICE_UNAVAILABLE", "Image uploads are not configured.");
  }
  const timestamp = Math.floor(Date.now() / 1000);
  const params: Record<string, string | number> = { folder, timestamp };
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  const signature = crypto
    .createHash("sha1")
    .update(toSign + API_SECRET)
    .digest("hex");

  return { cloudName: CLOUD_NAME, apiKey: API_KEY, timestamp, signature, folder };
}
