import { NumberRange } from 'scichart/Core/NumberRange';
import { TSciChart } from 'scichart/types/TSciChart';
import { getTimezoneOffset } from './timezones';
import { NumericTickProvider } from 'scichart/Charting/Numerics/TickProviders/NumericTickProvider';

export class DateTickProvider extends NumericTickProvider {
    private timezone = 'utc';
    private wasmContext: TSciChart;

    constructor(webAssemblyContext: TSciChart, timezone: string) {
        super(webAssemblyContext);
        this.wasmContext = webAssemblyContext;
        this.timezone = timezone;
    }

    protected calculateTicks(visibleRange: NumberRange, delta: number, majorDelta: number): number[] {
        const results: number[] = [];
        const min = visibleRange.min;
        const max = visibleRange.max;

        let current = min;
        const calcMajorTicks = delta === majorDelta;
        const numberUtil = this.wasmContext.NumberUtil;

        const middlePoint = min + (max - min) * 0.5;
        const offset = getTimezoneOffset(middlePoint, this.timezone);
        const offsetDelta = offset % majorDelta;
        if (!numberUtil.IsDivisibleBy(current - offsetDelta, delta)) {
            current = numberUtil.RoundUp(current - offsetDelta, delta) + offsetDelta;
        }
        const start = current;
        let tickCount = 0;
        while (current <= max) {
            // TRUE if major ticks are calculated && Current is divisible by MajorDelta
            // or if minor ticks are calculated && Current is NOT divisible by MajorDelta
            if (!(numberUtil.IsDivisibleBy(current - offsetDelta, majorDelta) !== calcMajorTicks)) {
                results.push(current);
            }
            current = start + ++tickCount * delta;
        }

        return results;
    }
}
