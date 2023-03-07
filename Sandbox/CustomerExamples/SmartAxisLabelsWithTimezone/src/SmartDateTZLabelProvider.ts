import {
    TCategoryCoordCalc,
    ELabelProviderType,
    ENumericFormat,
    formatNumber,
    AxisBase2D,
    labelCache,
    ILabel2DOptions,
    LabelInfo,
    LabelProviderBase2D
} from 'scichart';
import { EDateScale, getDateScale } from './EDateScale';
import { EDateTickDelta, getDateTickDelta } from './EDateTickDelta';
import { createDateTzConverter, TDateTzConverterFn } from './timezones';
import { axisLabelDateFormatter } from './axisLabelDateFormatter';

export class SmartDateTZLabelProvider extends LabelProviderBase2D {
    public readonly type = ELabelProviderType.SmartDate;
    private timeZoneProperty: string;
    private dateTzConverter: TDateTzConverterFn;
    private locale = 'en';

    constructor(timeZone: string, locale?: string, options?: ILabel2DOptions) {
        super({
            labelFormat: options?.labelFormat ?? ENumericFormat.Date_DDMMYYYY,
            cursorLabelFormat: options?.cursorLabelFormat ?? ENumericFormat.Date_DDMMYYYY,
            ...options
        });
        this.timeZone = timeZone;
        this.locale = locale ?? this.locale;
        this.formatLabelProperty = (dataValue: number) =>
            this.applyFormat(formatNumber(dataValue, this.numericFormat, this.precision));
        this.formatCursorLabelProperty = (dataValue: number) =>
            this.applyFormat(
                formatNumber(
                    dataValue,
                    this.cursorNumericFormat ?? this.numericFormat,
                    this.cursorPrecision ?? this.precision
                )
            );
    }

    /** @inheritDoc Its ok to leave throw new error for now*/
    public get numericFormat() {
        throw new Error('Setting or getting numericFormat is not supported for SmartDateLabelProvider');
    }
    /** @inheritDoc Its ok to leave throw new error for now*/
    public set numericFormat(value: ENumericFormat) {
        throw new Error('Setting or getting numericFormat is not supported for SmartDateLabelProvider');
    }

    public get timeZone() {
        return this.timeZoneProperty;
    }

    public set timeZone(value: string) {
        this.timeZoneProperty = value;
        this.dateTzConverter = createDateTzConverter(value);
    }

    /**
     * @inheritDoc
     */
    public onBeginAxisDraw(): void {
        // User can override here if they want
    }
    /**
     * @inheritDoc
     */
    public getLabels(majorTicks: number[]): string[] {
        // Mark label types
        const convertedTicks = majorTicks.map(t => Math.round(this.dateTzConverter(t * 1000) / 1000));

        let ticks = convertedTicks;
        if (this.parentAxis.isCategoryAxis) {
            const categoryCoordCalc = this.parentAxis.getCurrentCoordinateCalculator() as TCategoryCoordCalc;
            ticks = convertedTicks.map(tick => categoryCoordCalc.transformIndexToData(tick));
        }
        const labels: string[] = [];

        const ticksNumber = ticks.length;
        const timeRange = ticks[ticksNumber - 1] - ticks[0];
        const diff = ticks.length >= 2 ? Math.abs(ticks[0] - ticks[1]) : timeRange;
        const dateTickDelta = getDateTickDelta(diff);
        const dateScale = this.getTradeChartLabelFormat(dateTickDelta);
        for (let index = 0; index < ticks.length; index++) {
            const tick = ticks[index];
            const text = this.formatTradeChartLabel(dateScale, tick, dateTickDelta);
            const cachedLabelText = this.tickToText.get(tick);
            let cachedLabel: LabelInfo;
            if (cachedLabelText && cachedLabelText === text) {
                cachedLabel = labelCache.getLabel(cachedLabelText, this.styleId);
                labels.push(cachedLabelText);
            } else {
                this.tickToText.set(tick, text);
                const axis = this.parentAxis as AxisBase2D;
                const texture = this.getCachedLabelTexture(
                    text,
                    axis.axisRenderer.textureManager,
                    axis.dpiAdjustedLabelStyle
                );
                if (!texture.textureWidth) {
                    cachedLabel = new LabelInfo(
                        tick,
                        text,
                        texture.bitmapTexture,
                        texture.textureHeight,
                        texture.textureWidth
                    );
                    labelCache.setLabel(text, this.styleId, cachedLabel);
                }
                labels.push(text);
            }
        }
        labelCache.pruneCache();
        return labels;
    }

    private getTradeChartLabelFormat(delta: EDateTickDelta): EDateScale {
        if (
            [
                EDateTickDelta.Second1,
                EDateTickDelta.Second2,
                EDateTickDelta.Second5,
                EDateTickDelta.Second10,
                EDateTickDelta.Second15,
                EDateTickDelta.Second30
            ].includes(delta)
        ) {
            return EDateScale.Seconds;
        }
        if (
            [
                EDateTickDelta.Minute1,
                EDateTickDelta.Minute2,
                EDateTickDelta.Minute5,
                EDateTickDelta.Minute10,
                EDateTickDelta.Minute15,
                EDateTickDelta.Minute30
            ].includes(delta)
        ) {
            return EDateScale.HoursMinutes;
        }
        if ([EDateTickDelta.Hour1, EDateTickDelta.Hour3, EDateTickDelta.Hour6, EDateTickDelta.Hour12].includes(delta)) {
            return EDateScale.HoursMinutes;
        }
        if ([EDateTickDelta.Day1, EDateTickDelta.Day3, EDateTickDelta.Day5, EDateTickDelta.Day10].includes(delta)) {
            return EDateScale.Days;
        }
        if ([EDateTickDelta.Month1, EDateTickDelta.Month3, EDateTickDelta.Month6].includes(delta)) {
            return EDateScale.Months;
        }
        return EDateScale.Years;
    }

    private formatTradeChartLabel(axisDateScale: EDateScale, tickTime: number, dateTickDelta: number): string {
        const labelDateScale = getDateScale(tickTime, axisDateScale, dateTickDelta);
        if (labelDateScale === EDateScale.Seconds) {
            return axisLabelDateFormatter.toSecond(tickTime);
        } else if (labelDateScale === EDateScale.HoursMinutes) {
            return axisLabelDateFormatter.toHourMinute(tickTime);
        } else if (labelDateScale === EDateScale.Days) {
            return axisLabelDateFormatter.toDay(tickTime, this.locale);
        } else if (labelDateScale === EDateScale.Months) {
            return axisLabelDateFormatter.toMonth(tickTime, this.locale);
        } else {
            return axisLabelDateFormatter.toYear(tickTime);
        }
    }
}
