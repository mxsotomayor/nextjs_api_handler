export const buildJSONBody = (payload: unknown): string => {
  return JSON.stringify(payload);
};

export const createQueryString = (params: Record<string, unknown>) => {
  const queryString = Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`
    )
    .join("&");
  return queryString ? `?${queryString}` : "";
};

export const verifySession = async ({
  onSuccess,
  onError,
}: {
  onSuccess: () => unknown;
  onError: () => unknown;
}) => {
  try {
    // await fetchAPISecurely(`${process.env.AUTH_ACCOUNTS_SERVER}/accounts/check-jwt`);
    return onSuccess();
  } catch {
    return onError();
  }
};

/**
 *
 * @param obj
 * @returns
 */
/**
 * Creates a URL-encoded query string from the given object.
 *
 * Iterates over the object's entries and appends each key-value pair to a `URLSearchParams` instance,
 * excluding entries where the value is `null` or `undefined`.
 *
 * @param obj - An object containing key-value pairs to be converted into search parameters.
 * @returns A URL-encoded query string representing the object's entries.
 */
export function createSearchParams(obj: Record<string, unknown>) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined) {
      params.append(key, value as string);
    }
  }

  return params.toString();
}

export function getAPIEnvRoute(name: string): string {
  return `${process.env.BASE_API_URL}${process.env.API_CONTEXT}${
    process.env["PATH_" + name.toUpperCase()]
  }`;
}
