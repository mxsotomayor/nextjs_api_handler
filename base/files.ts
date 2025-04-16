import * as path from "path";

interface FilesProps {
  path: string;
  fileName: string;
  content: string;
}
const base = "./src/next_api_handler";

export const files: FilesProps[] = [
  {
    path: path.join(base, "server", "routes"),
    fileName: "demo.ts",
    content: `
console.log("demo content"
`,
  },
  {
    path: base,
    fileName: "helpers.ts",
    content: ``,
  },
  {
    path: base,
    fileName: "types.ts",
    content: `
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

export interface NextjsDispatcherProps {
  body?: unknown | null;
  headers?: Record<string, string>;
  verb: HTTP_VERBS;
  url: string;
  isPublic?: boolean;
}

type HTTP_VERBS = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export const buildBody = (payload: Record<string, unknown>): string => {
  return JSON.stringify(payload);
};

export type NextjsRouteProps = Record<
  string,
  (rest: any, req: NextRequest) => NextjsDispatcherProps
>;
`,
  },
  {
    path: base,
    fileName: "test.txt",
    content: "test",
  },
];

export const baseDispatchSettings: FilesProps = {
  path: "dispatch",
  fileName: "route.ts",
  content: `
// generated
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { NextjsAPIRoutes } from "@/next_interceptor/server";

interface ParsedRequestProps {
  payload: FormData | Record<string, unknown>;
  url: string;
}

const parseRequest = async (
  formContentType: undefined | string,
  req: NextRequest
): Promise<ParsedRequestProps> => {
  let requestData: FormData | Record<string, unknown> | null = null;

  if (!formContentType) throw new Error("invalid content type");

  let _routeKey: string = "";

  if (formContentType === "application/json") {
    const { route_key, ...rest } = await req.json();

    _routeKey = route_key;

    requestData = rest;

    if (!route_key || !NextjsAPIRoutes[route_key]) {
      throw new Error(
        "Invalid request. route_key invalid or missing, given value " +
          _routeKey
      );
    }
  }

  if (formContentType === "multipart/form-data") {
    const formData = await req.formData();

    _routeKey = (formData.get("route_key") as string) ?? "";

    requestData = formData;

    if (!_routeKey || !NextjsAPIRoutes[_routeKey]) {
      throw new Error(
        "Invalid request. route_key invalid or missing, given value " +
          _routeKey
      );
    }
  }

  if (requestData == null) throw Error("Invalid content type");

  const builtRoute = NextjsAPIRoutes[_routeKey]?.(requestData, req);

  return {
    payload: requestData,
    url: builtRoute.url,
  };
};

export async function POST(request: NextRequest) {
  try {
    const formContentType = (await headers())
      .get("content-type")
      ?.split(";")[0];

    const data = await parseRequest(formContentType, request);

    return data;
  } catch (e) {
    return new NextResponse(
      JSON.stringify({
        error: e,
      }),
      {
        status: 500,
      }
    );
  }
}`,
};
