// Cloudinary image upload from the browser.
//
// Preferred path: request a SIGNED upload payload from our server
// (/api/v1/uploads/sign) — the API secret stays server-side. If signing isn't
// configured yet, fall back to the legacy unsigned preset so uploads still work.
const CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dvnwx89ao";
const UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "cg4zfcut";

async function uploadSigned(file: File): Promise<string | null> {
  const signRes = await fetch("/api/v1/uploads/sign", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ folder: "taste-tales" }),
  });
  if (!signRes.ok) return null; // not configured / unauthorized -> caller falls back

  const { data } = await signRes.json();
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", data.apiKey);
  form.append("timestamp", String(data.timestamp));
  form.append("signature", data.signature);
  form.append("folder", data.folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`,
    { method: "POST", body: form }
  );
  if (!res.ok) throw new Error("Image upload failed.");
  const json = await res.json();
  return json.secure_url as string;
}

async function uploadUnsigned(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: form }
  );
  if (!res.ok) throw new Error("Image upload failed.");
  const json = await res.json();
  return json.secure_url as string;
}

/**
 * Upload a single image file to Cloudinary and return its secure URL.
 * Uses signed uploads when available, otherwise the unsigned preset.
 */
export const uploadImage = async (file: File): Promise<string> => {
  const signed = await uploadSigned(file).catch(() => null);
  if (signed) return signed;
  return uploadUnsigned(file);
};
