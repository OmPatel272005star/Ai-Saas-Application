import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

// Load .env file
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

export default sql;
