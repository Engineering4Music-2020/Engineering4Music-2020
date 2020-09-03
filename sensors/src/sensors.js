"use strict";
exports.__esModule = true;
exports.GrovePi = exports.BarometricPressure = exports.AirQualityRange = exports.AirQuality = exports.Humidity = exports.Temperature = void 0;
var i2c = require("i2c-bus");
var Temperature = /** @class */ (function () {
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
exports.Temperature = Temperature;
var Humidity = /** @class */ (function () {
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
exports.Humidity = Humidity;
var AirQuality = /** @class */ (function () {
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
exports.AirQuality = AirQuality;
var AirQualityRange;
(function (AirQualityRange) {
    /**
     * Less than 300.
     */
    AirQualityRange[AirQualityRange["FRESH"] = 0] = "FRESH";
    /**
     * Between 300 and 700.
     */
    AirQualityRange[AirQualityRange["LOW_POLLUTION"] = 1] = "LOW_POLLUTION";
    /**
     * Higher than 700.
     */
    AirQualityRange[AirQualityRange["HIGH_POLLUTION"] = 2] = "HIGH_POLLUTION";
})(AirQualityRange = exports.AirQualityRange || (exports.AirQualityRange = {}));
var BarometricPressure = /** @class */ (function () {
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
exports.BarometricPressure = BarometricPressure;
var GrovePi = /** @class */ (function () {
    function GrovePi(busNumber) {
        this.busNumber = busNumber;
    }
    GrovePi.prototype.measureTemperature = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var writeBuffer = Buffer.from([
                GrovePi.GROVEPI_DHT_REGISTER,
                GrovePi.GROVEPI_DHT_PIN,
                1,
                0,
            ]);
            var readBuffer = Buffer.alloc(9, 0);
            var i2cBus = i2c.openSync(_this.busNumber);
            i2cBus.writeI2cBlockSync(GrovePi.GROVEPI_ADDRESS, GrovePi.GROVEPI_DHT_REGISTER, writeBuffer.length, writeBuffer);
            i2cBus.readI2cBlockSync(GrovePi.GROVEPI_ADDRESS, GrovePi.GROVEPI_DATA_REGISTER, readBuffer.length, readBuffer);
            i2cBus.closeSync();
            var temperature = parseFloat(readBuffer.readFloatLE(1).toFixed(3));
            resolve(new Temperature(temperature));
        });
    };
    GrovePi.prototype.measureHumidity = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var writeBuffer = Buffer.from([
                GrovePi.GROVEPI_DHT_REGISTER,
                GrovePi.GROVEPI_DHT_PIN,
                1,
                0,
            ]);
            var readBuffer = Buffer.alloc(9, 0);
            var i2cBus = i2c.openSync(_this.busNumber);
            i2cBus.writeI2cBlockSync(GrovePi.GROVEPI_ADDRESS, GrovePi.GROVEPI_DHT_REGISTER, writeBuffer.length, writeBuffer);
            i2cBus.readI2cBlockSync(GrovePi.GROVEPI_ADDRESS, GrovePi.GROVEPI_DATA_REGISTER, readBuffer.length, readBuffer);
            i2cBus.closeSync();
            var humidity = parseFloat(readBuffer.readFloatLE(5).toFixed(1));
            resolve(new Humidity(humidity));
        });
    };
    GrovePi.prototype.measureAirQuality = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var writeBuffer = Buffer.from([
                GrovePi.GROVEPI_AIRQUALITY_REGISTER,
                GrovePi.GROVEPI_AIRQUALITY_PIN,
                0,
                0,
            ]);
            var readBuffer = Buffer.alloc(4, 0);
            var i2cBus = i2c.openSync(_this.busNumber);
            i2cBus.writeI2cBlockSync(GrovePi.GROVEPI_ADDRESS, GrovePi.GROVEPI_AIRQUALITY_REGISTER, writeBuffer.length, writeBuffer);
            i2cBus.readI2cBlockSync(GrovePi.GROVEPI_ADDRESS, GrovePi.GROVEPI_DATA_REGISTER, readBuffer.length, readBuffer);
            i2cBus.closeSync();
            var airQuality = readBuffer.readInt16BE(1);
            resolve(new AirQuality(airQuality));
        });
    };
    GrovePi.prototype.measureBarometricPressure = function (altitude) {
        return new Promise(function (resolve, reject) {
            // For a full explanation on how to use the BMP280, see:
            // http://www.netzmafia.de/skripten/hardware/RasPi/Projekt-BMP280/index.html
            var i2cBus = i2c.openSync(1);
            var trimmingBuffer = Buffer.alloc(24, 0);
            i2cBus.readI2cBlockSync(GrovePi.BMP280_ADDRESS, GrovePi.BMP280_CALIBRATION_REGISTER, trimmingBuffer.length, trimmingBuffer);
            var digT0 = trimmingBuffer.readUInt16LE(0);
            var digT1 = trimmingBuffer.readInt16LE(2);
            var digT2 = trimmingBuffer.readInt16LE(4);
            var digP0 = trimmingBuffer.readUInt16LE(6);
            var digP1 = trimmingBuffer.readInt16LE(8);
            var digP2 = trimmingBuffer.readInt16LE(10);
            var digP3 = trimmingBuffer.readInt16LE(12);
            var digP4 = trimmingBuffer.readInt16LE(14);
            var digP5 = trimmingBuffer.readInt16LE(16);
            var digP6 = trimmingBuffer.readInt16LE(18);
            var digP7 = trimmingBuffer.readInt16LE(20);
            var digP8 = trimmingBuffer.readInt16LE(22);
            i2cBus.writeByteSync(GrovePi.BMP280_ADDRESS, GrovePi.BMP280_CONTROL_REGISTER, 0x27);
            i2cBus.writeByteSync(GrovePi.BMP280_ADDRESS, GrovePi.BMP280_CONFIGURATION_REGISTER, 0xa0);
            var readBuffer = Buffer.alloc(6, 0);
            i2cBus.readI2cBlockSync(GrovePi.BMP280_ADDRESS, GrovePi.BMP280_DATA_REGISTER, readBuffer.length, readBuffer);
            i2cBus.closeSync();
            // Convert pressure and temperature readings to 19 bit values.
            var adcP = (readBuffer[0] << 12) + (readBuffer[1] << 4) + (readBuffer[2] >> 4);
            var adcT = (readBuffer[3] << 12) + (readBuffer[4] << 4) + (readBuffer[5] >> 4);
            // Compensate temperature readings for sensor offsets.
            var temp1 = (adcT / 16384.0 - digT0 / 1024.0) * digT1;
            var temp3 = adcT / 131072.0 - digT0 / 8192.0;
            var temp2 = temp3 * temp3 * digT2;
            var temperature = (temp1 + temp2) / 5120.0;
            // Compensate pressure readings for sensor offsets.
            var press1 = (temp1 + temp2) / 2.0 - 64000.0;
            // Protect from division by zero.
            if (press1 == 0.0) {
                resolve(new BarometricPressure(0.0, altitude));
                return;
            }
            var press2 = (press1 * press1 * digP5) / 32768.0;
            press2 = press2 + press1 * digP4 * 2.0;
            press2 = press2 / 4.0 + digP3 * 65536.0;
            press1 =
                ((digP2 * press1 * press1) / 524288.0 + digP1 * press1) / 524288.0;
            press1 = (1.0 + press1 / 32768.0) * digP0;
            var press3 = 1048576.0 - adcP;
            press3 = ((press3 - press2 / 4096.0) * 6250.0) / press1;
            press1 = (digP8 * press3 * press3) / 2147483648.0;
            press2 = (press3 * digP7) / 32768.0;
            var pressure = (press3 + (press1 + press2 + digP6) / 16.0) / 100;
            resolve(new BarometricPressure(pressure, altitude));
        });
    };
    GrovePi.GROVEPI_ADDRESS = 0x04;
    GrovePi.GROVEPI_DHT_PIN = 0x04;
    GrovePi.GROVEPI_DHT_REGISTER = 0x28;
    GrovePi.GROVEPI_AIRQUALITY_PIN = 0x01;
    GrovePi.GROVEPI_AIRQUALITY_REGISTER = 0x03;
    GrovePi.GROVEPI_DATA_REGISTER = 0x01;
    GrovePi.BMP280_ADDRESS = 0x77;
    GrovePi.BMP280_CALIBRATION_REGISTER = 0x88;
    GrovePi.BMP280_CONTROL_REGISTER = 0xf4;
    GrovePi.BMP280_CONFIGURATION_REGISTER = 0xf5;
    GrovePi.BMP280_DATA_REGISTER = 0xf7;
    return GrovePi;
}());
exports.GrovePi = GrovePi;
