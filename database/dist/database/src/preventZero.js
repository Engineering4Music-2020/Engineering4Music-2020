"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preventZero = void 0;
const main_1 = require("../../sensors/src/main");
exports.preventZero = () => {
    main_1.getData().then((data) => {
        const humidity = data.humidity;
        if (humidity === 0) {
            console.log(humidity);
            exports.preventZero();
        }
    });
};
