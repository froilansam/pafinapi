"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import the Pool class from the "pg" library to manage PostgreSQL database connections.
const pg_1 = require("pg");
// Create a new database connection pool.
const pool = new pg_1.Pool({
    user: "postgres",
    host: "localhost",
    database: "Pafin",
    password: "malibiran1234",
    port: 5432, // Port number where PostgreSQL is running (default is 5432)
});
// Export the created database connection pool.
exports.default = pool;
//# sourceMappingURL=db.js.map