/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { HttpHeaders } from "./http/headers";

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
  headers?: Partial<Record<HttpHeaders | string, string>>;
  method?: HTTP_VERBS;
  url: string;
  isPublic?: boolean;
  cacheOptions?: CacheOptions;
  onSuccess?: (response: any, originalReq?: NextRequest) => any;
}

type HTTP_VERBS = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type Nullable<T> = T | null;

export type NextjsServerActionsProps = Record<
  string,
  <T>(data?: unknown) => Promise<T | void> | T | void
>;

export type NextjsProcessFnResponse =
  | Promise<Nullable<any>>
  | Promise<Nullable<NextjsDispatcherProps>>
  | Nullable<NextjsDispatcherProps>
  | Nullable<any>
  | ((rest: unknown, req?: NextRequest) => NextjsProcessFnResponse);

  // /**
  //  * @deprecated
  //  */
// export type NextjsProcessFn =
//   | Nullable<NextjsDispatcherProps>
//   | ((rest: any, req?: NextRequest) => NextjsProcessFnResponse);

export type NextjsRouteProps = Record<string, NextjsProcessFnResponse>;

// Custom errors
export enum ErrorMetaCodes {
  // error executing route function
  ERR_EX_ROUTE_FUNCTION = "ERR_EX_ROUTE_FUNCTION",
  INVALID_CONTENT_TYPE = "INVALID_CONTENT_TYPE",
  ROUTE_KEY_NOT_REGISTERED = "ROUTE_KEY_NOT_REGISTERED",
}

interface RouteFunctionErrorMeta {
  code: ErrorMetaCodes;
  execContext?: string;
}

export class RouteFunctionError extends Error {
  meta: RouteFunctionErrorMeta;

  constructor(message: string, meta: RouteFunctionErrorMeta) {
    super(message);
    this.meta = meta;
  }
}
