"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MeasureData {
    constructor(temperature, humidity) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.date = new Date();
    }
}
exports.MeasureData = MeasureData;
