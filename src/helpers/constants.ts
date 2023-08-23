// Enum to define standardized error codes
export enum ErrorCode {
  USER_NOT_FOUND = "USER_NOT_FOUND",
  REQUIRED_FIELDS_BLANK = "REQUIRED_FIELDS_BLANK",
  INVALID_EMAIL_FORMAT = "INVALID_EMAIL_FORMAT",
  INVALID_PASSWORD = "INVALID_PASSWORD",
  CURRENT_PASSWORD_NOT_MATCH = "CURRENT_PASSWORD_NOT_MATCH",
  EMAIL_ALREADY_TAKEN = "EMAIL_ALREADY_TAKEN",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  INVALID_EMAIL_OR_PASSWORD = "INVALID_EMAIL_OR_PASSWORD",
}

// Map error codes to human-readable error messages
export const ErrorMessage: Record<ErrorCode, string> = {
  [ErrorCode.USER_NOT_FOUND]: "User not found",
  [ErrorCode.REQUIRED_FIELDS_BLANK]: "Required fields not filled out",
  [ErrorCode.INVALID_EMAIL_FORMAT]: "Invalid email address format",
  [ErrorCode.INVALID_PASSWORD]: "Invalid password",
  [ErrorCode.CURRENT_PASSWORD_NOT_MATCH]:
    "Current password does not match the record",
  [ErrorCode.EMAIL_ALREADY_TAKEN]: "Email address already taken",
  [ErrorCode.UNKNOWN_ERROR]: "An error occurred",
  [ErrorCode.INVALID_EMAIL_OR_PASSWORD]:
    "Invalid email address and/or password",
};
