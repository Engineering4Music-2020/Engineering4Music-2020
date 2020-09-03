# Weather Station for Musicians

Simple weather station using a Raspberry Pi that allows musicians to keep an eye on the temperature and humidity in their rehearsal rooms / studios.
This project was created by Michael Schnyder and Lars Schmid in September 2020 as part of the course "Youth2Engineers".

## Features

- Show temperature on a website within a local network
- If Raspberry is not available, show mock data
- Scripts for running the webserver and for compiling/transpiling

## Technologies

- TypeScript
- JavaScript / Node.js
- HTML
- CSS
- PostgreSQL

## Contents

- `sensors` : Part of the weather station that controls the sensors.
- `web` : Web part of the weather station.

## Scripts

- In folder "web":
  - `npm run start` will open a webserver at localhost:3000/main where the current temperature will be displayed. If the Raspberry Pi is not available, mock data (15°C) will be displayed.
  - `npm run build` will delete and re-create the dist-folders in "web" and in "sensors", transpile the .ts-files, and copy the views folder from "src" to "dist" (within "web")
