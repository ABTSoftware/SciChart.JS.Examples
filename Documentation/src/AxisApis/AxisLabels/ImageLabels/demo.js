async function imageLabels(divElementId) {
  // Demonstrates how to configure an axis with rotated labels in scichart.js
  const {
    SciChartSurface,
    SciChartJsNavyTheme,
    NumericAxis,
    ENumericFormat,
    NumberRange,
    createImagesArrayAsync,
    EAutoRange,
    WaveAnimation,
    TextAnnotation,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    PaletteFactory,
    GradientParams,
    Point,
    FastColumnRenderableSeries,
    XyDataSeries,
  } = SciChart;

  // Dataset = 'percentage market share of phones, 2022'
  const dataset = [
    { name: "Apple", percent: 28.41 },
    { name: "Samsung", percent: 28.21 },
    { name: "Xiaomi", percent: 12.73 },
    { name: "Huawei", percent: 5.27 },
    { name: "Oppo", percent: 5.53 },
    { name: "Vivo", percent: 4.31 },
    { name: "Realme", percent: 3.16 },
    { name: "Motorola", percent: 2.33 },
    { name: "Unknown", percent: 2.19 },
    { name: "LG", percent: 0.85 },
    { name: "OnePlus", percent: 1.11 },
    { name: "Tecno", percent: 1.09 },
    { name: "Infinix", percent: 0.96 },
    { name: "Google", percent: 0.77 },
    { name: "Nokia", percent: 0.45 },
  ];

  // #region ExampleA
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    divElementId,
    {
      theme: new SciChartJsNavyTheme(),
    }
  );

  const xAxis = new NumericAxis(wasmContext, {
    // Ensure there can be 1 label per item in the dataset.
    maxAutoTicks: 15,
    axisTitle: "Mobile phone manufacturer",
    // We need the data value as plain text
    labelFormat: ENumericFormat.NoFormat,
  });

  // SciChart utility function to create HtmlImage elements from urls
  // Note: createImageAsync / createImagesArrayAsync() also accept imported images if using WebPack
  const images = await createImagesArrayAsync([
    "https://scichart.com/demo/images/apple.png",
    "https://scichart.com/demo/images/samsung.png",
    "https://scichart.com/demo/images/xiaomi.png",
    "https://scichart.com/demo/images/huawei.png",
    "https://scichart.com/demo/images/oppo.png",
    "https://scichart.com/demo/images/vivo.png",
    "https://scichart.com/demo/images/realme.png",
    "https://scichart.com/demo/images/motorola.png",
    "https://scichart.com/demo/images/question.png",
    "https://scichart.com/demo/images/lg.png",
    "https://scichart.com/demo/images/oneplus.png",
    "https://scichart.com/demo/images/tecno.png",
    "https://scichart.com/demo/images/infinix.png",
    "https://scichart.com/demo/images/google.png",
    "https://scichart.com/demo/images/nokia.png",
  ]);

  // Override labelProvider.getLabelTexture() to return an image
  const getLabelTexture = (labelText, textureManager, labelStyle) => {
    const index = parseInt(labelText);
    if (!isNaN(index)) {
      const emoji = images[index];
      if (emoji) {
        return textureManager.createTextureFromImage(emoji, 40, 40);
      }
    }
    return textureManager.createTextTexture([labelText], labelStyle);
  };
  xAxis.labelProvider.getLabelTexture = getLabelTexture;

  // If using asyncLabels = true, override this as well
  xAxis.labelProvider.getLabelTextureAsync = (
    labelText,
    textureManager,
    labelStyle
  ) => Promise.resolve(getLabelTexture(labelText, textureManager, labelStyle));

  // Disable shared cache for this provider, otherwise other axes might pick up the emoji textures
  xAxis.labelProvider.useSharedCache = false;

  sciChartSurface.xAxes.add(xAxis);
  // #endregion

  // Create a Y-Axis with standard properties
  sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, {
      autoRange: EAutoRange.Always,
      axisTitle: "Market Share (%)",
      growBy: new NumberRange(0, 0.1),
      labelPostfix: " %",
    })
  );

  // Add a column series.
  sciChartSurface.renderableSeries.add(
    new FastColumnRenderableSeries(wasmContext, {
      // Name index to xvalue for category axis
      // Map percentage to y-value
      // store the manufacturer name in the metadata (used to generate colors)
      dataSeries: new XyDataSeries(wasmContext, {
        xValues: dataset.map((row, index) => index),
        yValues: dataset.map((row) => row.percent),
      }),
      strokeThickness: 0,
      // each column occupies 50% of available space
      dataPointWidth: 0.5,
      // add a gradient fill in X (why not?)
      paletteProvider: PaletteFactory.createGradient(
        wasmContext,
        new GradientParams(new Point(0, 0), new Point(1, 1), [
          { offset: 0, color: "#EC0F6C" },
          { offset: 0.2, color: "#F48420" },
          { offset: 0.3, color: "#DC7969" },
          { offset: 0.5, color: "#67BDAF" },
          { offset: 0.7, color: "#50C7E0" },
          { offset: 0.9, color: "#264B93" },
          { offset: 1, color: "#14233C" },
        ]),
        { enableFill: true, enableStroke: true }
      ),
      // Bit more eye candy ;)
      animation: new WaveAnimation({ duration: 1000 }),
    })
  );

  // Add title annotation
  sciChartSurface.annotations.add(
    new TextAnnotation({
      text: "Mobile Phone manufacturer market share (2022)",
      fontSize: 20,
      textColor: "White",
      x1: 0.5,
      y1: 0,
      opacity: 0.77,
      horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
      xCoordinateMode: ECoordinateMode.Relative,
      yCoordinateMode: ECoordinateMode.Relative,
    })
  );

  sciChartSurface.zoomExtents();
}

imageLabels("scichart-root");
