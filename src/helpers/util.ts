import { ErrorCode, ErrorMessage } from "./constants";
import { Response } from "express"; // Types for Express request and response objects

// Function to send standardized error responses with appropriate HTTP status codes
export const sendErrorResponse = (res: Response, code: ErrorCode) => {
  return res.status(code === ErrorCode.EMAIL_ALREADY_TAKEN ? 400 : 500).json({
    code,
    error: ErrorMessage[code],
  });
};
