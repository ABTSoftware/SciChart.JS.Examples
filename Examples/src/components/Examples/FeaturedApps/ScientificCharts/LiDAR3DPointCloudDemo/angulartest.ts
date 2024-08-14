import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    CameraController,
    EColorMapMode,
    EDrawMeshAs,
    EMeshPaletteMode,
    GradientColorPalette,
    MouseWheelZoomModifier3D,
    NumericAxis3D,
    OrbitModifier3D,
    PixelPointMarker3D,
    ScatterRenderableSeries3D,
    SciChart3DSurface,
    SurfaceMeshRenderableSeries3D,
    TLinearColorMap,
    UniformGridDataSeries3D,
    Vector3,
    XyzDataSeries3D,
    zeroArray2D,
    linearColorMapLerp
} from 'scichart';
import { appTheme } from '../../../theme';  
import { AscData, AscReader } from "./AscReader";// Adjust the import according to your path

@Component({
    selector: 'app-scichart',
    template: '<div #chartContainer style="width: 100%; height: 100%;"></div>',
})
export class ScichartComponent implements OnInit {
    @ViewChild('chartContainer') chartContainer: ElementRef;

    constructor(private http: HttpClient) {}

    ngOnInit() {
        this.loadDataAndDrawChart();
    }

    private async loadDataAndDrawChart() {
        try {
            const dataFromServer = await this.getDataFromServer();
            this.drawChart(dataFromServer);
        } catch (error) {
            console.error('Error loading data or drawing chart', error);
        }
    }

    private async getDataFromServer(): Promise<any> {
        const colorMap: TLinearColorMap = {
            Minimum: 0,
            Maximum: 50,
            Mode: EColorMapMode.Interpolated,
            GradientStops: [
                { color: appTheme.DarkIndigo, offset: 0 },
                { color: appTheme.Indigo, offset: 0.2 },
                { color: appTheme.VividSkyBlue, offset: 0.3 },
                { color: appTheme.VividGreen, offset: 0.5 },
                { color: appTheme.MutedRed, offset: 0.7 },
                { color: appTheme.VividOrange, offset: 0.9 },
                { color: appTheme.VividPink, offset: 0 },
            ],
        };

        const reader = new AscReader((height) => linearColorMapLerp(colorMap, height));

        const host = window.location.hostname.includes('scichart.com') || window.location.hostname.includes('localhost')
            ? ''
            : 'https://demo.scichart.com';
            
        const rawData = await this.http.get(host + '/api/lidardata', { responseType: 'text' }).toPromise();
        const ascData: AscData = reader.parse(rawData);

        const meta = ascData.ColorValues.map((c) => ({
            vertexColor: c,
            pointScale: 0,
        }));

        const heightValues2D = zeroArray2D([ascData.NumberRows, ascData.NumberColumns]);
        for (let index = 0, z = 0; z < ascData.NumberRows; z++) {
            for (let x = 0; x < ascData.NumberColumns; x++) {
                heightValues2D[z][x] = ascData.YValues[index++];
            }
        }

        return {
            ascData,
            meta,
            heightValues2D,
        };
    }

    private async drawChart(dataFromServer: any) {
        const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(this.chartContainer.nativeElement, {
            theme: appTheme.SciChartJsTheme,
        });
        sciChart3DSurface.worldDimensions = new Vector3(1000, 200, 1000);

        sciChart3DSurface.camera = new CameraController(wasmContext, {
            position: new Vector3(800, 1000, 800),
            target: new Vector3(0, 50, 0),
        });

        sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: 'X Distance (Meters)' });
        sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: 'Height (Meters)' });
        sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: 'Z Distance (Meters)' });

        sciChart3DSurface.renderableSeries.add(
            new ScatterRenderableSeries3D(wasmContext, {
                pointMarker: new PixelPointMarker3D(wasmContext),
                dataSeries: new XyzDataSeries3D(wasmContext, {
                    xValues: dataFromServer.ascData.XValues,
                    yValues: dataFromServer.ascData.YValues,
                    zValues: dataFromServer.ascData.ZValues,
                    metadata: dataFromServer.meta,
                }),
                opacity: 1,
            })
        );

        sciChart3DSurface.renderableSeries.add(
            new SurfaceMeshRenderableSeries3D(wasmContext, {
                dataSeries: new UniformGridDataSeries3D(wasmContext, {
                    xStart: 0,
                    xStep: dataFromServer.ascData.CellSize,
                    zStart: 0,
                    zStep: dataFromServer.ascData.CellSize,
                    yValues: dataFromServer.heightValues2D,
                }),
                minimum: 0,
                maximum: 50,
                drawSkirt: true,
                opacity: 0.7,
                meshColorPalette: new GradientColorPalette(wasmContext, {
                    gradientStops: [
                        { offset: 1, color: appTheme.VividPink },
                        { offset: 0.9, color: appTheme.VividOrange },
                        { offset: 0.7, color: appTheme.MutedRed },
                        { offset: 0.5, color: appTheme.VividGreen },
                        { offset: 0.3, color: appTheme.VividSkyBlue },
                        { offset: 0.2, color: appTheme.Indigo },
                        { offset: 0, color: appTheme.DarkIndigo },
                    ],
                }),
                contourStroke: appTheme.PaleSkyBlue,
                meshPaletteMode: EMeshPaletteMode.HEIGHT_MAP_INTERPOLATED,
                contourStrokeThickness: 2,
                drawMeshAs: EDrawMeshAs.SOLID_WITH_CONTOURS,
            })
        );

        sciChart3DSurface.chartModifiers.add(new MouseWheelZoomModifier3D());
        sciChart3DSurface.chartModifiers.add(new OrbitModifier3D());
    }
}
