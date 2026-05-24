import 'server-only';

import { headers as nextHeaders } from 'next/headers';

const DEFAULT_BACKEND_URL = 'http://localhost:4000';

export type ApiRequestInit = RequestInit & {
  forwardCookie?: boolean;
  json?: unknown;
};

export interface ApiClient {
  fetch(path: string, init?: ApiRequestInit): Promise<Response>;
  get<T>(path: string, init?: ApiRequestInit): Promise<T>;
  post<T>(path: string, json?: unknown, init?: ApiRequestInit): Promise<T>;
  put<T>(path: string, json?: unknown, init?: ApiRequestInit): Promise<T>;
  patch<T>(path: string, json?: unknown, init?: ApiRequestInit): Promise<T>;
  delete<T>(path: string, init?: ApiRequestInit): Promise<T>;
}

function getBackendUrl(): string {
  return (process.env.BACKEND_URL ?? DEFAULT_BACKEND_URL).replace(/\/+$/, '');
}

export function getBackendApiUrl(): string {
  return `${getBackendUrl().replace(/\/api$/, '')}/api`;
}

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export class ServerFetchClient implements ApiClient {
  constructor(private readonly baseUrl: string) {}

  async fetch(path: string, init: ApiRequestInit = {}): Promise<Response> {
    const { forwardCookie: _forwardCookie, json, ...requestInit } = init;
    const headers = await this.buildHeaders(init);

    return fetch(this.resolveUrl(path), {
      cache: 'no-store',
      ...requestInit,
      headers,
      body: json === undefined ? requestInit.body : JSON.stringify(json),
    });
  }

  async get<T>(path: string, init?: ApiRequestInit): Promise<T> {
    return this.request<T>('GET', path, undefined, init);
  }

  async post<T>(
    path: string,
    json?: unknown,
    init?: ApiRequestInit,
  ): Promise<T> {
    return this.request<T>('POST', path, json, init);
  }

  async put<T>(
    path: string,
    json?: unknown,
    init?: ApiRequestInit,
  ): Promise<T> {
    return this.request<T>('PUT', path, json, init);
  }

  async patch<T>(
    path: string,
    json?: unknown,
    init?: ApiRequestInit,
  ): Promise<T> {
    return this.request<T>('PATCH', path, json, init);
  }

  async delete<T>(path: string, init?: ApiRequestInit): Promise<T> {
    return this.request<T>('DELETE', path, undefined, init);
  }

  private async request<T>(
    method: string,
    path: string,
    json?: unknown,
    init?: ApiRequestInit,
  ): Promise<T> {
    const res = await this.fetch(path, { ...init, method, json });
    return parseJson<T>(res);
  }

  private resolveUrl(path: string): string {
    if (/^https?:\/\//.test(path)) {
      return path;
    }

    return `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  }

  private async buildHeaders(init?: ApiRequestInit): Promise<Headers> {
    const headers = new Headers(init?.headers);

    if (init?.json !== undefined && !headers.has('content-type')) {
      headers.set('content-type', 'application/json');
    }

    if (init?.forwardCookie !== false && !headers.has('cookie')) {
      const requestHeaders = await nextHeaders();
      const cookie = requestHeaders.get('cookie');

      if (cookie) {
        headers.set('cookie', cookie);
      }
    }

    return headers;
  }
}

export const api = new ServerFetchClient(getBackendApiUrl());
