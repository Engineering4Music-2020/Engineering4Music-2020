import { GrovePi } from "./sensors";

const sensor = new GrovePi(1);

/*
 * The sensors actually don't like being queried concurrently which the code
 * below does more or less. Improving the code e.g. by accumulating an object
 * in each promise, is left as an exercise for the reader. Other interesting
 * ideas can be found in https://stackoverflow.com/q/28250680/759042.
 */

sensor.measureTemperature()
	.then((temp) => console.log(`Temperature is ${temp}`));

sensor.measureHumidity()
	.then((humidity) => console.log(`Humidity is ${humidity}`));

new Promise((resolve) => setTimeout(() => resolve(), 1000))
	.then(() => sensor.measureAirQuality())
	.then((quality) => console.log(`Air qualitiy is ${quality}`));

sensor.measureBarometricPressure(438.0)
	.then((pressure) => console.log(`Barometric pressure is ${pressure}`));
