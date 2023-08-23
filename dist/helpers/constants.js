"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMessage = exports.ErrorCode = void 0;
// Enum to define standardized error codes
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    ErrorCode["REQUIRED_FIELDS_BLANK"] = "REQUIRED_FIELDS_BLANK";
    ErrorCode["INVALID_EMAIL_FORMAT"] = "INVALID_EMAIL_FORMAT";
    ErrorCode["INVALID_PASSWORD"] = "INVALID_PASSWORD";
    ErrorCode["CURRENT_PASSWORD_NOT_MATCH"] = "CURRENT_PASSWORD_NOT_MATCH";
    ErrorCode["EMAIL_ALREADY_TAKEN"] = "EMAIL_ALREADY_TAKEN";
    ErrorCode["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
    ErrorCode["INVALID_EMAIL_OR_PASSWORD"] = "INVALID_EMAIL_OR_PASSWORD";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
// Map error codes to human-readable error messages
exports.ErrorMessage = {
    [ErrorCode.USER_NOT_FOUND]: "User not found",
    [ErrorCode.REQUIRED_FIELDS_BLANK]: "Required fields not filled out",
    [ErrorCode.INVALID_EMAIL_FORMAT]: "Invalid email address format",
    [ErrorCode.INVALID_PASSWORD]: "Invalid password",
    [ErrorCode.CURRENT_PASSWORD_NOT_MATCH]: "Current password does not match the record",
    [ErrorCode.EMAIL_ALREADY_TAKEN]: "Email address already taken",
    [ErrorCode.UNKNOWN_ERROR]: "An error occurred",
    [ErrorCode.INVALID_EMAIL_OR_PASSWORD]: "Invalid email address and/or password",
};
//# sourceMappingURL=constants.js.map