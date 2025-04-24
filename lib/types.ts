/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

interface CacheOptions {
  /** Cache key for the request */
  cacheKey: string;
  /** Cache-Control max-age in seconds */
  maxAge?: number;
  sMaxAge?: number;
  staleWhileRevalidate?: number;
  staleIfError?: number;
}

export interface NextjsDispatcherProps {
  body?: unknown | null;
  headers?: Record<string, string>;
  method: HTTP_VERBS;
  url: string;
  isPublic?: boolean;
  cacheOptions?: CacheOptions;
  onSuccess?: (response: any) => any
}
type HTTP_VERBS = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type NextjsRouteProps = Record<
  string,
  (
    rest: any,
    req: NextRequest,
  ) => NextjsDispatcherProps
>;
