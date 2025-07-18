export const buildJSONBody = (payload) => {
    return JSON.stringify(payload);
};
export const createQueryString = (params) => {
    const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");
    return queryString ? `?${queryString}` : "";
};
export const verifySession = async ({ onSuccess, onError, }) => {
    try {
        // await fetchAPISecurely(`${process.env.AUTH_ACCOUNTS_SERVER}/accounts/check-jwt`);
        return onSuccess();
    }
    catch {
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
export function createSearchParams(obj) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(obj)) {
        if (value !== null && value !== undefined) {
            params.append(key, value);
        }
    }
    return params.toString();
}
export function getAPIEnvRoute(name) {
    return `${process.env.BASE_API_URL}${process.env.API_CONTEXT}${process.env["PATH_" + name.toUpperCase()]}`;
}
