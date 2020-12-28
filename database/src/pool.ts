import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const determinePool = (): Pool => {
    let pool: Pool;
    if (process.env.DB_IS_NOT_HEROKU === "true") {
        pool = new Pool({
            user: process.env.LOCAL_USER,
            host: process.env.LOCAL_HOST,
            database: process.env.LOCAL_DB,
            password: process.env.LOCAL_PW,
            port: 5432
        });
        return pool;
    } else {
        pool = new Pool({
            connectionString: process.env.DB_URI,
            ssl: {
                rejectUnauthorized: false
            }
        });
        return pool;
    }
};

export const pool = determinePool();