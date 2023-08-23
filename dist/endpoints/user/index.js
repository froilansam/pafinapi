"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../../database/db")); // Database connection pool
const bcrypt_1 = __importDefault(require("bcrypt")); // Library for password hashing
const constants_1 = require("../../helpers/constants");
const uuid_1 = require("uuid"); // Library for generating unique IDs
const helpers_1 = require("../../helpers"); // Custom validation functions
const util_1 = require("../../helpers/util");
const auth_1 = require("../../auth");
const express_1 = __importDefault(require("express")); // Web framework for building APIs
const router = express_1.default.Router();
// Route to get user information after successful authentication
router.get("/user", auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if user is authenticated
        if (!req.user)
            return (0, util_1.sendErrorResponse)(res, constants_1.ErrorCode.USER_NOT_FOUND);
        // Query user information from the database
        const query = "SELECT id, name, email FROM pafin_schema.Users WHERE id = $1";
        const result = yield db_1.default.query(query, [req.user.id]);
        // If user not found, send error response
        if (result.rowCount === 0)
            return (0, util_1.sendErrorResponse)(res, constants_1.ErrorCode.USER_NOT_FOUND);
        // Remove password from the result before sending
        delete result.rows[0].password;
        // Send the user information as JSON response
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error("Error retrieving user:", error);
        (0, util_1.sendErrorResponse)(res, constants_1.ErrorCode.UNKNOWN_ERROR);
    }
}));
// Route to delete user account after successful authentication
router.delete("/user", auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        return (0, util_1.sendErrorResponse)(res, constants_1.ErrorCode.USER_NOT_FOUND);
    try {
        // Delete user from the database
        const query = "DELETE FROM pafin_schema.Users WHERE id = $1";
        yield db_1.default.query(query, [req.user.id]);
        // Send success message as JSON response
        res.json({ message: "User deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        (0, util_1.sendErrorResponse)(res, constants_1.ErrorCode.UNKNOWN_ERROR);
    }
}));
// Route to update user information after successful authentication
router.patch("/user", auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { name, email, currentPassword, newPassword, confirmPassword } = req.body;
    // Validate if required fields are not empty
    if (!(0, helpers_1.validateIfEmpty)({ name, email }).valid) {
        return res.status(400).json({
            code: constants_1.ErrorCode.REQUIRED_FIELDS_BLANK,
            error: constants_1.ErrorMessage[constants_1.ErrorCode.REQUIRED_FIELDS_BLANK],
            data: (0, helpers_1.validateIfEmpty)({ name, email }).fields,
        });
    }
    // Validate email format
    if (!(0, helpers_1.validateEmailFormat)(email))
        return res.status(400).json({
            code: constants_1.ErrorCode.INVALID_EMAIL_FORMAT,
            error: constants_1.ErrorMessage[constants_1.ErrorCode.INVALID_EMAIL_FORMAT],
        });
    try {
        // Retrieve user information from the database
        const getUserQuery = "SELECT * FROM pafin_schema.Users WHERE id = $1";
        const getUserResult = yield db_1.default.query(getUserQuery, [userId]);
        // If user not found, send error response
        if (getUserResult.rows.length === 0) {
            return (0, util_1.sendErrorResponse)(res, constants_1.ErrorCode.USER_NOT_FOUND);
        }
        const user = getUserResult.rows[0];
        // Check for password-related updates
        if (currentPassword || newPassword || confirmPassword) {
            // Validate if currentPassword, newPassword, and confirmPassword are not empty
            if (!(0, helpers_1.validateIfEmpty)({ currentPassword, newPassword, confirmPassword })
                .valid) {
                return res.status(400).json({
                    code: constants_1.ErrorCode.REQUIRED_FIELDS_BLANK,
                    error: constants_1.ErrorMessage[constants_1.ErrorCode.REQUIRED_FIELDS_BLANK],
                    data: (0, helpers_1.validateIfEmpty)({
                        currentPassword,
                        newPassword,
                        confirmPassword,
                    }).fields,
                });
            }
            // Validate password and confirmPassword matching
            if (!(0, helpers_1.validatePassword)(newPassword, confirmPassword).valid) {
                return res.status(400).json({
                    code: constants_1.ErrorCode.INVALID_PASSWORD,
                    error: constants_1.ErrorMessage[constants_1.ErrorCode.INVALID_PASSWORD],
                    data: (0, helpers_1.validatePassword)(newPassword, confirmPassword).data,
                });
            }
            // Compare provided current password with the stored hashed password
            const isPasswordMatch = yield bcrypt_1.default.compare(currentPassword, user.password);
            if (!isPasswordMatch) {
                return res.status(400).json({
                    code: constants_1.ErrorCode.CURRENT_PASSWORD_NOT_MATCH,
                    error: constants_1.ErrorMessage[constants_1.ErrorCode.CURRENT_PASSWORD_NOT_MATCH],
                });
            }
            // Hash the new password and update user information
            const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
            const updateQuery = "UPDATE pafin_schema.Users SET name = $1, email = $2, password = $3 WHERE id = $4";
            yield db_1.default.query(updateQuery, [name, email, hashedPassword, userId]);
        }
        else {
            // Update user information without changing the password
            const updateQuery = "UPDATE pafin_schema.Users SET name = $1, email = $2 WHERE id = $3";
            yield db_1.default.query(updateQuery, [name, email, userId]);
        }
        // Send success message as JSON response
        res.json({ message: "User info updated successfully" });
    }
    catch (error) {
        if (error.code === "23505") {
            // Handle unique constraint violation (email already taken)
            return (0, util_1.sendErrorResponse)(res, constants_1.ErrorCode.EMAIL_ALREADY_TAKEN);
        }
        console.error("Error updating user info:", error);
        (0, util_1.sendErrorResponse)(res, constants_1.ErrorCode.UNKNOWN_ERROR);
    }
}));
// Route to create a new user account
router.post("/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, confirmPassword } = req.body;
        // Validate if required fields are not empty
        if (!(0, helpers_1.validateIfEmpty)(req.body).valid) {
            return res.status(400).json({
                code: constants_1.ErrorCode.REQUIRED_FIELDS_BLANK,
                error: constants_1.ErrorMessage[constants_1.ErrorCode.REQUIRED_FIELDS_BLANK],
                data: (0, helpers_1.validateIfEmpty)(req.body).fields,
            });
        }
        // Validate email format
        if (!(0, helpers_1.validateEmailFormat)(email))
            return res.status(400).json({
                code: constants_1.ErrorCode.INVALID_EMAIL_FORMAT,
                error: constants_1.ErrorMessage[constants_1.ErrorCode.INVALID_EMAIL_FORMAT],
            });
        // Validate password format and matching
        if (!(0, helpers_1.validatePassword)(password, confirmPassword).valid) {
            return res.status(400).json({
                code: constants_1.ErrorCode.INVALID_PASSWORD,
                error: constants_1.ErrorMessage[constants_1.ErrorCode.INVALID_PASSWORD],
                data: (0, helpers_1.validatePassword)(password, confirmPassword).data,
            });
        }
        // Hash the password and insert the user into the database
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const query = "INSERT INTO pafin_schema.Users (id, name, email, password) VALUES ($1, $2, $3, $4)";
        const values = [(0, uuid_1.v4)(), name, email, hashedPassword];
        yield db_1.default.query(query, values);
        // Send success message as JSON response
        return res.status(201).json({ message: "User created successfully" });
    }
    catch (error) {
        if (error.code === "23505") {
            // Handle unique constraint violation (email already taken)
            return (0, util_1.sendErrorResponse)(res, constants_1.ErrorCode.EMAIL_ALREADY_TAKEN);
        }
        console.error("Error creating user:", error);
        (0, util_1.sendErrorResponse)(res, constants_1.ErrorCode.UNKNOWN_ERROR);
    }
}));
// Create an instance of the Express app
// Route to get a list of all users' basic information
router.get("/users", auth_1.authenticateToken, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Query all user information from the database
        const query = "SELECT id, name, email FROM pafin_schema.Users";
        const result = yield db_1.default.query(query);
        // Send the list of users as JSON response
        res.json((_a = result.rows) !== null && _a !== void 0 ? _a : []);
    }
    catch (error) {
        console.error("Error retrieving users:", error);
        res
            .status(500)
            .json({ error: "An error occurred while retrieving users" });
    }
}));
// Route to handle user login
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Query user information from the database based on the provided email
        const userQuery = "SELECT id, email, password FROM pafin_schema.Users WHERE email = $1";
        const userResult = yield db_1.default.query(userQuery, [email]);
        // If no user found or password doesn't match, send error response
        if (userResult.rows.length === 0 ||
            !(yield bcrypt_1.default.compare(password, userResult.rows[0].password))) {
            return (0, util_1.sendErrorResponse)(res, constants_1.ErrorCode.INVALID_EMAIL_OR_PASSWORD);
        }
        // Generate a JWT for the user and send it in the response
        const token = (0, auth_1.generateToken)({
            id: userResult.rows[0].id,
            email: userResult.rows[0].email,
        });
        res.json({ token });
    }
    catch (error) {
        console.error("Error during login:", error);
        (0, util_1.sendErrorResponse)(res, constants_1.ErrorCode.UNKNOWN_ERROR);
    }
}));
module.exports = router;
//# sourceMappingURL=index.js.map