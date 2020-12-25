export class MeasureData {
	public temperature: number;
	public humidity: number;

	public date: Date;

	constructor(temperature: number, humidity: number) {
		this.temperature = temperature;
		this.humidity = humidity;
		this.date = new Date();
	}
}
