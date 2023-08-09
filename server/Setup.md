# Pawsup - Server Setup

## Prerequisites

- [Node.js](https://nodejs.org/en/) (Version 14.7+)
- [PostgreSQL](https://www.postgresql.org/download/)

## Local Development Setup

1. Change directory into the `/server` folder (if you are not already)
   ```
   cd server
   ```
2. Install server dependencies

   ```
   npm install
   ```

3. Setup environment variables by copying the `.env.example` file to `.env`. This file contains sensible defaults for connecting to a local PostgreSQL DB, but feel free to update them
   ```
   cp .env.example .env
   ```
4. Start PostgreSQL locally and create a new database called `pawsup-dev` (or whatever your value for `DB_NAME` in `.env` is)

5. Run database migrations to set up tables in the database
   ```
   npm run migrate
   ```
6. Start the development server
   ```
   npm run dev
   ```
7. Import images into the database
   ```
   npm run imageloader
   ```
8. The development server will be running at http://localhost:3001
