/**
 * Listing image handling, matching the Android ImageUtils contract: images are
 * stored inline in listings.imageUrl as a JPEG data URI, max 600px on the long
 * side and under Firestore's 250,000-character rule limit. No Cloud Storage is
 * used by either client.
 */
export const MAX_IMAGE_INPUT_BYTES = 10 * 1024 * 1024;
export const MAX_DATA_URI_CHARS = 250_000;
export const MAX_DIMENSION = 600;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export function validateImageFile(file: { type: string; size: number }): string | null {
  if (!ACCEPTED.includes(file.type)) return "Use a JPG, PNG or WebP image.";
  if (file.size > MAX_IMAGE_INPUT_BYTES) return "Image must be smaller than 10 MB.";
  return null;
}

export function scaledSize(w: number, h: number, max = MAX_DIMENSION) {
  if (w <= max && h <= max) return { width: w, height: h };
  const ratio = w / h;
  return ratio > 1
    ? { width: max, height: Math.max(1, Math.round(max / ratio)) }
    : { width: Math.max(1, Math.round(max * ratio)), height: max };
}

/** Browser-only: decode, downscale and JPEG-compress until it fits the rule limit. */
export async function imageFileToDataUri(file: File): Promise<string> {
  const err = validateImageFile(file);
  if (err) throw new Error(err);
  const bitmap = await createImageBitmap(file);
  const { width, height } = scaledSize(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process this image.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  for (let q = 0.8; q >= 0.35; q -= 0.15) {
    const uri = canvas.toDataURL("image/jpeg", q);
    if (uri.length <= MAX_DATA_URI_CHARS - 1000) return uri;
  }
  throw new Error("This image is too detailed to upload. Try a smaller photo.");
}
