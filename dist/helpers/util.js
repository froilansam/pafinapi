"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorResponse = void 0;
const constants_1 = require("./constants");
// Function to send standardized error responses with appropriate HTTP status codes
const sendErrorResponse = (res, code) => {
    return res.status(code === constants_1.ErrorCode.EMAIL_ALREADY_TAKEN ? 400 : 500).json({
        code,
        error: constants_1.ErrorMessage[code],
    });
};
exports.sendErrorResponse = sendErrorResponse;
//# sourceMappingURL=util.js.map