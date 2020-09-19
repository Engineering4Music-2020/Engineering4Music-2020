import { Client } from "pg";
import dotenv from "dotenv";
import { getData } from "../../sensors/src/main";
import { preventZero } from "./preventZero";

const fillDataBase = async (humidity:number, temperature:number, raspiid:any) => {
    const client = new Client({
        connectionString: process.env.DB_URI,
        ssl: {
            rejectUnauthorized: false
        }
    });
    
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let hour = d.getHours();
    let minutes = d.getMinutes();
    console.log(`date '${year}-${month}-${day}' + time '${hour}:${minutes}'`);
        try {
            await client.connect();
            const res = await client.query(`INSERT INTO data (humidity, temperature, date, raspiid) VALUES(${humidity}, ${temperature}, LOCALTIMESTAMP, ${raspiid});`);
            console.log(res.rows);
        } catch(error) {
            console.log(error);
        } finally {
            client.end();
        }
    }   

const measure = () => {
    preventZero();
    getData().then((data) => {
        let humidity = data.humidity;
        let temperature = data.temperature;
        console.log(humidity);

        dotenv.config();

        const raspiid = process.env.RASPI_ID;
        
        
            fillDataBase(humidity, temperature, raspiid);
    });
}


setInterval(measure, 900000);