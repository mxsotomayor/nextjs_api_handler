class ServerRequest {
    static async do(routeKey, body, headers) {
        // main fetcher
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/dispatch?name=" + routeKey, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                ...headers,
            },
            body: JSON.stringify({
                route_key: routeKey,
                ...body,
            }),
            cache: "no-cache",
        });
        let data;
        try {
            data = await response.json();
            if (!response.ok) {
                throw new Error(JSON.stringify(data), { cause: data.status });
            }
        }
        catch (e) {
            const _e = e;
            console.log("🔴 ERROR", routeKey);
            console.log(_e.message);
            throw new Error(_e.message, { cause: _e.cause });
        }
        return data;
    }
}
export default ServerRequest;
