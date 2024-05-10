<script>
    import { onMount } from 'svelte';
    import { drawExample } from './drawExample';

    const divID = 'scichart-root';
    let sciChartSurface;

    onMount(() => {
        let chartInitializationPromise = drawExample(divID).then(res => {
            sciChartSurface = res.sciChartSurface;
        });

        return () => {
            // Check if chart is already initialized
            if (sciChartSurface) {
                sciChartSurface.delete();
                return;
            }

            // Else postpone deletion
            chartInitializationPromise.then(() => {
                sciChartSurface.delete();
            });
        };
    });
</script>

<main>
    <h1>Hello SciChart!</h1>
    <div id={divID} style="width: 100%; height: 500px; max-width: 800px"></div>
</main>
