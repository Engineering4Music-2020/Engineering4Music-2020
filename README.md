# Weather Station for Musicians

Simple weather station using a Raspberry Pi that allows musicians to keep an eye on the temperature and humidity in their rehearsal rooms / studios. This serves as an essential tool for the maintenance of acoustic instruments.
This project was created by Michael Schnyder and Lars Schmid in September 2020 as part of the course "Youth2Engineers".

## Features

- Raspberry Pi measures temperature and humidity every 15 minutes and sends the data to a database
- Data from database is displayed on a website. Different timeframes can be selected (all data, last 24 hours / 7 days / 1 month)
- Users can sign up and log in so that they can see the data of their registered Raspberry Pi
- Scripts for running the webserver and for compiling/transpiling

## Technologies

### Frontend
- CSS
- d3.js
- HTML
- JavaScript

### Backend
- Node.js
- PostgreSQL
- TypeScript

## Contents

- `sensors` : Part of the weather station that controls the sensors.
- `web` : Web part of the weather station.

## Scripts

- In folder "web":
  - `npm run start` will open a webserver at `localhost:3000/main` where the current temperature will be displayed. If the Raspberry Pi is not available, mock data (15°C / 50%) will be displayed.
  - `npm run build` will delete and re-create the dist-folders in "web" and in "sensors", transpile the .ts-files, and copy the views and public folder from "src" to "dist" (within "web")
