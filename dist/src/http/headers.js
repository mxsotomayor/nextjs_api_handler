/**
 * Enum representing commonly used HTTP Headers.
 * This list includes request headers, response headers, and general headers.
 * It's important to note that this list is extensive but not exhaustive,
 * as new headers can be introduced. Deprecated headers have been removed.
 *
 * Usage:
 * const contentType = HttpHeaders.ContentType; // "Content-Type"
 * const authorizationHeader = `${HttpHeaders.Authorization}: Bearer YOUR_TOKEN`;
 */
export var HttpHeaders;
(function (HttpHeaders) {
    // --- General Headers ---
    HttpHeaders["CacheControl"] = "Cache-Control";
    HttpHeaders["Connection"] = "Connection";
    HttpHeaders["Date"] = "Date";
    HttpHeaders["Pragma"] = "Pragma";
    HttpHeaders["Trailer"] = "Trailer";
    HttpHeaders["TransferEncoding"] = "Transfer-Encoding";
    HttpHeaders["Upgrade"] = "Upgrade";
    HttpHeaders["Via"] = "Via";
    HttpHeaders["Warning"] = "Warning";
    // --- Request Headers ---
    HttpHeaders["Accept"] = "Accept";
    HttpHeaders["AcceptCharset"] = "Accept-Charset";
    HttpHeaders["AcceptEncoding"] = "Accept-Encoding";
    HttpHeaders["AcceptLanguage"] = "Accept-Language";
    HttpHeaders["Authorization"] = "Authorization";
    HttpHeaders["Cookie"] = "Cookie";
    HttpHeaders["Expect"] = "Expect";
    HttpHeaders["From"] = "From";
    HttpHeaders["Host"] = "Host";
    HttpHeaders["IfMatch"] = "If-Match";
    HttpHeaders["IfModifiedSince"] = "If-Modified-Since";
    HttpHeaders["IfNoneMatch"] = "If-None-Match";
    HttpHeaders["IfRange"] = "If-Range";
    HttpHeaders["IfUnmodifiedSince"] = "If-Unmodified-Since";
    HttpHeaders["MaxForwards"] = "Max-Forwards";
    HttpHeaders["ProxyAuthorization"] = "Proxy-Authorization";
    HttpHeaders["Range"] = "Range";
    HttpHeaders["Referer"] = "Referer";
    HttpHeaders["TE"] = "TE";
    HttpHeaders["UserAgent"] = "User-Agent";
    // --- Request Body Headers ---
    HttpHeaders["ContentLength"] = "Content-Length";
    HttpHeaders["ContentType"] = "Content-Type";
    // --- Response Headers ---
    HttpHeaders["AcceptRanges"] = "Accept-Ranges";
    HttpHeaders["Age"] = "Age";
    HttpHeaders["Allow"] = "Allow";
    HttpHeaders["ContentEncoding"] = "Content-Encoding";
    HttpHeaders["ContentLanguage"] = "Content-Language";
    HttpHeaders["ContentLocation"] = "Content-Location";
    HttpHeaders["ContentDisposition"] = "Content-Disposition";
    HttpHeaders["ContentMD5"] = "Content-MD5";
    HttpHeaders["ContentRange"] = "Content-Range";
    HttpHeaders["ETag"] = "ETag";
    HttpHeaders["Expires"] = "Expires";
    HttpHeaders["LastModified"] = "Last-Modified";
    HttpHeaders["Location"] = "Location";
    HttpHeaders["ProxyAuthenticate"] = "Proxy-Authenticate";
    HttpHeaders["RetryAfter"] = "Retry-After";
    HttpHeaders["Server"] = "Server";
    HttpHeaders["SetCookie"] = "Set-Cookie";
    HttpHeaders["Vary"] = "Vary";
    HttpHeaders["WWWAuthenticate"] = "WWW-Authenticate";
    // --- CORS Headers ---
    HttpHeaders["AccessControlAllowOrigin"] = "Access-Control-Allow-Origin";
    HttpHeaders["AccessControlAllowCredentials"] = "Access-Control-Allow-Credentials";
    HttpHeaders["AccessControlAllowHeaders"] = "Access-Control-Allow-Headers";
    HttpHeaders["AccessControlAllowMethods"] = "Access-Control-Allow-Methods";
    HttpHeaders["AccessControlExposeHeaders"] = "Access-Control-Expose-Headers";
    HttpHeaders["AccessControlMaxAge"] = "Access-Control-Max-Age";
    HttpHeaders["AccessControlRequestHeaders"] = "Access-Control-Request-Headers";
    HttpHeaders["AccessControlRequestMethod"] = "Access-Control-Request-Method";
    HttpHeaders["Origin"] = "Origin";
    // --- Security Headers ---
    HttpHeaders["StrictTransportSecurity"] = "Strict-Transport-Security";
    HttpHeaders["XContentTypeOptions"] = "X-Content-Type-Options";
    HttpHeaders["XFrameOptions"] = "X-Frame-Options";
    HttpHeaders["XXSSProtection"] = "X-XSS-Protection";
    HttpHeaders["ContentSecurityPolicy"] = "Content-Security-Policy";
    HttpHeaders["ReferrerPolicy"] = "Referrer-Policy";
    HttpHeaders["PermissionsPolicy"] = "Permissions-Policy";
    // --- Other Common Headers ---
    HttpHeaders["AltSvc"] = "Alt-Svc";
    HttpHeaders["ClearSiteData"] = "Clear-Site-Data";
    HttpHeaders["ExpectCT"] = "Expect-CT";
    HttpHeaders["KeepAlive"] = "Keep-Alive";
    HttpHeaders["Link"] = "Link";
    HttpHeaders["TimingAllowOrigin"] = "Timing-Allow-Origin";
    HttpHeaders["XForwardedFor"] = "X-Forwarded-For";
    HttpHeaders["XForwardedHost"] = "X-Forwarded-Host";
    HttpHeaders["XForwardedProto"] = "X-Forwarded-Proto";
    HttpHeaders["XPoweredBy"] = "X-Powered-By";
    HttpHeaders["XRequestID"] = "X-Request-ID";
    HttpHeaders["XRequestedWith"] = "X-Requested-With";
})(HttpHeaders || (HttpHeaders = {}));
