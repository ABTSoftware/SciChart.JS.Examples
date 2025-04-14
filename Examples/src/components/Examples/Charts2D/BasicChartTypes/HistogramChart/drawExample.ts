import { appTheme } from "../../../theme";
import {
    NumericAxis,
    ZoomPanModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    SciChartSurface,
    Thickness,
    ETextAlignment,
    ETitlePosition,
    ENumericFormat,
    EAxisAlignment,
    FastRectangleRenderableSeries,
    XyxyDataSeries,
    EColumnYMode,
    EColumnMode,
    EDataPointWidthMode,
    EResamplingMode,
    NumberRange,
} from "scichart";

// Data
const populationData = {
    xValue: [
        0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 
        55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
    ],
    yValue: {
        africa: {
            male: [
                35754890, 31813896, 28672207, 24967595, 20935790, 17178324, 14422055,
                12271907, 10608417, 8608183, 6579937, 5035598, 3832420, 2738448,
                1769284, 1013988, 470834, 144795, 26494, 2652, 140,
            ],
            female: [
                34834623, 31000760, 27861135, 24206021, 20338468, 16815440, 14207659,
                12167437, 10585531, 8658614, 6721555, 5291815, 4176910, 3076943,
                2039952, 1199203, 591092, 203922, 45501, 5961, 425,
            ],
        },
        europe: {
            male: [
                4869936, 5186991, 5275063, 5286053, 5449038, 5752398, 6168124,
                6375035, 6265554, 5900833, 6465830, 7108184, 6769524, 5676968,
                4828153, 3734266, 2732054, 1633630, 587324, 128003, 12023,
            ],
            female: [
                4641147, 4940521, 5010242, 5010526, 5160160, 5501673, 6022599,
                6329356, 6299693, 5930345, 6509757, 7178487, 7011569, 6157651,
                5547296, 4519433, 3704145, 2671974, 1276597, 399148, 60035,
            ],
        },
    },
};

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        title: "Europe and Africa Population Distribution by Age Range",
        titleStyle: {
            color: "#FFFFFF",
            fontSize: 24,
            alignment: ETextAlignment.Center,
            position: ETitlePosition.Top,
            placeWithinChart: false,
            padding: new Thickness(10, 0, 10, 0), // add some Y padding
        }
    });
    
    const xAxis = new NumericAxis(wasmContext, {
        autoTicks: false,
        majorDelta: 5,
        axisTitle: "Age Range (Years)",
        axisTitleStyle: {
            fontSize: 14,
            fontFamily: "Arial",
            color: "#ffffff",
            // fontWeight: "bold",
            fontStyle: "italic",
        },
        growBy: new NumberRange(0.02, 0.02),
    })
    xAxis.labelProvider.formatLabel = (value: number) => {
        if (value === 5) return "";
        if (value > 30 && value < 45) return "";
        if (value > 80 && value < 105) return "";
        if (value === 105) return "100+";
        return value.toFixed(0);
    }
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Engineering,
        axisTitle: "Population (Milions)",
        axisAlignment: EAxisAlignment.Left,
        isVisible: true,
        axisTitleStyle: {
            fontSize: 14,
            fontFamily: "Arial",
            color: "#ffffff",
            // fontWeight: "bold",
            fontStyle: "italic",
        },
        growBy: new NumberRange(0, 0.1),
    })
    sciChartSurface.yAxes.add(yAxis);
    
    const totalData = populationData.yValue.africa.male.map((d, i) => {
        const yValue =
            d +
            populationData.yValue.africa.female[i] +
            populationData.yValue.europe.male[i] +
            populationData.yValue.europe.female[i];
    
        return {
            yValue,
            xValue: populationData.xValue[i],
        };
    });
        
    const eightyPlus = totalData.reduce((acc, cur) => {
        return cur.xValue >= 80 ? cur.yValue + acc : acc;
    }, 0) as number;
    
    const aboveThirtyAndLessThanfourtyFive = totalData.reduce((acc, cur) => {
        return cur.xValue >= 30 && cur.xValue < 45 ? cur.yValue + acc : acc;
    }, 0) as number;
    
    const zeroToTen = totalData.reduce((acc, cur) => {
        return cur.xValue < 10 ? cur.yValue + acc : acc;
    }, 0) as number;
    
    const unwanted = [5, 35, 40, 85, 90, 95, 100];
    
    const xValues = totalData
        .map((d) => d.xValue)
        .filter((d) => {
            return !unwanted.includes(d);
        });
    
    const yValues = totalData.map(() => 0).slice(0, 14);
    
    const x1Values = totalData
        .map((d) => {
            return d.xValue + 5;
        })
        .filter((d) => {
            return !unwanted.includes(d);
        });
    
    const y1Values = totalData.reduce<number[]>((acc, cur) => {
        if (
            !unwanted.includes(cur.xValue) &&
            cur.xValue !== 80 &&
            cur.xValue !== 30 &&
            cur.xValue !== 0
        ) {
            acc.push(cur.yValue);
        }
    
        if (cur.xValue === 30) {
            acc.push(aboveThirtyAndLessThanfourtyFive);
        } else if (cur.xValue === 100) {
            acc.push(eightyPlus);
        } else if (cur.xValue === 0) {
            acc.push(zeroToTen);
        }
    
        return acc;
    }, []);
    
    // add the FastRectangleRenderableSeries
    const rectangleSeries = new FastRectangleRenderableSeries(wasmContext, {
        dataSeries: new XyxyDataSeries(wasmContext, {
            xValues,
            yValues,
            x1Values,
            y1Values,
            // metadata,
        }),
        columnXMode: EColumnMode.StartEnd,
        columnYMode: EColumnYMode.TopBottom,
        dataPointWidth: 1,
        dataPointWidthMode: EDataPointWidthMode.Range,
        stroke: "black",
        strokeThickness: 2,
        fill: "steelblue",
        opacity: 0.5,
        resamplingMode: EResamplingMode.None,
        topCornerRadius: 2,
        bottomCornerRadius: 2,
        // dataLabels: {
        //   horizontalTextPosition: EHorizontalTextPosition.Right,
        //   verticalTextPosition: EVerticalTextPosition.Above,
        //   positionMode: EColumnDataLabelPosition.Outside,
        //   style: {
        //     fontSize: 16,
        //     padding: new Thickness(0, 0, 8, 32),
        //   },
        //   color: "#EEE",
        //   metaDataSelector: (md) => {
        //     const metadata = md as MetadataType;
        //     return metadata.label;
        //   },
        // },
        // this does not work
        // animation: new WaveAnimation({ duration: 1000 })
    });
    sciChartSurface.renderableSeries.add(rectangleSeries);

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier({ enableZoom: true }),
        new ZoomExtentsModifier(),
        new MouseWheelZoomModifier()
    );

    return { sciChartSurface, wasmContext };
};