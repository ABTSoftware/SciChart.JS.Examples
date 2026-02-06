import { NumericLabelProvider, TFormatLabelFn } from "scichart";

export class FpsLabelProvider extends NumericLabelProvider {
    override get formatLabel(): TFormatLabelFn {
        return formatToFps;
    }
}

function formatToFps(value: number) {
    return (1000 / value).toFixed(2).toString();
}
