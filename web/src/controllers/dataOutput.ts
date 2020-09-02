import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

let sensors_m;
let sensor: any;

if (process.env.RASPBERRY_AVAILABLE === "true") {
	console.log("Sensors are available. Sending data from sensors:");
	sensors_m = require("./sensors");
	sensor = new sensors_m.GrovePi(1);
	sensor
		.measureTemperature()
		.then((temp: any) => console.log(`Temperature is ${temp}`));
	sensor
		.measureHumidity()
		.then((humidity: any) => console.log(`Humidity is ${humidity}`));
	new Promise((resolve) => setTimeout(() => resolve(), 1000))
		.then(() => sensor.measureAirQuality())
		.then((quality) => console.log(`Air qualitiy is ${quality}`));
	sensor
		.measureBarometricPressure(438.0)
		.then((pressure: any) => console.log(`Barometric pressure is ${pressure}`));
} else {
	console.log("Sensors are not available. Sending mock data:");
	class Temperature {
		readonly value: number;

		public constructor(value: number) {
			if (typeof value !== "number" || isNaN(value)) {
				throw new Error(`Temperature is not a number: ${value}`);
			}
			if (value < -273.15) {
				throw new Error(
					`Temperature cannot be lower than -273.15 °C, but is: ${value}`
				);
			}
			this.value = value;
		}

		public toString = (): string => {
			return `${this.value} °C`;
		};
	}

	class Humidity {
		readonly value: number;

		public constructor(value: number) {
			if (typeof value !== "number" || isNaN(value)) {
				throw new Error(`Humdity is not a number: ${value}`);
			}
			if (value < 0 || value > 100) {
				throw new Error(`Humidity must be in range [0, 100], but is: ${value}`);
			}

			this.value = value;
		}

		public toString = (): string => {
			return `${this.value}%`;
		};
	}

	class AirQuality {
		readonly value: number;

		public constructor(value: number) {
			if (value < 0) {
				throw new Error(`Air quality must be >= 0, but is: ${value}`);
			}
			this.value = value;
		}

		public getRange(): AirQualityRange {
			if (this.value < 300) {
				return AirQualityRange.FRESH;
			} else if (this.value >= 700) {
				return AirQualityRange.HIGH_POLLUTION;
			} else {
				return AirQualityRange.LOW_POLLUTION;
			}
		}

		public toString = (): string => {
			return this.value.toString();
		};
	}

	enum AirQualityRange {
		FRESH,
		LOW_POLLUTION,
		HIGH_POLLUTION,
	}

	class BarometricPressure {
		readonly localPressure: number;

		readonly pressureNN: number;

		constructor(localPressure: number, altitude: number) {
			this.localPressure = parseFloat(localPressure.toFixed(1));
			this.pressureNN = parseFloat(
				(localPressure / Math.pow(1 - altitude / 44330.0, 5.255)).toFixed(1)
			);
		}

		public toString = (): string => {
			return `${this.pressureNN} hPa`;
		};
	}
	interface Sensor {
		measureTemperature(): Promise<Temperature>;
		measureHumidity(): Promise<Humidity>;
		measureAirQuality(): Promise<AirQuality>;
		measureBarometricPressure(altitude: number): Promise<BarometricPressure>;
	}
	class GrovePi implements Sensor {
		measureTemperature(): Promise<Temperature> {
			return new Promise((resolve, reject) => {
				resolve(new Temperature(5));
			});
		}

		measureHumidity(): Promise<Humidity> {
			return new Promise((resolve, reject) => {
				resolve(new Humidity(50));
			});
		}

		measureAirQuality(): Promise<AirQuality> {
			return new Promise((resolve, reject) => {
				resolve(new AirQuality(500));
			});
		}

		measureBarometricPressure(altitude: number): Promise<BarometricPressure> {
			return new Promise((resolve, reject) => {
				resolve(new BarometricPressure(500, altitude));
			});
		}
	}

	sensor = new GrovePi();

	sensor
		.measureTemperature()
		.then((temp: any) => console.log(`Temperature is ${temp}`));

	sensor
		.measureHumidity()
		.then((humidity: any) => console.log(`Humidity is ${humidity}`));

	new Promise((resolve) => setTimeout(() => resolve(), 1000))
		.then(() => sensor.measureAirQuality())
		.then((quality) => console.log(`Air qualitiy is ${quality}`));

	sensor
		.measureBarometricPressure(438.0)
		.then((pressure: any) => console.log(`Barometric pressure is ${pressure}`));
}

export const main = (req: Request, res: Response) => {
	const temp = sensor.measureTemperature().then((temp: any) => {
		res.render("main", {
			body: temp,
		});
	});
};
