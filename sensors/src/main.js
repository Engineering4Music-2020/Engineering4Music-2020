"use strict";
exports.__esModule = true;
exports.getData = void 0;
// import { GrovePi } from "./sensors";
// import * as Sensors_Module from "./sensors";
var dotenv_1 = require("dotenv");
dotenv_1["default"].config();
function getData() {
    // console.log(process.env.RASPBERRY_AVAILABLE);
    var sensors_m;
    var sensor;
    if (process.env.RASPBERRY_AVAILABLE === "true") {
        console.log("Sensors are available. Sending data from sensors:");
        sensors_m = require("./sensors");
        sensor = new sensors_m.GrovePi(1);
        return Promise.resolve(sensor.measureTemperature());
        // sensor
        // 	.measureTemperature()
        // 	.then((temp: any) => console.log(`Temperature is ${temp}`));
        // sensor
        // 	.measureHumidity()
        // 	.then((humidity: any) => console.log(`Humidity is ${humidity}`));
        // new Promise((resolve) => setTimeout(() => resolve(), 1000))
        // 	.then(() => sensor.measureAirQuality())
        // 	.then((quality) => console.log(`Air qualitiy is ${quality}`));
        // sensor
        // 	.measureBarometricPressure(438.0)
        // 	.then((pressure: any) =>
        // 		console.log(`Barometric pressure is ${pressure}`)
        // 	);
    }
    else {
        console.log("Sensors are not available. Sending mock data:");
        var Temperature_1 = /** @class */ (function () {
            function Temperature(value) {
                var _this = this;
                this.toString = function () {
                    return _this.value + " \u00B0C";
                };
                if (typeof value !== "number" || isNaN(value)) {
                    throw new Error("Temperature is not a number: " + value);
                }
                if (value < -273.15) {
                    throw new Error("Temperature cannot be lower than -273.15 \u00B0C, but is: " + value);
                }
                this.value = value;
            }
            return Temperature;
        }());
        var Humidity_1 = /** @class */ (function () {
            function Humidity(value) {
                var _this = this;
                this.toString = function () {
                    return _this.value + "%";
                };
                if (typeof value !== "number" || isNaN(value)) {
                    throw new Error("Humdity is not a number: " + value);
                }
                if (value < 0 || value > 100) {
                    throw new Error("Humidity must be in range [0, 100], but is: " + value);
                }
                this.value = value;
            }
            return Humidity;
        }());
        var AirQuality_1 = /** @class */ (function () {
            function AirQuality(value) {
                var _this = this;
                this.toString = function () {
                    return _this.value.toString();
                };
                if (value < 0) {
                    throw new Error("Air quality must be >= 0, but is: " + value);
                }
                this.value = value;
            }
            AirQuality.prototype.getRange = function () {
                if (this.value < 300) {
                    return AirQualityRange.FRESH;
                }
                else if (this.value >= 700) {
                    return AirQualityRange.HIGH_POLLUTION;
                }
                else {
                    return AirQualityRange.LOW_POLLUTION;
                }
            };
            return AirQuality;
        }());
        var AirQualityRange = void 0;
        (function (AirQualityRange) {
            AirQualityRange[AirQualityRange["FRESH"] = 0] = "FRESH";
            AirQualityRange[AirQualityRange["LOW_POLLUTION"] = 1] = "LOW_POLLUTION";
            AirQualityRange[AirQualityRange["HIGH_POLLUTION"] = 2] = "HIGH_POLLUTION";
        })(AirQualityRange || (AirQualityRange = {}));
        var BarometricPressure_1 = /** @class */ (function () {
            function BarometricPressure(localPressure, altitude) {
                var _this = this;
                this.toString = function () {
                    return _this.pressureNN + " hPa";
                };
                this.localPressure = parseFloat(localPressure.toFixed(1));
                this.pressureNN = parseFloat((localPressure / Math.pow(1 - altitude / 44330.0, 5.255)).toFixed(1));
            }
            return BarometricPressure;
        }());
        var GrovePi = /** @class */ (function () {
            function GrovePi() {
            }
            GrovePi.prototype.measureTemperature = function () {
                return new Promise(function (resolve, reject) {
                    resolve(new Temperature_1(15));
                });
            };
            GrovePi.prototype.measureHumidity = function () {
                return new Promise(function (resolve, reject) {
                    resolve(new Humidity_1(50));
                });
            };
            GrovePi.prototype.measureAirQuality = function () {
                return new Promise(function (resolve, reject) {
                    resolve(new AirQuality_1(500));
                });
            };
            GrovePi.prototype.measureBarometricPressure = function (altitude) {
                return new Promise(function (resolve, reject) {
                    resolve(new BarometricPressure_1(500, altitude));
                });
            };
            return GrovePi;
        }());
        sensor = new GrovePi();
        return sensor.measureTemperature();
        // sensor
        // 	.measureTemperature()
        // 	.then((temp: any) => console.log(`Temperature is ${temp}`));
        // sensor
        // 	.measureHumidity()
        // 	.then((humidity: any) => console.log(`Humidity is ${humidity}`));
        // new Promise((resolve) => setTimeout(() => resolve(), 1000))
        // 	.then(() => sensor.measureAirQuality())
        // 	.then((quality) => console.log(`Air qualitiy is ${quality}`));
        // sensor
        // 	.measureBarometricPressure(438.0)
        // 	.then((pressure: any) =>
        // 		console.log(`Barometric pressure is ${pressure}`)
        // 	);
    }
}
exports.getData = getData;
