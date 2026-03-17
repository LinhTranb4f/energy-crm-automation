import type { APIRequestContext, APIResponse } from "@playwright/test";
import { getEnv } from "./env";

export type RequestOptions = {
  baseURL?: string;
  token?: string;
  headers?: Record<string, string>;
  timeoutMs?: number;
};

export class RequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: string,
    public readonly requestInfo?: { method: string; url: string; body?: unknown },
  ) {
    super(message);
    this.name = "RequestError";
  }
}

/**
 * Creates a request utility bound to Playwright's APIRequestContext.
 * Existing tests that use fetch + hubspot.ts remain unchanged; new tests
 * can opt into this wrapper for richer logging and env-based config.
 */
export function createBaseRequest(
  request: APIRequestContext,
  options?: RequestOptions,
) {
  const env = getEnv();
  const baseURL = (options?.baseURL ?? env.HUBSPOT_BASE_URL).replace(/\/$/, "");
  const token = options?.token ?? env.HUBSPOT_ACCESS_TOKEN;
  const timeoutMs = options?.timeoutMs ?? 30_000;
  const mergedHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers ?? {}),
  };

  async function handleResponse<T>(
    response: APIResponse,
    method: string,
    url: string,
    body?: unknown,
  ): Promise<T> {
    const status = response.status();
    const text = await response.text();

    if (status >= 400) {
      // Log a concise but useful failure payload for debugging.
      console.error("[baseRequest FAILURE]", {
        method,
        url,
        status,
        body:
          body != null && typeof body !== "string"
            ? JSON.stringify(body).slice(0, 300)
            : body,
        responseBody: text.slice(0, 500),
      });
      throw new RequestError(
        `${method} ${url} → ${status}: ${text.slice(0, 200)}`,
        status,
        text,
        { method, url, body },
      );
    }

    if (text.length === 0) return undefined as T;
    try {
      return JSON.parse(text) as T;
    } catch {
      throw new RequestError(
        `Invalid JSON: ${method} ${url}`,
        status,
        text,
        { method, url, body },
      );
    }
  }

  return {
    async get<T = unknown>(
      path: string,
      params?: Record<string, string | number>,
    ): Promise<T> {
      const url = path.startsWith("http")
        ? path
        : params
          ? `${baseURL}${path}?${new URLSearchParams(
              params as Record<string, string>,
            )}`
          : `${baseURL}${path}`;
      const response = await request.get(url, {
        headers: mergedHeaders,
        timeout: timeoutMs,
      });
      return handleResponse<T>(response, "GET", url);
    },

    async post<T = unknown>(path: string, body: unknown): Promise<T> {
      const url = path.startsWith("http") ? path : `${baseURL}${path}`;
      const response = await request.post(url, {
        headers: mergedHeaders,
        data: body,
        timeout: timeoutMs,
      });
      return handleResponse<T>(response, "POST", url, body);
    },

    async patch<T = unknown>(path: string, body: unknown): Promise<T> {
      const url = path.startsWith("http") ? path : `${baseURL}${path}`;
      const response = await request.patch(url, {
        headers: mergedHeaders,
        data: body,
        timeout: timeoutMs,
      });
      return handleResponse<T>(response, "PATCH", url, body);
    },

    async delete(path: string): Promise<void> {
      const url = path.startsWith("http") ? path : `${baseURL}${path}`;
      const response = await request.delete(url, {
        headers: mergedHeaders,
        timeout: timeoutMs,
      });
      if (response.status() !== 204) {
        const text = await response.text();
        console.error("[baseRequest FAILURE]", {
          method: "DELETE",
          url,
          status: response.status(),
          responseBody: text.slice(0, 500),
        });
        throw new RequestError(
          `DELETE ${url} → ${response.status()}`,
          response.status(),
          text,
          { method: "DELETE", url },
        );
      }
    },
  };
}

export type BaseRequest = ReturnType<typeof createBaseRequest>;

