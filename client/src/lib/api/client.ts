// Base HTTP client with error handling and timeout.

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";
const TIMEOUT_MS = 300_000; // 5 minutes — BLIP + LLM can be very slow sometimes

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
    });

    clearTimeout(timer);

    if (!res.ok) {
      let details: unknown;
      try {
        details = await res.json();
      } catch {
        details = await res.text();
      }
      throw new ApiError(res.status, `Request failed: ${res.statusText}`, details);
    }

    return (await res.json()) as T;
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof ApiError) throw err;
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError(408, "Request timed out. The analysis is taking too long.");
    }
    throw new ApiError(0, "Network error. Please check your connection.");
  }
}

// Upload a file to local server instead of imgbb (kept function name to avoid breaking imports)
export async function uploadToImgbb(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000); // 15 seconds local upload timeout

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/vision/upload`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) {
      throw new Error(`Local upload failed: ${res.statusText}`);
    }

    const data = await res.json();
    return data.url as string;
  } catch (err) {
    clearTimeout(timer);
    console.error("Local file upload failed, fallback to direct upload: ", err);
    throw err;
  }
}
