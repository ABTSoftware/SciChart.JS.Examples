import { NumericLabelProvider } from "scichart";
import { TFormatLabelFn } from "scichart";

/** Should be same as {@link NumericLabelProvider} but for when data is in milliseconds */
export class CustomLabelProvider extends NumericLabelProvider {
    // protected customFormatLabelProperty: TFormatLabelFn = (dataValueInSeconds: number) =>
    //     this.formatCursorLabelProperty(dataValueInSeconds / 1000);
    // protected customFormatCursorLabelProperty: TFormatLabelFn = (dataValueInSeconds: number) =>
    //     this.formatCursorLabelProperty(dataValueInSeconds / 1000);

    public override get formatLabel() {
        return formatUnixDateToHumanStringHHMMSSms;
    }
    public override get formatCursorLabel() {
        return formatUnixDateToHumanStringHHMMSSms;
    }
}

const formatUnixDateToHumanStringHHMMSSms = (timestamp: DOMHighResTimeStamp): string => {
    const date = new Date(timestamp); // notice there's no multiplication by 1000 here. The data is expected to be in ms
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    const milliseconds = date.getUTCMilliseconds();
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) || isNaN(milliseconds)) {
        return "";
    }
    const hoursString = hours <= 9 ? `0${hours}` : hours.toString(10);
    const minutesString = minutes <= 9 ? `0${minutes}` : minutes.toString(10);
    const secondsString = seconds <= 9 ? `0${seconds}` : seconds.toString(10);
    const millisecondsString = milliseconds <= 9 ? `0${milliseconds}` : milliseconds.toString(10);
    return `${hoursString}:${minutesString}:${secondsString}:${millisecondsString}`;
};
