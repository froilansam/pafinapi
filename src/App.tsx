// Import required modules and libraries
import express from "express"; // Web framework for building APIs
import cors from "cors"; // Middleware for handling Cross-Origin Resource Sharing
const userRouter = require("./endpoints/user");

// Load environment variables from the .env file
require("dotenv").config();

// Create an instance of the Express app
const app = express();

// Parse incoming JSON data
app.use(express.json());
// Enable Cross-Origin Resource Sharing (CORS) for cross-domain requests
app.use(cors());

// Use User Router
app.use(userRouter);

// Define the port on which the server will run
const port = 3000;

// Start the Express server
app.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`);
});
