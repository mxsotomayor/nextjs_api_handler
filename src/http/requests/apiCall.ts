import { cookies } from "next/headers";
import { buildJSONBody } from "../../helpers";
import { NextjsAPIRoutes } from "@/next_interceptor/server";
 
/**
 * Perform a direct api request directly without call internal api
 * is supposed to be more simple and directly
 */
class APICall {
  static async call<T>(
    routeKey: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<T> {
    
    const accessToken = (await cookies()).get("access_token")?.value ?? "";

    const customHeaders: Record<string, string> = {
      authorization: "bearer " + accessToken,
    };

    const routerHandler = NextjsAPIRoutes[routeKey];

    if (!routerHandler) throw new Error("Unregistered route " + routeKey);

    const routeParams = await Promise.resolve(routerHandler(body));

    if(routeParams===null){
      return {} as T
    }

    const response = await fetch(routeParams.url, {
      method: routeParams.method,
      headers: {
        "content-type": "application/json",
        ...routeParams.headers,
        ...customHeaders,
        ...headers,
      },
      ...(routeParams.method != "GET" ? { body: buildJSONBody(body) } : {}),
      cache: "no-cache",
    });

    let data: Record<string, unknown>;

    try {
      data = await response.json();

      if (!response.ok) {
        throw new Error(JSON.stringify(data), { cause: data.status });
      }
    } catch (e) {
      const _e = e as Error;
      console.log("🔴", routeKey);
      console.log(_e.message);

      throw new Error(_e.message, { cause: _e.cause });
    }

    return data as T;
  }
}

export default APICall;
