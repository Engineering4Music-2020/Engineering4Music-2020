import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectToDataBase = async (query:string) => {
    const client = new Client({
        connectionString: process.env.DB_URI,
        ssl: {
            rejectUnauthorized: false
        }
    });
    await client.connect();
    try {
        const result = await client.query(query);
        const rowNumber = result.rowCount - 1;
        const data = result.rows[rowNumber];
        const latestHumidity = data.humidity;
        const latestTemperature = data.temperature;
    } catch(err) {
        console.log(err);
    } finally {
        await client.end();
    }
}; 

const checkData = (latestHumidity: number, latestTemperature:number):boolean => {
    if(latestHumidity > 50 || latestHumidity < 40 || latestTemperature > 25 || latestTemperature < 15) {
        return true;
    } else {
        return false;
    }
}

export const warnUser = (humidity:number, temperature: number) => {
    if(humidity > 50 || humidity < 40 || temperature > 25 || temperature < 15) {
        
    }
}