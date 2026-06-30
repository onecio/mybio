const allowedProtocols = new Set(["http:", "https:"]);

export function isSafeHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return allowedProtocols.has(url.protocol) && Boolean(url.hostname);
  } catch {
    return false;
  }
}

export function getSafeHttpUrl(value: unknown) {
  return typeof value === "string" && isSafeHttpUrl(value) ? value : null;
}

export function getSafeInternalPath(value: string | null | undefined, fallback = "/dashboard") {
  if (value?.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) {
    return value;
  }

  return fallback;
}
