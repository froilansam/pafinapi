"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import required modules and libraries
const express_1 = __importDefault(require("express")); // Web framework for building APIs
const cors_1 = __importDefault(require("cors")); // Middleware for handling Cross-Origin Resource Sharing
const userRouter = require("./endpoints/user");
// Load environment variables from the .env file
require("dotenv").config();
// Create an instance of the Express app
const app = (0, express_1.default)();
// Parse incoming JSON data
app.use(express_1.default.json());
// Enable Cross-Origin Resource Sharing (CORS) for cross-domain requests
app.use((0, cors_1.default)());
// Use User Router
app.use(userRouter);
// Define the port on which the server will run
const port = 3000;
// Start the Express server
app.listen(port, () => {
    console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=App.js.map