import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { buildJSONBody } from "./lib/helpers";
import { NextjsDispatcherProps, NextjsRouteProps } from "./lib/types";
import { cache } from "./lib/lmdb";

class Error {
  constructor(message: string, options?: { cause?: string }) {
    this.message = message;
    this.cause = options?.cause;
  }
  message: string;
  cause?: string;
}


const routeIsRegistered = (NextjsAPIRoutes, _routeKey: string): boolean => {
  if (!_routeKey || !NextjsAPIRoutes[_routeKey]) {
    const error =
      "Invalid request. route_key invalid or missing, given value " + _routeKey;
    throw new Error(error, {
      cause: "invalid_route",
    });
  }
  return true;
};

const unpackRequest = async (
  NextjsAPIRoutes,
  formContentType: undefined | string,
  req: NextRequest
): Promise<NextjsDispatcherProps> => {
  let requestData: FormData | Record<string, unknown> | null = null;

  if (!formContentType) throw new Error("invalid content type");

  let routeKeyname: string = "";

  if (formContentType === "application/json") {
    const { route_key, ...rest } = await req.json();

    routeKeyname = route_key;

    requestData = rest;

    routeIsRegistered(NextjsAPIRoutes, routeKeyname);
  }

  if (formContentType === "multipart/form-data") {
    const formData = await req.formData();

    routeKeyname = (formData.get("route_key") as string) ?? "";

    requestData = formData;

    routeIsRegistered(NextjsAPIRoutes, routeKeyname);
  }

  if (requestData == null) throw new Error("Invalid content type");

  const builtRoute = NextjsAPIRoutes[routeKeyname]?.(requestData, req);

  return {
    ...builtRoute,
  };
};

const executeRequest = async (unpackedRequest: NextjsDispatcherProps) => {
  console.log(
    "🚀   hitting route " + unpackedRequest.method,
    unpackedRequest.url
  );
  const response = await fetch(unpackedRequest.url, {
    method: unpackedRequest.method,
    headers: {
      "content-type": "application/json",
    },
    ...(unpackedRequest.method != "GET"
      ? { body: buildJSONBody(unpackedRequest.body) }
      : {}),
  });

  const responseData = await response.json();

  return responseData;
};

let NextjsAPIRoutes: NextjsRouteProps = {};

export const initNextjsAPIRoutes = (NextjsAPIRoutesProps: NextjsRouteProps) => {
  NextjsAPIRoutes = NextjsAPIRoutesProps;
  console.log("🚀   NextjsAPIRoutes initialized", NextjsAPIRoutes);
};

export async function POST(request: NextRequest) {
  try {
    const formContentType = (await headers())
      .get("content-type")
      ?.split(";")[0];

    const unpackedRequest = await unpackRequest(
      NextjsAPIRoutes,
      formContentType,
      request
    );

    let response = {};

    if (unpackedRequest.cacheOptions) {
      console.log("cache", unpackedRequest.cacheOptions);
      response = cache(
        unpackedRequest.cacheOptions.cacheKey,
        () => executeRequest(unpackedRequest),
        unpackedRequest.cacheOptions.maxAge
      );
    }

    response = await executeRequest(unpackedRequest);

    if (unpackedRequest.onSuccess) {
      return success(unpackedRequest.onSuccess(response));
    }

    return success(response);
  } catch (e: unknown) {
    const _error = e as Error;

    if (_error.cause == "invalid_route") {
      return error({ error: _error.message }, 404);
    }

    return error({ error: _error });
  }
}

// shorts
export const success = (
  data: unknown,
  code: number = 200
): NextResponse | never =>
  new NextResponse(JSON.stringify(data), { status: code });

export const error = (
  data: unknown,
  code: number = 500
): NextResponse | never =>
  new NextResponse(JSON.stringify(data), { status: code });
