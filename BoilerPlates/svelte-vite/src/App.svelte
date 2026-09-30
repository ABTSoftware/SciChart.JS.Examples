<script>
    import Home from "./routes/Home.svelte";
    import About from "./routes/About.svelte";

    // Toggling the view unmounts the chart component, which is where
    // sciChartSurface.delete() is called - see Home.svelte
    let showHome = $state(true);
</script>

<nav style="width: 100vw; gap: 1rem; display: flex; padding: 1rem">
    <button onclick={() => (showHome = true)} disabled={showHome}>Home</button>
    <button onclick={() => (showHome = false)} disabled={!showHome}>About</button>
</nav>
<div>
    {#if showHome}
        <Home />
    {:else}
        <About />
    {/if}
</div>
