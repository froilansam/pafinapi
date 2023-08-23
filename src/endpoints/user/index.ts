import pool from "../../database/db"; // Database connection pool
import bcrypt from "bcrypt"; // Library for password hashing
import { ErrorCode, ErrorMessage } from "../../helpers/constants";
import { v4 as uuidv4 } from "uuid"; // Library for generating unique IDs
import {
  validateEmailFormat,
  validateIfEmpty,
  validatePassword,
} from "../../helpers"; // Custom validation functions
import { sendErrorResponse } from "../../helpers/util";
import { authenticateToken, generateToken } from "../../auth";
import { Response, Request } from "express"; // Types for Express request and response objects
import { IUser } from "../../helpers/interfaces";
import express from "express"; // Web framework for building APIs

const router = express.Router();

// Route to get user information after successful authentication
router.get(
  "/user",
  authenticateToken,
  async (req: Request & IUser, res: Response) => {
    try {
      // Check if user is authenticated
      if (!req.user) return sendErrorResponse(res, ErrorCode.USER_NOT_FOUND);

      // Query user information from the database
      const query =
        "SELECT id, name, email FROM pafin_schema.Users WHERE id = $1";
      const result = await pool.query(query, [req.user.id]);

      // If user not found, send error response
      if (result.rowCount === 0)
        return sendErrorResponse(res, ErrorCode.USER_NOT_FOUND);

      // Remove password from the result before sending
      delete result.rows[0].password;

      // Send the user information as JSON response
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error retrieving user:", error);
      sendErrorResponse(res, ErrorCode.UNKNOWN_ERROR);
    }
  }
);

// Route to delete user account after successful authentication
router.delete(
  "/user",
  authenticateToken,
  async (req: Request & IUser, res: Response) => {
    if (!req.user) return sendErrorResponse(res, ErrorCode.USER_NOT_FOUND);

    try {
      // Delete user from the database
      const query = "DELETE FROM pafin_schema.Users WHERE id = $1";
      await pool.query(query, [req.user.id]);

      // Send success message as JSON response
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      sendErrorResponse(res, ErrorCode.UNKNOWN_ERROR);
    }
  }
);

// Route to update user information after successful authentication
router.patch(
  "/user",
  authenticateToken,
  async (req: Request & IUser, res: Response) => {
    const userId: string = req.user.id;
    const { name, email, currentPassword, newPassword, confirmPassword } =
      req.body;

    // Validate if required fields are not empty
    if (!validateIfEmpty({ name, email }).valid) {
      return res.status(400).json({
        code: ErrorCode.REQUIRED_FIELDS_BLANK,
        error: ErrorMessage[ErrorCode.REQUIRED_FIELDS_BLANK],
        data: validateIfEmpty({ name, email }).fields,
      });
    }

    // Validate email format
    if (!validateEmailFormat(email))
      return res.status(400).json({
        code: ErrorCode.INVALID_EMAIL_FORMAT,
        error: ErrorMessage[ErrorCode.INVALID_EMAIL_FORMAT],
      });

    try {
      // Retrieve user information from the database
      const getUserQuery = "SELECT * FROM pafin_schema.Users WHERE id = $1";
      const getUserResult = await pool.query(getUserQuery, [userId]);

      // If user not found, send error response
      if (getUserResult.rows.length === 0) {
        return sendErrorResponse(res, ErrorCode.USER_NOT_FOUND);
      }

      const user = getUserResult.rows[0];

      // Check for password-related updates
      if (currentPassword || newPassword || confirmPassword) {
        // Validate if currentPassword, newPassword, and confirmPassword are not empty
        if (
          !validateIfEmpty({ currentPassword, newPassword, confirmPassword })
            .valid
        ) {
          return res.status(400).json({
            code: ErrorCode.REQUIRED_FIELDS_BLANK,
            error: ErrorMessage[ErrorCode.REQUIRED_FIELDS_BLANK],
            data: validateIfEmpty({
              currentPassword,
              newPassword,
              confirmPassword,
            }).fields,
          });
        }

        // Validate password and confirmPassword matching
        if (!validatePassword(newPassword, confirmPassword).valid) {
          return res.status(400).json({
            code: ErrorCode.INVALID_PASSWORD,
            error: ErrorMessage[ErrorCode.INVALID_PASSWORD],
            data: validatePassword(newPassword, confirmPassword).data,
          });
        }

        // Compare provided current password with the stored hashed password
        const isPasswordMatch = await bcrypt.compare(
          currentPassword,
          user.password
        );
        if (!isPasswordMatch) {
          return res.status(400).json({
            code: ErrorCode.CURRENT_PASSWORD_NOT_MATCH,
            error: ErrorMessage[ErrorCode.CURRENT_PASSWORD_NOT_MATCH],
          });
        }

        // Hash the new password and update user information
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updateQuery =
          "UPDATE pafin_schema.Users SET name = $1, email = $2, password = $3 WHERE id = $4";
        await pool.query(updateQuery, [name, email, hashedPassword, userId]);
      } else {
        // Update user information without changing the password
        const updateQuery =
          "UPDATE pafin_schema.Users SET name = $1, email = $2 WHERE id = $3";
        await pool.query(updateQuery, [name, email, userId]);
      }

      // Send success message as JSON response
      res.json({ message: "User info updated successfully" });
    } catch (error) {
      if (error.code === "23505") {
        // Handle unique constraint violation (email already taken)
        return sendErrorResponse(res, ErrorCode.EMAIL_ALREADY_TAKEN);
      }

      console.error("Error updating user info:", error);
      sendErrorResponse(res, ErrorCode.UNKNOWN_ERROR);
    }
  }
);

// Route to create a new user account
router.post("/user", async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validate if required fields are not empty
    if (!validateIfEmpty(req.body).valid) {
      return res.status(400).json({
        code: ErrorCode.REQUIRED_FIELDS_BLANK,
        error: ErrorMessage[ErrorCode.REQUIRED_FIELDS_BLANK],
        data: validateIfEmpty(req.body).fields,
      });
    }

    // Validate email format
    if (!validateEmailFormat(email))
      return res.status(400).json({
        code: ErrorCode.INVALID_EMAIL_FORMAT,
        error: ErrorMessage[ErrorCode.INVALID_EMAIL_FORMAT],
      });

    // Validate password format and matching
    if (!validatePassword(password, confirmPassword).valid) {
      return res.status(400).json({
        code: ErrorCode.INVALID_PASSWORD,
        error: ErrorMessage[ErrorCode.INVALID_PASSWORD],
        data: validatePassword(password, confirmPassword).data,
      });
    }

    // Hash the password and insert the user into the database
    const hashedPassword = await bcrypt.hash(password, 10);
    const query =
      "INSERT INTO pafin_schema.Users (id, name, email, password) VALUES ($1, $2, $3, $4)";
    const values = [uuidv4(), name, email, hashedPassword];
    await pool.query(query, values);

    // Send success message as JSON response
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    if (error.code === "23505") {
      // Handle unique constraint violation (email already taken)
      return sendErrorResponse(res, ErrorCode.EMAIL_ALREADY_TAKEN);
    }

    console.error("Error creating user:", error);
    sendErrorResponse(res, ErrorCode.UNKNOWN_ERROR);
  }
});

// Create an instance of the Express app

// Route to get a list of all users' basic information
router.get(
  "/users",
  authenticateToken,
  async (_req: Request, res: Response) => {
    try {
      // Query all user information from the database
      const query = "SELECT id, name, email FROM pafin_schema.Users";
      const result = await pool.query(query);

      // Send the list of users as JSON response
      res.json(result.rows ?? []);
    } catch (error) {
      console.error("Error retrieving users:", error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving users" });
    }
  }
);

// Route to handle user login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Query user information from the database based on the provided email
    const userQuery =
      "SELECT id, email, password FROM pafin_schema.Users WHERE email = $1";
    const userResult = await pool.query(userQuery, [email]);

    // If no user found or password doesn't match, send error response
    if (
      userResult.rows.length === 0 ||
      !(await bcrypt.compare(password, userResult.rows[0].password))
    ) {
      return sendErrorResponse(res, ErrorCode.INVALID_EMAIL_OR_PASSWORD);
    }

    // Generate a JWT for the user and send it in the response
    const token = generateToken({
      id: userResult.rows[0].id,
      email: userResult.rows[0].email,
    });
    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    sendErrorResponse(res, ErrorCode.UNKNOWN_ERROR);
  }
});

module.exports = router;
