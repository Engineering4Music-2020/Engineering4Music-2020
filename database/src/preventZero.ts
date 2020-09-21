import { getData } from "../../sensors/src/main";

export const preventZero = () => {
    getData().then((data) => {
        const humidity = data.humidity
        if (humidity === 0) {
            console.log(humidity);
            preventZero();
        }
    });
}