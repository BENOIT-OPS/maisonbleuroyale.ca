/** Extrait un message d’erreur lisible depuis la réponse JSON de `/api/contact`. */
export function readContactApiError(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") return fallback;
  const e = (body as { error?: unknown }).error;
  if (typeof e === "string" && e.trim().length > 0) return e;
  return fallback;
}
