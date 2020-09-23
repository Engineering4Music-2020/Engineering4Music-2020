"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const i2c = __importStar(require("i2c-bus"));
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
exports.Temperature = Temperature;
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
exports.Humidity = Humidity;
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
exports.AirQuality = AirQuality;
var AirQualityRange;
(function (AirQualityRange) {
    // Less than 300
    AirQualityRange[AirQualityRange["FRESH"] = 0] = "FRESH";
    // Between 300 and 700
    AirQualityRange[AirQualityRange["LOW_POLLUTION"] = 1] = "LOW_POLLUTION";
    // Higher than 700
    AirQualityRange[AirQualityRange["HIGH_POLLUTION"] = 2] = "HIGH_POLLUTION";
})(AirQualityRange = exports.AirQualityRange || (exports.AirQualityRange = {}));
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
exports.BarometricPressure = BarometricPressure;
class GrovePi {
    constructor(busNumber) {
        this.busNumber = busNumber;
    }
    measureTemperature() {
        return new Promise((resolve, reject) => {
            const writeBuffer = Buffer.from([
                GrovePi.GROVEPI_DHT_REGISTER,
                GrovePi.GROVEPI_DHT_PIN,
                1,
                0,
            ]);
            const readBuffer = Buffer.alloc(9, 0);
            const i2cBus = i2c.openSync(this.busNumber);
            i2cBus.writeI2cBlockSync(GrovePi.GROVEPI_ADDRESS, GrovePi.GROVEPI_DHT_REGISTER, writeBuffer.length, writeBuffer);
            i2cBus.readI2cBlockSync(GrovePi.GROVEPI_ADDRESS, GrovePi.GROVEPI_DATA_REGISTER, readBuffer.length, readBuffer);
            i2cBus.closeSync();
            const temperature = parseFloat(readBuffer.readFloatLE(1).toFixed(3));
            resolve(new Temperature(temperature));
        });
    }
    measureHumidity() {
        return new Promise((resolve, reject) => {
            const writeBuffer = Buffer.from([
                GrovePi.GROVEPI_DHT_REGISTER,
                GrovePi.GROVEPI_DHT_PIN,
                1,
                0,
            ]);
            const readBuffer = Buffer.alloc(9, 0);
            const i2cBus = i2c.openSync(this.busNumber);
            i2cBus.writeI2cBlockSync(GrovePi.GROVEPI_ADDRESS, GrovePi.GROVEPI_DHT_REGISTER, writeBuffer.length, writeBuffer);
            i2cBus.readI2cBlockSync(GrovePi.GROVEPI_ADDRESS, GrovePi.GROVEPI_DATA_REGISTER, readBuffer.length, readBuffer);
            i2cBus.closeSync();
            const humidity = parseFloat(readBuffer.readFloatLE(5).toFixed(1));
            resolve(new Humidity(humidity));
        });
    }
    measureAirQuality() {
        return new Promise((resolve, reject) => {
            const writeBuffer = Buffer.from([
                GrovePi.GROVEPI_AIRQUALITY_REGISTER,
                GrovePi.GROVEPI_AIRQUALITY_PIN,
                0,
                0,
            ]);
            const readBuffer = Buffer.alloc(4, 0);
            const i2cBus = i2c.openSync(this.busNumber);
            i2cBus.writeI2cBlockSync(GrovePi.GROVEPI_ADDRESS, GrovePi.GROVEPI_AIRQUALITY_REGISTER, writeBuffer.length, writeBuffer);
            i2cBus.readI2cBlockSync(GrovePi.GROVEPI_ADDRESS, GrovePi.GROVEPI_DATA_REGISTER, readBuffer.length, readBuffer);
            i2cBus.closeSync();
            const airQuality = readBuffer.readInt16BE(1);
            resolve(new AirQuality(airQuality));
        });
    }
    measureBarometricPressure(altitude) {
        return new Promise((resolve, reject) => {
            // For a full explanation on how to use the BMP280, see:
            // http://www.netzmafia.de/skripten/hardware/RasPi/Projekt-BMP280/index.html
            const i2cBus = i2c.openSync(1);
            const trimmingBuffer = Buffer.alloc(24, 0);
            i2cBus.readI2cBlockSync(GrovePi.BMP280_ADDRESS, GrovePi.BMP280_CALIBRATION_REGISTER, trimmingBuffer.length, trimmingBuffer);
            const digT0 = trimmingBuffer.readUInt16LE(0);
            const digT1 = trimmingBuffer.readInt16LE(2);
            const digT2 = trimmingBuffer.readInt16LE(4);
            const digP0 = trimmingBuffer.readUInt16LE(6);
            const digP1 = trimmingBuffer.readInt16LE(8);
            const digP2 = trimmingBuffer.readInt16LE(10);
            const digP3 = trimmingBuffer.readInt16LE(12);
            const digP4 = trimmingBuffer.readInt16LE(14);
            const digP5 = trimmingBuffer.readInt16LE(16);
            const digP6 = trimmingBuffer.readInt16LE(18);
            const digP7 = trimmingBuffer.readInt16LE(20);
            const digP8 = trimmingBuffer.readInt16LE(22);
            i2cBus.writeByteSync(GrovePi.BMP280_ADDRESS, GrovePi.BMP280_CONTROL_REGISTER, 0x27);
            i2cBus.writeByteSync(GrovePi.BMP280_ADDRESS, GrovePi.BMP280_CONFIGURATION_REGISTER, 0xa0);
            const readBuffer = Buffer.alloc(6, 0);
            i2cBus.readI2cBlockSync(GrovePi.BMP280_ADDRESS, GrovePi.BMP280_DATA_REGISTER, readBuffer.length, readBuffer);
            i2cBus.closeSync();
            // Convert pressure and temperature readings to 19 bit values.
            const adcP = (readBuffer[0] << 12) + (readBuffer[1] << 4) + (readBuffer[2] >> 4);
            const adcT = (readBuffer[3] << 12) + (readBuffer[4] << 4) + (readBuffer[5] >> 4);
            // Compensate temperature readings for sensor offsets.
            const temp1 = (adcT / 16384.0 - digT0 / 1024.0) * digT1;
            const temp3 = adcT / 131072.0 - digT0 / 8192.0;
            const temp2 = temp3 * temp3 * digT2;
            const temperature = (temp1 + temp2) / 5120.0;
            // Compensate pressure readings for sensor offsets.
            let press1 = (temp1 + temp2) / 2.0 - 64000.0;
            // Protect from division by zero.
            if (press1 == 0.0) {
                resolve(new BarometricPressure(0.0, altitude));
                return;
            }
            let press2 = (press1 * press1 * digP5) / 32768.0;
            press2 = press2 + press1 * digP4 * 2.0;
            press2 = press2 / 4.0 + digP3 * 65536.0;
            press1 =
                ((digP2 * press1 * press1) / 524288.0 + digP1 * press1) / 524288.0;
            press1 = (1.0 + press1 / 32768.0) * digP0;
            let press3 = 1048576.0 - adcP;
            press3 = ((press3 - press2 / 4096.0) * 6250.0) / press1;
            press1 = (digP8 * press3 * press3) / 2147483648.0;
            press2 = (press3 * digP7) / 32768.0;
            const pressure = (press3 + (press1 + press2 + digP6) / 16.0) / 100;
            resolve(new BarometricPressure(pressure, altitude));
        });
    }
}
exports.GrovePi = GrovePi;
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
