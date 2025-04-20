import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const { PGUSER, PGHOST, PGDATABASE, PGPASSWORD } = process.env;

// creates a sql connection using env variables
export const sql = neon(
  `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`
)