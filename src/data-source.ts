import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['dist/**/*.entity.js'], // Adjust path based on your build output
  migrations: ['dist/migrations/*.js'], // Path to compiled migration files
  synchronize: false, // Always use migrations for schema updates in production
  logging: true, // Optional: Enable logging for debugging
});
