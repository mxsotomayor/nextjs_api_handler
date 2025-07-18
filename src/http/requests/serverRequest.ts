import { HttpHeaders } from "../headers";

class ServerRequest {
  static async do<T>(
    routeKey: string,
    body?: unknown,
    headers?: Partial<Record<HttpHeaders, string>>
  ): Promise<T> {
    
    // main fetcher
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/dispatch?name=" + routeKey,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
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
        throw new Error(JSON.stringify(data), { cause: data.status });
      }
    } catch (e) {
      const _e = e as Error;
      console.log("🔴 ERROR", routeKey);
      console.log(_e.message);

      throw new Error(_e.message, { cause: _e.cause });
    }

    return data as T;
  }
}

export default ServerRequest;
