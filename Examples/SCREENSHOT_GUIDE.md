# Screenshot Guide for AI Agents

This is a guide for taking screenshots of all examples under "Examples/src/components/examples" folder.
The screenshots are used for the SciChart.js website and documentation.

## RULES:
- The size of each image will be 500 x 750 pixels (in landscape mode), in .jpg format and compressed down to about 40-50kb.
- Some demos need extra interactions / time spent to be fully representative, or should NOT be re-taken at all:

## EXTRA DEMO INTERACTIONS:
- Load 1 Million points -> stop the demo before taking screenshot.
- Realtime audio spectrum / audio analyzer bars -> do NOT retake them, keep the existing screenshot.
- Client-Server websocket -> use mountain instead of lines.
- Rich interactions -> wait for it to draw nicely, more seconds than usual.
- high performance svg  -> fake a cursor over the chart.
- smith chart -> add some interactions that show in the right pane with details.
- heatmap chart -> make sure to have the full range of the colormap visible, with a bright red centre

The rest as pretty self explanatory.