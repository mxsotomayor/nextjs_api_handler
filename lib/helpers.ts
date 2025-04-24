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
  } catch  {
    return onError();
  }
};
