import { cache } from "./cache/lmdb";
import { ErrorResponse, SuccessResponse } from "./http/responses";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { buildJSONBody } from "./helpers";
import settings from "./settings.json";
import {
  ErrorMetaCodes,
  NextjsDispatcherProps,
  NextjsProcessFnResponse,
  NextjsRouteProps,
  RouteFunctionError,
} from "./types";
import { FORM_ENC_TYPES } from "./constants";
import { HttpHeaders } from "./http/headers";

export const __VERSION = settings.version;
export const __ALLOW_CORS = settings.cors;

const routeIsRegistered = (_routeKey: string): boolean => {
  if (!_routeKey || !globalRoutes[_routeKey]) {
    throw new RouteFunctionError(
      `Invalid request. route_key invalid or missing, given value '${_routeKey}'.`,
      { code: ErrorMetaCodes.ROUTE_KEY_NOT_REGISTERED }
    );
  }
  return true;
};

const unpackRequest = async (
  request: NextRequest
): Promise<NextjsProcessFnResponse> => {
  const formContentType = (await headers()).get("content-type")?.split(";")[0];

  if (!formContentType)
    throw new RouteFunctionError("We cant not identify content-type header", {
      code: ErrorMetaCodes.INVALID_CONTENT_TYPE,
    });

  let routeKeyname = "",
    requestData: FormData | Record<string, unknown> | null = null;

  if (formContentType === FORM_ENC_TYPES["json"]) {
    const { route_key, ...rest } = await request.json();

    routeKeyname = route_key;

    requestData = rest;
  }

  if (formContentType === FORM_ENC_TYPES["form-data"]) {
    const formData = await request.formData();

    routeKeyname = (formData.get("route_key") as string) ?? "";

    requestData = formData;
  }

  routeIsRegistered(routeKeyname);

  if (requestData == null)
    throw new RouteFunctionError("Invalid content-type", {
      code: ErrorMetaCodes.INVALID_CONTENT_TYPE,
    });

  // for any types
  if (globalRoutes[routeKeyname]?.url) {
    return SuccessResponse(globalRoutes[routeKeyname]);
  }

  const builtRoute = await Promise.resolve(
    globalRoutes[routeKeyname]?.(requestData, request)
  );

  if (builtRoute == null) return null;

  return {
    ...builtRoute,
  };
};

const executeRequest = async (
  unpackedRequest: NextjsDispatcherProps
): Promise<{ success?: unknown; error?: unknown }> => {
  // const authHeader = (await headers()).get("authorization") ?? null;
  // const authHeaderValue = authHeader?.split(" ")[1] ?? null;

  // access token received and in current cookie session
  let accessToken = (await cookies()).get("access_token")?.value ?? null;

  if (!accessToken) {
    const authHeader = (await headers()).get("authorization") ?? null;
    accessToken = authHeader?.split(" ")[1] ?? null;
  }

  const requestInit: RequestInit = {
    method: unpackedRequest.method ?? "GET",
    headers: {
      [HttpHeaders.ContentType]: "application/json", // default  content type
      [HttpHeaders.Accept]: "application/json",
      ...(accessToken
        ? {
            [HttpHeaders.Authorization]: `${process.env.AUTH_TYPE} ${accessToken}`,
          }
        : {}),
      ...(unpackedRequest.headers ?? {}),
    },
    ...(unpackedRequest.method != "GET"
      ? { body: buildJSONBody(unpackedRequest.body) }
      : {}),
  };

  const response = await fetch(unpackedRequest.url, requestInit);

  let responseData;

  const isSuccess = response.ok,
    statusCode = response.status;

  try {
    const asJsonClone = response.clone();
    responseData = await asJsonClone.json();
  } catch {
    const asTextClone = response.clone();
    responseData = await asTextClone.text();

    responseData = JSON.stringify({
      code: "internal_api",
      error: responseData,
    });
  }

  if (!isSuccess) {
    return {
      error: {
        status: statusCode,
        json: responseData,
      },
    };
  }

  return {
    success: responseData,
  };
};

//

const printErrorRequest = (unpackedRequest: NextjsDispatcherProps) => {
  console.log("🟥 ERROR QUERYING \n", {
    ...unpackedRequest,
    method: unpackedRequest.method ?? "GET",
  });
};

let globalRoutes: NextjsRouteProps = {};

interface BaseResponseProps {
  success?: unknown;
  error?: unknown;
}

/**
 * Init routes
 *
 * @param {Object} NextjsAPIRoutesProps - Routes loaded from your project
 */
export const init = (NextjsAPIRoutesProps: NextjsRouteProps) => {
  globalRoutes = NextjsAPIRoutesProps;
  console.log(
    `🚀 - Routes initialized (${Object.keys(globalRoutes).length}) found`
  );
};

export async function dispatchHandler(
  request: NextRequest
): Promise<NextResponse> {
  try {
    const unpackedRequest = await unpackRequest(request);

    if (!unpackedRequest?.url) {
      return SuccessResponse(unpackedRequest);
    }

    if (unpackedRequest === null) {
      return SuccessResponse({});
    }

    let response: BaseResponseProps = {};

    console.log(
      `⚡ QUERYING URL [${unpackedRequest.method ?? "GET"}] - ${
        unpackedRequest.url
      }`
    );

    // processing cache
    if (unpackedRequest.cacheOptions) {
      response = await cache(
        unpackedRequest.cacheOptions.cacheKey,
        () => executeRequest(unpackedRequest),
        unpackedRequest.cacheOptions.maxAge
      );
    } else {
      response = await executeRequest(unpackedRequest);
    }

    if (response.error) {
      printErrorRequest(unpackedRequest);
      console.log(response.error);
      return ErrorResponse(response.error, 500);
    }

    if (unpackedRequest.onSuccess) {
      return SuccessResponse(
        await unpackedRequest.onSuccess(response.success, request)
      );
    }

    return SuccessResponse(response.success);
  } catch (e: unknown) {
    if (e instanceof RouteFunctionError) {
      return ErrorResponse(
        { error: e.message + " Error Code: " + e.meta.code },
        400
      );
    }

    const _error = e as Error;

    return ErrorResponse({ error: _error.message }, 400);
  }
}
