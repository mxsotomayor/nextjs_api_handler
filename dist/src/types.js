// Custom errors
export var ErrorMetaCodes;
(function (ErrorMetaCodes) {
    // error executing route function
    ErrorMetaCodes["ERR_EX_ROUTE_FUNCTION"] = "ERR_EX_ROUTE_FUNCTION";
    ErrorMetaCodes["INVALID_CONTENT_TYPE"] = "INVALID_CONTENT_TYPE";
    ErrorMetaCodes["ROUTE_KEY_NOT_REGISTERED"] = "ROUTE_KEY_NOT_REGISTERED";
})(ErrorMetaCodes || (ErrorMetaCodes = {}));
export class RouteFunctionError extends Error {
    meta;
    constructor(message, meta) {
        super(message);
        this.meta = meta;
    }
}
