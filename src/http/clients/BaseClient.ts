import pino from "pino";

const logger = pino(); // Default to JSON output to stdout

export class BaseClient {
  _BASE_URL: string;
  _BASE_HEADERS: HeadersInit;

  /**
   * 
   * @param baseURL API Base Url
   * @param headers Custom Headers
   * @param loggerName 
   */
  constructor(
    baseURL: string,
    headers: HeadersInit,
  ) {
    this._BASE_URL = baseURL;
    this._BASE_HEADERS = headers;
  }

  async query<T>(
    endpoint: string,
    data: unknown = undefined,
    headers?: HeadersInit,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET"
  ) {
    const url = `${this._BASE_URL}${endpoint}`;
    const requestId = new Date().getTime();

    const fetchOptions: RequestInit = {
      method,
      headers: {
        "Content-Type":"application/json",
        ...this._BASE_HEADERS,
        ...headers,
      },
    };

    // Attach body for non-GET requests
    if (method !== "GET" && data !== undefined) {
      fetchOptions.body = JSON.stringify(data);
    }

    try {
      logger.info({
        requestId: requestId,
        api: url,
        direction: "outgoing",
        type: "request",
        payload: data, // Be careful not to log sensitive data!
        message: `Initiating API request to ${url}`,
      });

      const response = await fetch(url, fetchOptions);

      let responseData;
      const contentType = response.headers.get("content-type") || "";

      logger.info({
        requestId: requestId,
        api: url,
        direction: "outgoing",
        type: "response",
        status: response.status,
        payload: responseData, // Be careful not to log sensitive data!
        message: `API response from ${url}`,
      });

      if (contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (!response.ok) {
        throw new Error(
          `HTTP error ${response.status}: ${
            typeof responseData === "string"
              ? responseData
              : JSON.stringify(responseData)
          }`
        );
      }
      return responseData as T;
    } catch (_err) {
      const error = _err as Error;
      logger.error({
        requestId: requestId,
        api: url,
        direction: "outgoing",
        type: "error",
        error: error.message,
        stack: error.stack,
        message: `Error during API request to ${url}`,
      });
      throw new Error(`Network or parsing error: ${error.message}`);
    }
  }
}
