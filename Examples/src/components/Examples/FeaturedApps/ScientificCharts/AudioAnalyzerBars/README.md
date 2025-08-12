# Audio Analyzer

## Overview

This example demonstrates an audio analyzer that uses the computer’s microphone to capture live audio data and display three synchronized charts: a live audio waveform chart, a FFT frequency spectrum chart, and a real-time spectrogram chart. Implementations for Angular and React are provided, and both JavaScript and TypeScript source files are included for key utilities such as audio data processing and FFT computation.

## Technologies Used

-   SciChart.JS for high performance charting
-   Angular (standalone component using scichart-angular) and React (using SciChartReact and SciChartGroup)
-   Web Audio API (including AudioContext, AnalyserNode, and MediaStream) for audio capture
-   Radix-2 FFT algorithm implementation for frequency analysis
-   TypeScript and JavaScript

## Code Explanation

-   **Angular Component (`angular.ts`)**: Implements a standalone Angular component that creates a chart layout with one audio waveform chart and two side-by-side charts for FFT and spectrogram visualizations. The component uses the SciChartAngularComponent and initializes charts via methods provided by the charts initialization API from `drawExample`.
-   **React Component (`index.tsx`)**: Uses React to compose the audio analyzer by wrapping multiple instances of SciChart surfaces within a SciChartGroup. It initializes the charts using the charts initialization API and manages the update lifecycle using React hooks.
-   **Audio Data and Provider Files (`AudioData.js/ts` & `AudioDataProvider.js/ts`)**: Define a simple data model and a provider class that encapsulates audio capture from the user’s microphone. The provider sets up the audio context, connects the stream to an analyser node, and processes audio signal data in real-time.
-   **Chart Drawing and Update (`drawExample.js/ts`)**: Contains the API that creates the three SciChart surfaces. It sets up numeric and logarithmic axes, renderable series for live audio, historical trace, FFT, and spectrogram. It also includes functions to update the charts with new audio data, perform FFT processing using the Radix2FFT, and animate the charts.
-   **FFT Implementation (`Radix2FFT.js/ts`)**: Implements the FFT using the radix-2 method. The code includes complex number manipulation and bit-reversal ordering to process the audio data and generate the frequency domain representation.

## Customization

Key configuration options include:

-   **Audio Settings**: Sample rate is set at 44100 Hz and the buffer size is set to 2048 (ensuring proper FFT operation as a power of 2).
-   **Chart Styles**: Custom themes and color palettes are applied to each chart. The live audio trace uses a fast line series with scrolling behavior while the FFT chart employs a fast mountain renderable series with gradient styling. Spectrogram colors are defined using a heatmap color map.
-   **Animation and Updates**: The charts update on a 20ms interval once all charts are initialized. The update function appends new audio data, updates historical traces, and recalculates FFT and spectrogram data.

## Running the Example

To run any example from the SciChart.JS.Examples repository, follow these steps:

1. **Clone the Repository**: Download the entire repository to your local machine using Git:

    ```bash
    git clone https://github.com/ABTSoftware/SciChart.JS.Examples.git
    ```

2. **Navigate to the Examples Directory**: Change into the `Examples` folder:

    ```bash
    cd SciChart.JS.Examples/Examples
    ```

3. **Install Dependencies**: Install the necessary packages using npm:

    ```bash
    npm install
    ```

4. **Run the Development Server**: Start the development server to view and interact with the examples:

    ```bash
    npm run dev
    ```

    This will launch the demo application, allowing you to explore various examples, including the one in question.

For more detailed instructions, refer to the [SciChart.JS.Examples README](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/README.md).
