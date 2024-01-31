import { EAxisType, EChart2DModifierType, ESeriesType, ISciChart2DDefinition, chartBuilder } from "scichart";

const config: ISciChart2DDefinition = {
    xAxes: [{ type: EAxisType.NumericAxis }],
    yAxes: [{ type: EAxisType.NumericAxis }],
    series: [
        {
            type: ESeriesType.SplineMountainSeries,
            options: {
                fill: "#3ca832",
                stroke: "#eb911c",
                strokeThickness: 4,
                opacity: 0.4
            },
            xyData: { xValues: [1, 2, 3, 4], yValues: [1, 4, 7, 3] }
        }
    ],
    modifiers: [
        { type: EChart2DModifierType.ZoomPan, options: { enableZoom: true } },
        { type: EChart2DModifierType.MouseWheelZoom },
        { type: EChart2DModifierType.ZoomExtents }
    ]
};

const initChart = () => chartBuilder.build2DChart("chart", config);

initChart();

const onClick = () => {
    // @ts-ignore
    const body = {
        appUrl: "http://localhost:3000"
    };
    fetch("http://localhost:3000/export-chart", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body) // body data type must match "Content-Type" header
    })
        .then(response => {
            // Check if the response is successful (status code 200)
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            // Assuming the response contains the image data, you can convert it to a Blob
            return response.blob();
        })
        .then(blob => {
            // Create a temporary link and trigger the download
            var link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = "my-file.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
};

const exportButton = document.getElementById("export-button")
exportButton.addEventListener("click", onClick)