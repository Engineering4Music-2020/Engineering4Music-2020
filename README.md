# Engineering4Music

Simple weather station using a Raspberry Pi that allows musicians to keep an eye on the temperature and humidity in their rehearsal rooms / studios. This serves as an essential tool for the maintenance of acoustic instruments.
This project was created by Michael Schnyder and Lars Schmid in September 2020 as part of the course "Youth2Engineers" (ZHAW).

## Content
- [Features](https://github.zhaw.ch/Vorpraktikum-IT/Engineering4Music_2020/blob/master/README.md#features)
- [How To Use](https://github.zhaw.ch/Vorpraktikum-IT/Engineering4Music_2020/blob/master/README.md#how-to-use)
- [Structure & Diagrams](https://github.zhaw.ch/Vorpraktikum-IT/Engineering4Music_2020/blob/master/README.md#structure--diagrams)
- [Essential Technologies](https://github.zhaw.ch/Vorpraktikum-IT/Engineering4Music_2020/blob/master/README.md#essential-technologies)

## FEATURES

### Raspberry Pi
- The Raspberry Pi measures temperature and humidity in 15 minute intervals and saves the measurements in a database running on Heroku.
- When the Raspberry Pi shuts down (eg. because of a power outage) it will restart automatically and resume measuring data.
- When the values for temperature/humidity get out of a defined range, automatic e-mails are sent to warn the user. Another automatic e-mail is sent when this value returns within the defined range, to give the user the all-clear.

### Website (Frontend)
- The Website [https://engineering4music.herokuapp.com](https://engineering4music.herokuapp.com) shows the data of your Raspberry Pi on a graph and lets you choose different time frames (`All Data`, `24 Hours`, `7 Days`, `1 Month`) which will redraw the graph accordingly.
- Within the graph, the two lines for humidity and temperature can be toggled on and off in case they overlap. They will stay on/off even when changing the chosen time frame.
- When hovering over the graph lines, a tooltip will appear and show you the exact date/time and value.
- The website is responsive and displays data on mobile screens as well as on a browser on your laptop/PC.
- Important: In order for the data to be displayed at all, you must run the website on the https protocol. An automatic redirect to https couldn't be implemented yet due to some bugs, which would take a longer time to fix.

### User
- The user can sign up with the ID of his RaspberryPi and his e-mail adress. When he logs in with his ID and password, he will be shown the data that belong to his account.
- The website will display warning messages if the password or e-mail used for logging in are wrong, or if someone tries to sign up with an already existing ID and/or e-mail.

### Backend
- Scripts for running the webserver and for compiling/transpiling.
- The database automatically deletes 100 rows if the number of rows exceeds 1000.

## HOW TO USE

### Raspberry Pi: Configuration

The configuration of the Raspberry Pi is that it measures and uploads the data every 15 minutes. It measures and uploads humidity, temperature, date/time and its own ID, which is used by the database to assign the data to the corresponding Raspberry Pi.\
The ID of the Raspberry Pi is defined in a config variable named `RASPI_ID`, which is located in a `.env` file in the root directory. In order for it to work correctly, the ID defined during signup must be the same as the one defined on the Raspberry Pi. Also defined in `.env` is the variable `DB_URI`, which contains the URI for the database connection, and `API_KEY`, which contains the API-key for the mail-API.\
The mail-API is needed for the alert feature, which checks if the data is within a defined range after each measurement. At the moment the range is hardcoded. The threshold for humidity is between 40% and 50% and for temperature it is between 15°C and 25°C, which mostly applies for guitars, but is also suitable for a piano, because the range in humidity is rather small. A feature that allows the user to set those thresholds on a user interface is to be implemented in the future.\
The e-mail address used for the alerts will always be the one that was entered during signup. The Raspberry Pi assigns the e-mail to the user by the ID that was entered during sign-up. A feature that allows the user to determine whether he wants to receive e-mails or not is to be implemented in the future. The e-mails are sent via the API by Sendgrid, which appeared to be the only API that was easy to use and worked without too much trouble.

### Raspberry Pi: Start Measuring

In order to let the Raspberry start measuring data and sending them to the database, use the following command from the root folder: `node database/dist/database/src/databaseConnection.js` Before that, you need to transpile the TypeScript-Files to JavaScript with the command `tsc` (from the database folder). If you want the program to start on its own right after plugging in the Raspberry Pi, install `PM2`. For instructions, consult their website. One thing they forgot to put in the instructions though is that you need to define the user of the Raspberry Pi manually. Otherwise the program will not start automatically after the boot up of the Raspberry Pi. In order to do that, you just need to run `pm2 startup -u <your username>` in the command line. After that, you are good to go.

### Log-In

To log in and see the data/graph you can use the following two accounts:
- lars.schmid@gmx.ch, "1234"
- michael.schnyder.immer@gmail.com, "Bruno"

### Scripts

- In folder "web":
  - `npm run start` will open a webserver at `localhost:3000` where you can register, login, and display your data.
  - `npm run build` will delete and re-create the dist-folders in "web" and in "sensors", transpile the .ts-files, and copy the views and public folder from "src" to "dist" (within "web").

## STRUCTURE & DIAGRAMS

### Folder Structure

- `auto-mail` : E-Mail alerts when measured values get out of a defined range.
- `database` : Connection to database. GET and POST requests.
- `sensors` : Controls the sensors running on the Raspberry Pi. Measurements are sent directly to the database.
- `web` : HTML / CSS / JavaScript, login & signup, basically everything that runs on the frontend.

### Function Diagrams 

![Engineering4Music (Structure Diagram)](https://github.zhaw.ch/storage/user/3668/files/316a3f80-feaf-11ea-8914-0b4017f132b0)

***

![Sign-Up (Function Diagram)](https://github.zhaw.ch/storage/user/3668/files/0d582f80-feaa-11ea-8216-b92feb1d97ce)

***

![Automatic E-Mails (Function Diagram)](https://github.zhaw.ch/storage/user/3668/files/32e73800-feae-11ea-9409-98fac9a90aa2)

***

<img width="844" alt="Screenshot 2020-09-22 at 16 22 38" src="https://github.zhaw.ch/storage/user/3668/files/4d211600-feae-11ea-901d-e541fcf5154b">

***

<img width="844" alt="Screenshot 2020-09-22 at 16 22 10" src="https://github.zhaw.ch/storage/user/3668/files/4c887f80-feae-11ea-8034-b660d6a92e57">

## ESSENTIAL TECHNOLOGIES

- TypeScript / JavaScript / Node.js (frontend & backend)
- HTML & CSS (frontend)
- PostgreSQL (database)
- d3.js (data visualization)
