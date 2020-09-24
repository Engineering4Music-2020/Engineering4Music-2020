"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getData = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const measureDataObject_1 = require("./measureDataObject");
dotenv_1.default.config();
function getData() {
    return __awaiter(this, void 0, void 0, function* () {
        let sensors_m;
        let sensor;
        if (process.env.RASPBERRY_AVAILABLE === "true") {
            console.log("Sensors are available. Sending data from sensors:");
            sensors_m = require("./sensors");
            sensor = new sensors_m.GrovePi(1);
            const humidity = yield sensor.measureHumidity();
            const temperature = yield sensor.measureTemperature();
            const measureData = new measureDataObject_1.MeasureData(temperature.value, humidity.value);
            return measureData;
        }
        else {
            console.log("Sensors are not available. Sending mock data:");
            class Temperature {
                constructor(value) {
                    this.toString = () => {
                        return `${this.value} °C`;
                    };
                    this.toNumber = () => {
                        return this.value;
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
                    this.toNumber = () => {
                        return this.value;
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
                    this.toNumber = () => {
                        return this.pressureNN;
                    };
                    this.localPressure = parseFloat(localPressure.toFixed(1));
                    this.pressureNN = parseFloat((localPressure / Math.pow(1 - altitude / 44330.0, 5.255)).toFixed(1));
                }
            }
            class GrovePi {
                measureTemperature() {
                    return new Promise((resolve, reject) => {
                        resolve(new Temperature(15));
                    });
                }
                measureHumidity() {
                    return new Promise((resolve, reject) => {
                        resolve(new Humidity(50));
                    });
                }
                measureAirQuality() {
                    return new Promise((resolve, reject) => {
                        resolve(new AirQuality(500));
                    });
                }
                measureBarometricPressure(altitude) {
                    return new Promise((resolve, reject) => {
                        resolve(new BarometricPressure(500, altitude));
                    });
                }
            }
            sensor = new GrovePi();
            const humidity = yield sensor.measureHumidity();
            const temperature = yield sensor.measureTemperature();
            const measureData = new measureDataObject_1.MeasureData(temperature.value, humidity.value);
            return measureData;
        }
    });
}
exports.getData = getData;
