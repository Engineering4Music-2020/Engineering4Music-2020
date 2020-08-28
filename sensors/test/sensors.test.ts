import { GrovePi, AirQualityRange } from "../src/sensors";

const i2cBusSpy = Object.create({});
i2cBusSpy.writeI2cBlockSync = jest.fn();
i2cBusSpy.writeByteSync = jest.fn();
i2cBusSpy.readI2cBlockSync = jest.fn();
i2cBusSpy.closeSync = jest.fn();

jest.mock("i2c-bus", () => ({
	openSync: (bus: number) => i2cBusSpy
}));

describe("GrovePiSensor", () => {
	test("temperature must be a number", () => {
		i2cBusSpy.readI2cBlockSync = jest.fn(
			(address: number, command: number, length: number, buffer: Buffer) => {
				const expected = Buffer.alloc(9, 0);
				expected.writeFloatLE(Number.NaN, 1);
				expected.copy(buffer);
			}
		);

		const sensor = new GrovePi(1);
		return sensor.measureTemperature()
			.then(value => fail("An error should have been thrown"))
			.catch(error => expect(error.message).toBe("Temperature is not a number: NaN"));
	});

	test("temperature is 24.7 °C", () => {
		i2cBusSpy.readI2cBlockSync = jest.fn(
			(address: number, command: number, length: number, buffer: Buffer) => {
				const expected = Buffer.alloc(9, 0);
				expected.writeFloatLE(24.7, 1);
				expected.copy(buffer);
			}
		);

		const sensor = new GrovePi(1);
		return sensor.measureTemperature()
			.then(temp => expect(temp.value).toBe(24.7));
	});

	test("temperature is -273.15 °C", () => {
		i2cBusSpy.readI2cBlockSync = jest.fn(
			(address: number, command: number, length: number, buffer: Buffer) => {
				const expected = Buffer.alloc(9, 0);
				expected.writeFloatLE(-273.150, 1);
				expected.copy(buffer);
			}
		);

		const sensor = new GrovePi(1);
		return sensor.measureTemperature()
			.then(temp => expect(temp.value).toBe(-273.15));
	});

	test("temperature below -273.150 °C throws error", () => {
		i2cBusSpy.readI2cBlockSync = jest.fn(
			(address: number, command: number, length: number, buffer: Buffer) => {
				const expected = Buffer.alloc(9, 0);
				expected.writeFloatLE(-273.16, 1);
				expected.copy(buffer);
			}
		);

		const sensor = new GrovePi(1);
		return sensor.measureTemperature()
			.then(value => fail("An error should have been thrown"))
			.catch(error => expect(error.message).toBe("Temperature cannot be lower than -273.15 °C, but is: -273.16"));
	});

	test("humdity must be a number", () => {
		i2cBusSpy.readI2cBlockSync = jest.fn(
			(address: number, command: number, length: number, buffer: Buffer) => {
				const expected = Buffer.alloc(9, 0);
				expected.writeFloatLE(Number.NaN, 5);
				expected.copy(buffer);
			}
		);

		const sensor = new GrovePi(1);
		return sensor.measureHumidity()
			.then(value => fail("An error should have been thrown"))
			.catch(error => expect(error.message).toBe("Humdity is not a number: NaN"));
	});

	test("humdity is 48.8%", () => {
		i2cBusSpy.readI2cBlockSync = jest.fn(
			(address: number, command: number, length: number, buffer: Buffer) => {
				const expected = Buffer.alloc(9, 0);
				expected.writeFloatLE(48.8, 5);
				expected.copy(buffer);
			}
		);

		const sensor = new GrovePi(1);
		return sensor.measureHumidity()
			.then(humidity => expect(humidity.value).toBe(48.8));
	});

	test("humdity cannot be < 0%", () => {
		i2cBusSpy.readI2cBlockSync = jest.fn(
			(address: number, command: number, length: number, buffer: Buffer) => {
				const expected = Buffer.alloc(9, 0);
				expected.writeFloatLE(-0.1, 5);
				expected.copy(buffer);
			}
		);

		const sensor = new GrovePi(1);
		return sensor.measureHumidity()
			.then(value => fail("An error should have been thrown"))
			.catch(error => expect(error.message).toBe("Humidity must be in range [0, 100], but is: -0.1"));
	});

	test("humdity cannot be > 100%", () => {
		i2cBusSpy.readI2cBlockSync = jest.fn(
			(address: number, command: number, length: number, buffer: Buffer) => {
				const expected = Buffer.alloc(9, 0);
				expected.writeFloatLE(100.1, 5);
				expected.copy(buffer);
			}
		);

		const sensor = new GrovePi(1);
		return sensor.measureHumidity()
			.then(value => fail("An error should have been thrown"))
			.catch(error => expect(error.message).toBe("Humidity must be in range [0, 100], but is: 100.1"));
	});

	test("air quality is good if in range [300, 700)", () => {
		i2cBusSpy.readI2cBlockSync = jest.fn()
			.mockImplementationOnce((address: number, command: number, length: number, buffer: Buffer) => {
				const expected = Buffer.alloc(4, 0);
				expected.writeInt16BE(300, 1);
				expected.copy(buffer);
			})
			.mockImplementationOnce((address: number, command: number, length: number, buffer: Buffer) => {
				const expected = Buffer.alloc(4, 0);
				expected.writeInt16BE(699, 1);
				expected.copy(buffer);
			});

		const sensor = new GrovePi(1);
		return Promise.all([
			sensor.measureAirQuality()
				.then(quality => expect(quality.getRange()).toBe(AirQualityRange.LOW_POLLUTION)),
			sensor.measureAirQuality()
				.then(quality => expect(quality.getRange()).toBe(AirQualityRange.LOW_POLLUTION))
		]);
	});

	test("air quality is fresh if < 300", () => {
		i2cBusSpy.readI2cBlockSync = jest.fn((address: number, command: number, length: number, buffer: Buffer) => {
			const expected = Buffer.alloc(4, 0);
			expected.writeInt16BE(299, 1);
			expected.copy(buffer);
		});
		const sensor = new GrovePi(1);
		return sensor.measureAirQuality()
			.then(quality => expect(quality.getRange()).toBe(AirQualityRange.FRESH));
	});

	test("air quality is highly polluted if >= 700", () => {
		i2cBusSpy.readI2cBlockSync = jest.fn((address: number, command: number, length: number, buffer: Buffer) => {
			const expected = Buffer.alloc(4, 0);
			expected.writeInt16BE(700, 1);
			expected.copy(buffer);
		});
		const sensor = new GrovePi(1);
		return sensor.measureAirQuality()
			.then(quality => expect(quality.getRange()).toBe(AirQualityRange.HIGH_POLLUTION));
	});

	test("air quality cannot be lower than 0", () => {
		i2cBusSpy.readI2cBlockSync = jest.fn((address: number, command: number, length: number, buffer: Buffer) => {
			const expected = Buffer.alloc(4, 0);
			expected.writeInt16BE(-1, 1);
			expected.copy(buffer);
		});
		const sensor = new GrovePi(1);
		return sensor.measureAirQuality()
			.then(value => fail("An error should have been thrown"))
			.catch(error => expect(error.message).toBe("Air quality must be >= 0, but is: -1"));
	});

	test("barometric pressure is 1010 hPa", () => {
		i2cBusSpy.readI2cBlockSync = jest.fn()
			.mockImplementationOnce((address: number, command: number, length: number, buffer: Buffer) => {
				// Trimming parameters
				const expected = Buffer.from([
					0xbe, 0x6b, 0xe6, 0x66, 0x18, 0xfc, 0xbb, 0x92,
					0x70, 0xd6, 0xd0, 0x0b, 0xe2, 0x10, 0x25, 0x01,
					0xf9, 0xff, 0x8c, 0x3c, 0xf8, 0xc6, 0x70, 0x17
				]);
				expected.copy(buffer);
			})
			.mockImplementationOnce((address: number, command: number, length: number, buffer: Buffer) => {
				const expected = Buffer.from([0x61, 0xec, 0x00, 0x7d, 0xb8, 0x00]);
				expected.copy(buffer);
			});

		const sensor = new GrovePi(1);
		return sensor.measureBarometricPressure(438)
			.then(pressure => {
				expect(pressure.pressureNN).toBe(1010);
				expect(pressure.localPressure).toBe(958.7);
			});
	});
});
