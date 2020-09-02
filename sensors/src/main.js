"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { GrovePi } from "./sensors";
// import * as Sensors_Module from "./sensors";
const dotenv_1 = __importDefault(require("dotenv"));
// dotenv.config({
// 	path:
// 		"/Users/larscarlschmid/Documents/G/GitHub/Engineering4Music_2020_incubator/.env",
// });
dotenv_1.default.config();
console.log(process.env.RASPBERRY_AVAILABLE);
let sensors_m;
let sensor;
if (process.env.RASPBERRY_AVAILABLE === "true") {
    console.log("Start if {}");
    sensors_m = require("./sensors");
    sensor = new sensors_m.GrovePi(1);
    sensor
        .measureTemperature()
        .then((temp) => console.log(`Temperature is ${temp}`));
    sensor
        .measureHumidity()
        .then((humidity) => console.log(`Humidity is ${humidity}`));
    new Promise((resolve) => setTimeout(() => resolve(), 1000))
        .then(() => sensor.measureAirQuality())
        .then((quality) => console.log(`Air qualitiy is ${quality}`));
    sensor
        .measureBarometricPressure(438.0)
        .then((pressure) => console.log(`Barometric pressure is ${pressure}`));
}
else {
    console.log("Start else {}");
    class Temperature {
        constructor(value) {
            this.toString = () => {
                return `${this.value} °C`;
            };
            if (typeof value !== "number" || isNaN(value)) {
                throw new Error(`Temperature is not a number: ${value}`);
            }
            if (value < -273.15) {
                throw new Error(`Temperature cannot be lower than -273.15 °C, but is: ${value}`);
            }
            this.value = value;
        }
    }
    class Humidity {
        constructor(value) {
            this.toString = () => {
                return `${this.value}%`;
            };
            if (typeof value !== "number" || isNaN(value)) {
                throw new Error(`Humdity is not a number: ${value}`);
            }
            if (value < 0 || value > 100) {
                throw new Error(`Humidity must be in range [0, 100], but is: ${value}`);
            }
            this.value = value;
        }
    }
    class AirQuality {
        constructor(value) {
            this.toString = () => {
                return this.value.toString();
            };
            if (value < 0) {
                throw new Error(`Air quality must be >= 0, but is: ${value}`);
            }
            this.value = value;
        }
        getRange() {
            if (this.value < 300) {
                return AirQualityRange.FRESH;
            }
            else if (this.value >= 700) {
                return AirQualityRange.HIGH_POLLUTION;
            }
            else {
                return AirQualityRange.LOW_POLLUTION;
            }
        }
    }
    let AirQualityRange;
    (function (AirQualityRange) {
        AirQualityRange[AirQualityRange["FRESH"] = 0] = "FRESH";
        AirQualityRange[AirQualityRange["LOW_POLLUTION"] = 1] = "LOW_POLLUTION";
        AirQualityRange[AirQualityRange["HIGH_POLLUTION"] = 2] = "HIGH_POLLUTION";
    })(AirQualityRange || (AirQualityRange = {}));
    class BarometricPressure {
        constructor(localPressure, altitude) {
            this.toString = () => {
                return `${this.pressureNN} hPa`;
            };
            this.localPressure = parseFloat(localPressure.toFixed(1));
            this.pressureNN = parseFloat((localPressure / Math.pow(1 - altitude / 44330.0, 5.255)).toFixed(1));
        }
    }
    class GrovePi {
        measureTemperature() {
            return new Promise((resolve, reject) => {
                resolve(new Temperature(25));
            });
        }
        measureHumidity() {
            return new Promise((resolve, reject) => {
                resolve(new Humidity(45));
            });
        }
        measureAirQuality() {
            return new Promise((resolve, reject) => {
                resolve(new AirQuality(125));
            });
        }
        measureBarometricPressure(altitude) {
            return new Promise((resolve, reject) => {
                resolve(new BarometricPressure(1100, altitude));
            });
        }
    }
    sensor = new GrovePi();
    sensor
        .measureTemperature()
        .then((temp) => console.log(`Temperature is ${temp}`));
    sensor
        .measureHumidity()
        .then((humidity) => console.log(`Humidity is ${humidity}`));
    new Promise((resolve) => setTimeout(() => resolve(), 1000))
        .then(() => sensor.measureAirQuality())
        .then((quality) => console.log(`Air qualitiy is ${quality}`));
    sensor
        .measureBarometricPressure(438.0)
        .then((pressure) => console.log(`Barometric pressure is ${pressure}`));
}
// import code from other sensor.....................................................
// import { GrovePi } from "./sensors";
// const sensor = new GrovePi(1);
// // START: TO BE PROGRAMMED - EXERCISE 4
// sensor
// 	.measureHumidity()
// 	.then((resolve) => console.log(`Humidity is: ${resolve}.`));
// sensor
// 	.measureBarometricPressure(438)
// 	.then((resolve) => console.log(`Barometric Pressure is: ${resolve}.`));
// // END: TO BE PROGRAMMED - EXERCISE 4
// sensor
// 	.measureTemperature()
// 	.then((temp) => console.log(`Temperature is ${temp}`));
// new Promise((resolve) => setTimeout(() => resolve(), 1000))
// 	.then(() => sensor.measureAirQuality())
// 	// .then((quality) => console.log(`Air qualitiy is ${quality}.`))
// 	.then((quality) => {
// 		const value = quality.getRange();
// 		if (value == 0) {
// 			console.log("Air quality is fresh.");
// 		} else if (value == 1) {
// 			console.log("Air quality is low pollution.");
// 		} else if (value == 2) {
// 			console.log("Air quality is high pollution.");
// 		}
// 		console.log(`Air qualitiy is ${quality}.`);
// 	});
// // sensor.measureAirQuality().then((resolve) => {
// // 	value = resolve.getRange();
// // 	if (value == 0) {
// // 		console.log("Air quality is fresh.");
// // 	} else if (value == 1) {
// // 		console.log("Air quality is low pollution.");
// // 	} else if (value == 2) {
// // 		console.log("Air quality is high pollution.");
// // 	}
// // });
//# sourceMappingURL=main.js.map