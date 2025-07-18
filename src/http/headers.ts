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
export  enum HttpHeaders {
  // --- General Headers ---
  CacheControl = 'Cache-Control',
  Connection = 'Connection',
  Date = 'Date',
  Pragma = 'Pragma',
  Trailer = 'Trailer',
  TransferEncoding = 'Transfer-Encoding',
  Upgrade = 'Upgrade',
  Via = 'Via',
  Warning = 'Warning',

  // --- Request Headers ---
  Accept = 'Accept',
  AcceptCharset = 'Accept-Charset',
  AcceptEncoding = 'Accept-Encoding',
  AcceptLanguage = 'Accept-Language',
  Authorization = 'Authorization',
  Cookie = 'Cookie',
  Expect = 'Expect',
  From = 'From',
  Host = 'Host',
  IfMatch = 'If-Match',
  IfModifiedSince = 'If-Modified-Since',
  IfNoneMatch = 'If-None-Match',
  IfRange = 'If-Range',
  IfUnmodifiedSince = 'If-Unmodified-Since',
  MaxForwards = 'Max-Forwards',
  ProxyAuthorization = 'Proxy-Authorization',
  Range = 'Range',
  Referer = 'Referer',
  TE = 'TE', // Transfer-Encoding
  UserAgent = 'User-Agent',

  // --- Request Body Headers ---
  ContentLength = 'Content-Length',
  ContentType = 'Content-Type',

  // --- Response Headers ---
  AcceptRanges = 'Accept-Ranges',
  Age = 'Age',
  Allow = 'Allow',
  ContentEncoding = 'Content-Encoding',
  ContentLanguage = 'Content-Language',
  ContentLocation = 'Content-Location',
  ContentDisposition = 'Content-Disposition',
  ContentMD5 = 'Content-MD5',
  ContentRange = 'Content-Range',
  ETag = 'ETag',
  Expires = 'Expires',
  LastModified = 'Last-Modified',
  Location = 'Location',
  ProxyAuthenticate = 'Proxy-Authenticate',
  RetryAfter = 'Retry-After',
  Server = 'Server',
  SetCookie = 'Set-Cookie',
  Vary = 'Vary',
  WWWAuthenticate = 'WWW-Authenticate',

  // --- CORS Headers ---
  AccessControlAllowOrigin = 'Access-Control-Allow-Origin',
  AccessControlAllowCredentials = 'Access-Control-Allow-Credentials',
  AccessControlAllowHeaders = 'Access-Control-Allow-Headers',
  AccessControlAllowMethods = 'Access-Control-Allow-Methods',
  AccessControlExposeHeaders = 'Access-Control-Expose-Headers',
  AccessControlMaxAge = 'Access-Control-Max-Age',
  AccessControlRequestHeaders = 'Access-Control-Request-Headers',
  AccessControlRequestMethod = 'Access-Control-Request-Method',
  Origin = 'Origin',

  // --- Security Headers ---
  StrictTransportSecurity = 'Strict-Transport-Security', // HSTS
  XContentTypeOptions = 'X-Content-Type-Options', // Prevents MIME sniffing
  XFrameOptions = 'X-Frame-Options', // Clickjacking protection
  XXSSProtection = 'X-XSS-Protection', // XSS filter
  ContentSecurityPolicy = 'Content-Security-Policy', // CSP
  ReferrerPolicy = 'Referrer-Policy',
  PermissionsPolicy = 'Permissions-Policy', // Formerly Feature-Policy

  // --- Other Common Headers ---
  AltSvc = 'Alt-Svc', // Alternative Services
  ClearSiteData = 'Clear-Site-Data',
  ExpectCT = 'Expect-CT', // Certificate Transparency
  KeepAlive = 'Keep-Alive',
  Link = 'Link', // Web Linking
  TimingAllowOrigin = 'Timing-Allow-Origin',
  XForwardedFor = 'X-Forwarded-For', // Proxy/load balancer
  XForwardedHost = 'X-Forwarded-Host',
  XForwardedProto = 'X-Forwarded-Proto',
  XPoweredBy = 'X-Powered-By',
  XRequestID = 'X-Request-ID', // Common for tracing requests
  XRequestedWith = 'X-Requested-With', // Common for AJAX requests
}
