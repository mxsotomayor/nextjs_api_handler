import { FORM_ENC_TYPES } from "src/constants";
import { HttpHeaders } from "../headers";

class ServerRequest {
  static async do<T>(
    routeKey: string,
    body?: Record<string, unknown> | string,
    headers?: Partial<Record<HttpHeaders, string>>
  ): Promise<T> {
    
    // main fetcher
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/dispatch?name=" + routeKey,
      {
        method: "POST",
        headers: {
          'Content-Type': FORM_ENC_TYPES["form-data"],
          ...headers,
        },
        body: JSON.stringify({
          route_key: routeKey,
          ...(body as Record<string, unknown>),
        }),
        cache: "no-cache",
      }
    );

    let data: Record<string, unknown>;

    try {
      data = await response.json();

      if (!response.ok) {
        throw new Error(JSON.stringify(data));
      }
    } catch (e) {
      const _e = e as Error;
      console.log("🔴 ERROR", routeKey);
      console.log(_e.message);

      throw new Error(_e.message);
    }

    return data as T;
  }
}

export default ServerRequest;
