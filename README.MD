# Pafin-API - Unleash the Power of Pafin's Backend Magic! ✨

Welcome to the Pafin-API repository, the dazzling backend side of Pafin Web designed specifically for my technical exam. Brace yourself for an exhilarating journey through code and data as we dive into the heart of Pafin's functionality!

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Dependencies](#dependencies)
- [Scripts](#scripts)
- [Author](#author)

## Introduction

Pafin-API is the dynamic backend that drives Pafin Web, bringing to life the features that make Pafin shine. From handling user data to ensuring security, Pafin-API is your trusty companion on this coding adventure.

## Getting Started

To launch Pafin-API and witness its enchanting capabilities, follow these steps:

1. **Clone the Repository:** Start by cloning this repository to your local realm using:

   ```
   git clone https://github.com/froilansam/pafinapi.git
   ```

2. **Navigate to the Directory:** Traverse into the magical world of Pafin-API with:

   ```
   cd pafinapi
   ```

3. **Install Dependencies:** Unleash the power of Pafin's magic by installing the required spells using:

   ```
   npm install
   ```

4. **Replace credentials on db.ts file with your database credentials:**

   ```
   const pool = new Pool({
    user: "postgres", // PostgreSQL username
    host: "localhost", // Database host address
    database: "Pafin", // Name of the database to connect to
    password: "malibiran1234", // Password for the PostgreSQL user
    port: 5432, // Port number where PostgreSQL is running (default is 5432)
    });
   ```

5. **Rename sample.env to .env:**

6. **Start the Potion Brewing:** Conjure the ultimate elixir of Pafin-API with:

   ```
   npm start

   ```

7. **Run Postman Files in Postman Client:**
   ```
   Import the collection and environment in the project to Postman to test the API.
   ```
   Watch closely as the backend comes to life!

## Dependencies

Pafin-API draws its strength from an array of powerful ingredients, including but not limited to:

- **Express:** Your trusty steed for routing and handling HTTP requests.
- **bcrypt:** Enchantment for securing your user's secrets.
- **jsonwebtoken:** A spell for creating and verifying magical tokens.
- **pg:** The mystical gateway to PostgreSQL, the realm of data.
- **uuid:** A gem for generating unique identifiers.

And many more! These elements combined create the symphony that is Pafin-API.

## Scripts

Pafin-API is fueled by various incantations you can cast using `npm`. Here are the spells at your disposal:

- `npm start`: Ignite the magic! This spell transpiles TypeScript and starts the server to bring Pafin-API to life.

## Author

Pafin-API was crafted with love and magic by the master conjurer, **Froilan Sam Malibiran**. Feel free to reach out at froilansam@gmail.com for any inquiries or spell discussions!

Now, dear developer, grasp your wand (keyboard) and let the coding adventure begin! 🚀🪄🔮
