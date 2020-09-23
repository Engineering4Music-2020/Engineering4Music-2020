"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeasureData = void 0;
class MeasureData {
    constructor(temperature, humidity) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.date = new Date();
    }
}
exports.MeasureData = MeasureData;
