import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { buildJSONBody } from "./lib/helpers";
import { NextjsDispatcherProps, NextjsRouteProps } from "./types";
import { cache } from "./lib/lmdb";
import { error, success } from "./responses";

class Error {
  constructor(message: string, options?: { cause?: string }) {
    this.message = message;
    this.cause = options?.cause;
  }
  message: string;
  cause?: string;
}

class BaseDispatcherHandler {
  routes: NextjsRouteProps;

  init(routes: NextjsRouteProps) {
    this.routes = routes;
  }

  routeIsRegistered(_routeKey: string): boolean {
    if (!_routeKey || !this.routes[_routeKey]) {
      const error =
        "Invalid request. route_key invalid or missing, given value " +
        _routeKey;
      throw new Error(error, {
        cause: "invalid_route",
      });
    }
    return true;
  }

  async unpackRequest(
    formContentType: undefined | string,
    req: NextRequest
  ): Promise<NextjsDispatcherProps> {
    let requestData: FormData | Record<string, unknown> | null = null;

    if (!formContentType) throw new Error("invalid content type");

    let routeKeyname: string = "";

    if (formContentType === "application/json") {
      const { route_key, ...rest } = await req.json();

      routeKeyname = route_key;

      requestData = rest;

      this.routeIsRegistered(routeKeyname);
    }

    if (formContentType === "multipart/form-data") {
      const formData = await req.formData();

      routeKeyname = (formData.get("route_key") as string) ?? "";

      requestData = formData;

      this.routeIsRegistered(routeKeyname);
    }

    if (requestData == null) throw new Error("Invalid content type");

    const builtRoute = this.routes[routeKeyname]?.(requestData, req);

    return {
      ...builtRoute,
    };
  }

  async executeRequest(unpackedRequest: NextjsDispatcherProps) {
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
  }
}

const handler = new BaseDispatcherHandler();

export default handler;

export async function POST(request: NextRequest) {
  try {
    const formContentType = (await headers())
      .get("content-type")
      ?.split(";")[0];

    const unpackedRequest = await handler.unpackRequest(
      formContentType,
      request
    );

    let response = {};

    if (unpackedRequest.cacheOptions) {
      console.log("cache", unpackedRequest.cacheOptions);
      response = cache(
        unpackedRequest.cacheOptions.cacheKey,
        () => handler.executeRequest(unpackedRequest),
        unpackedRequest.cacheOptions.maxAge
      );
    }

    response = await handler.executeRequest(unpackedRequest);

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
