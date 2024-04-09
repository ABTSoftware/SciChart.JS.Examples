# SciChart Wrapper with React and Typescript

This example provides a template for an application using scichart with React and Typescript.

It demonstrates how to create a generic React wrapper component for a chart.

Main criteria and points to consider:

1. A chart could be created with an initialization function or a config;
2. The component should be reusable for different chart configurations and chart types;
3. It should be possible to safely create several instances of the component;
4. SciChart instantiation is an async function, thus it should be properly handled;
5. SciChart requires a root node element where it would reside to exist before the instantiation;
6. The chart should be properly disposed after the component is unmounted;
7. It should be easy to add custom functionality to the component;

To meet the criteria:

1. The component allows passing init function or a config via props; as well as the default props for the component root div element.
2. The TS interface of the props specify the required type of an init function, allowing it to create 2D, 3D, and Pie charts.
3. Within the component we generate unique ids for the root elements to make sure there are no collisions with other component instances.
4. The chart initialization is wrapped into a promise called from `useEffect` hook; the promise sets the component state appropriately of after the initialization finish.
   Additionally we allow to specify a fallback component to be shown during the initialization.
5. To make sure the chart root element exist, a separate div element is created internally. This resolves an error of unmounting the component before initialization completion.
6. To make sure the chart is properly disposed, we added a `destructor` callback in the `useEffect` hook.
7. Exposing a custom interface via `useImperativeHandle` hook allows manipulating the chart via a reference from the parent component.

TODO: Other ideas to consider:

-   fully rebuilding / reconfiguring a chart when init function or config changes;
-   setting proper styles on the internal div element

## Running the Example

Open this folder in terminal and run the following commands:

-   `npm install`
-   `npm run dev`

Then visit https://localhost:8080 in your web browser!
