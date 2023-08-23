"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = exports.verifyToken = exports.generateToken = void 0;
// Import the "jsonwebtoken" library to work with JSON Web Tokens (JWT).
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Generate a JSON Web Token (JWT) for a user.
 *
 * @param {object} user - The user object to be included in the token payload.
 * @return {string} The generated JWT.
 */
function generateToken(user) {
    const token = jsonwebtoken_1.default.sign(user, process.env["jwt-secret-key"], {
        expiresIn: "1h", // Token expiration time (1 hour in this case)
    });
    return token;
}
exports.generateToken = generateToken;
/**
 * Verify the validity of a JSON Web Token (JWT).
 *
 * @param {string} token - The JWT to be verified.
 * @return {object|null} The decoded payload if verification is successful, otherwise null.
 */
function verifyToken(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env["jwt-secret-key"]);
        return decoded; // If the token is valid, return the decoded payload
    }
    catch (error) {
        return null; // If verification fails, return null
    }
}
exports.verifyToken = verifyToken;
/**
 * Middleware function to authenticate incoming requests using a JSON Web Token (JWT).
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The callback to move to the next middleware.
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer <token>" format
    if (token == null) {
        // If no token provided, send 401 Unauthorized response.
        return res.status(401).json({ message: "No authorization sent." });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
        // If token verification fails, send 403 Forbidden response.
        return res.status(403).json({ message: "Forbidden" });
    }
    // If token is valid, store the decoded payload in the request and move to the next middleware.
    req.user = decoded;
    next();
}
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=index.js.map