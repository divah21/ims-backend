import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
  PORT,
  NODE_ENV,
  DB_PASSWORD,
  DB_USER,
  DB_NAME,
  DB_HOST,
  DB_PORT,
  JWT_SECRET_KEY,
} = process.env;
