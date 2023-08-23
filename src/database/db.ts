// Import the Pool class from the "pg" library to manage PostgreSQL database connections.
import { Pool } from "pg";

// Create a new database connection pool.
const pool = new Pool({
  user: "postgres", // PostgreSQL username
  host: "localhost", // Database host address
  database: "Pafin", // Name of the database to connect to
  password: "malibiran1234", // Password for the PostgreSQL user
  port: 5432, // Port number where PostgreSQL is running (default is 5432)
});

// Export the created database connection pool.
export default pool;
