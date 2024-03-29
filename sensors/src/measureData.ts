import dotenv from "dotenv";
import { Temperature, Humidity } from "./sensors";
import { MeasureData } from "./measureDataObject";

dotenv.config();

export async function getData(): Promise<MeasureData> {
	let sensors_m: any;
	let sensor: any;
	if (process.env.RASPBERRY_AVAILABLE === "true") {
		sensors_m = require("./sensors");
		sensor = new sensors_m.GrovePi(1);
		const humidity: Humidity = await sensor.measureHumidity();
		const temperature: Temperature = await sensor.measureTemperature();
		const measureData = new MeasureData(temperature.value, humidity.value);
		return measureData;
	} else {
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

			public toNumber = (): number => {
				return this.value;
			};
		}

		class Humidity {
			readonly value: number;

			public constructor(value: number) {
				if (typeof value !== "number" || isNaN(value)) {
					throw new Error(`Humdity is not a number: ${value}`);
				}
				if (value < 0 || value > 100) {
					throw new Error(
						`Humidity must be in range [0, 100], but is: ${value}`
					);
				}

				this.value = value;
			}

			public toString = (): string => {
				return `${this.value}%`;
			};

			public toNumber = (): number => {
				return this.value;
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

			public toNumber = (): number => {
				return this.pressureNN;
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
					resolve(new Temperature(20));
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

		const humidity: Humidity = await sensor.measureHumidity();
		const temperature: Temperature = await sensor.measureTemperature();
		const measureData = new MeasureData(temperature.value, humidity.value);
		return measureData;
	}
}
