export type AscData = {
    XValues: number[];
    YValues: number[];
    ZValues: number[];
    ColorValues: number[];
    CellSize: number;
    XllCorner: number;
    YllCorner: number;
    NumberColumns: number;
    NumberRows: number;
    NoDataValue: number;
};

/**
 * The AscReader is a helper class created to read Asc format Geo Spatial / LiDAR data
 */
export class AscReader {
    private dataLines: string[];
    private curParseIndex: number;
    private colorMapFunction?: (height: number) => number;
    private reportProgress?: (process: number) => void;

    constructor(colorMapFunction?: (color: number) => number, reportProgress?: (process: number) => void) {
        this.dataLines = [];
        this.curParseIndex = 0;
        this.colorMapFunction = colorMapFunction;
        this.reportProgress = reportProgress;
    }

    public parse(data: string): AscData {
        // Prepare date
        this.dataLines = data.split("\n");
        this.curParseIndex = 0;

        // Load the ASC file format
        const result: AscData = {
            NumberColumns: this.readInt("ncols"),
            NumberRows: this.readInt("nrows"),
            XllCorner: this.readInt("xllcorner"),
            YllCorner: this.readInt("yllcorner"),
            CellSize: this.readInt("cellsize"),
            NoDataValue: this.readInt("NODATA_value"),
            XValues: [],
            YValues: [],
            ZValues: [],
            ColorValues: [],
        };

        // Generate X-values based off cell position
        const xValuesRow: number[] = [];
        // TODO: reserve xValuesRow with the size of result.NumberColumns
        for (let i = 0; i < result.NumberColumns; ++i) {
            xValuesRow.push(i * result.CellSize);
        }

        for (let i = 0; i < result.NumberRows; ++i) {
            // Read heights from the ASC file and generate Z-cell values
            const heightValuesRow: number[] = this.readFloats(" ", result.NoDataValue);

            const zValuesRow: number[] = [];
            // TODO: reserve xValuesRow with the size of result.NumberColumns
            for (let j = 0; j < result.NumberColumns; ++j) {
                zValuesRow.push(i * result.CellSize);
            }

            // Append the row
            result.XValues.push(...xValuesRow);
            result.YValues.push(...heightValuesRow);
            result.ZValues.push(...zValuesRow);

            // Optional color-mapping of points based on height
            if (this.colorMapFunction) {
                const colorValuesRow: number[] = [];
                // TODO: reserve colorValuesRow with the size of result.NumberColumns
                for (let j = 0; j < result.NumberColumns; ++j) {
                    colorValuesRow.push(this.colorMapFunction(heightValuesRow[j]));
                }
                result.ColorValues.push(...colorValuesRow);
            }

            // Optional report loading progress 0-100%
            if (this.reportProgress) {
                this.reportProgress((100 * i) / result.NumberRows);
            }
        }

        return result;
    }

    private readInt(prefix: string): number {
        const line: string = this.dataLines[this.curParseIndex++];
        const numberStr: string = line.replace(prefix, "").trim();
        return parseInt(numberStr);
    }

    private readFloats(separator: string, noDataValue: number): number[] {
        const line: string = this.dataLines[this.curParseIndex++];
        const values: string[] = line.split(separator);
        const retval: number[] = [];
        // TODO: reserve the out array with the size of values.length
        // retval.reverse(values.length);
        for (const valueStr of values) {
            if (/\S/.test(valueStr)) {
                const valueNum: number = parseInt(valueStr);
                if (valueNum === noDataValue) {
                    retval.push(NaN);
                } else {
                    retval.push(valueNum);
                }
            }
        }

        return retval;
    }
}
