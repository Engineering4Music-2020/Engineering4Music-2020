# Sensor Client Template

Template for the part of the weather station that controls the sensors. Based on NodeJS and TypeScript.

## Prerequisites

* Raspberry Pi with GrovePi, including DHT sensor, air quality sensor and BMP 280 barometric pressure sensor.
* NodeJS 10.x
* C/C++ commpiler
* Python 2.7

Development is possible on any platform supported by NodeJS 10 even without access to GrovePi.

## Quick Start

Install the required NodeJS packages:

```
$ npm install
```

Build the code:

```
$ npm run build
```

The transpiled code is saved to the folder `dist/`.

Run the code:

```
$ npm run start
```

Run the test suite:

```
$ npm run test
```

For additional targets, consult the `package.json`.
