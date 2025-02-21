# Backend Setup Instructions

Follow these steps to set up and run the backend locally:

## Prerequisites
Make sure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [PostgreSQL](https://www.postgresql.org/) or any supported Prisma database
- [Prisma CLI](https://www.prisma.io/docs/concepts/components/prisma-cli)

## Installing PostgreSQL on Linux
1. Update package lists:
   ```sh
   sudo apt update
   ```
2. Install PostgreSQL:
   ```sh
   sudo apt install postgresql postgresql-contrib
   ```
3. Start PostgreSQL service:
   ```sh
   sudo systemctl start postgresql
   ```
4. Enable PostgreSQL to start on boot:
   ```sh
   sudo systemctl enable postgresql
   ```
5. Switch to the PostgreSQL user and open the PostgreSQL shell:
   ```sh
   sudo -i -u postgres
   psql
   ```
6. Create a new database user:
   ```sql
   CREATE USER myuser WITH PASSWORD 'mypassword';
   ```
7. Create a new database:
   ```sql
   CREATE DATABASE mydatabase OWNER myuser;
   ```
8. Exit PostgreSQL shell:
   ```sql
   \q
   ```

## Installation
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

## Environment Variables
1. Create a `.env` file by copying `.env.example`:
   ```sh
   cp .env.example .env
   ```
2. Update the `.env` file with your database and other configuration settings.

## Database Setup
1. Push the Prisma schema to the database:
   ```sh
   npx prisma db push
   ```
2. Seed the database with initial data:
   ```sh
   node prisma/seed.js
   ```

## Running the Server
Start the development server:
```sh
npm run dev
```
The backend should now be running locally.

## Additional Commands
- Run database migrations:  
  ```sh
  npx prisma migrate dev --name init
  ```
- Open Prisma Studio (GUI for database management):  
  ```sh
  npx prisma studio
  ```

## API Documentation
Refer to the OpenAPI documentation in `openapi.yaml` for API endpoints and request details.

Happy coding! 🚀
