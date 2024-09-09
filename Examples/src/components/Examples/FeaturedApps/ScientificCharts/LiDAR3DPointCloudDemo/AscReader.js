/**
 * The AscReader is a helper class created to read Asc format Geo Spatial / LiDAR data
 */
export class AscReader {
    dataLines;
    curParseIndex;
    colorMapFunction;
    reportProgress;
    constructor(colorMapFunction, reportProgress) {
        this.dataLines = [];
        this.curParseIndex = 0;
        this.colorMapFunction = colorMapFunction;
        this.reportProgress = reportProgress;
    }
    parse(data) {
        // Prepare date
        this.dataLines = data.split("\n");
        this.curParseIndex = 0;
        // Load the ASC file format
        const result = {
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
        const xValuesRow = [];
        // TODO: reserve xValuesRow with the size of result.NumberColumns
        for (let i = 0; i < result.NumberColumns; ++i) {
            xValuesRow.push(i * result.CellSize);
        }
        for (let i = 0; i < result.NumberRows; ++i) {
            // Read heights from the ASC file and generate Z-cell values
            const heightValuesRow = this.readFloats(" ", result.NoDataValue);
            const zValuesRow = [];
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
                const colorValuesRow = [];
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
    readInt(prefix) {
        const line = this.dataLines[this.curParseIndex++];
        const numberStr = line.replace(prefix, "").trim();
        return parseInt(numberStr);
    }
    readFloats(separator, noDataValue) {
        const line = this.dataLines[this.curParseIndex++];
        const values = line.split(separator);
        const retval = [];
        // TODO: reserve the out array with the size of values.length
        // retval.reverse(values.length);
        for (const valueStr of values) {
            if (/\S/.test(valueStr)) {
                const valueNum = parseInt(valueStr);
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
