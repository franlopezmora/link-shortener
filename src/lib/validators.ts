export function isValidSlug(v: string) {
  return /^[a-z0-9-]{3,100}$/.test(v);
}
export function isValidUrl(v: string) {
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
