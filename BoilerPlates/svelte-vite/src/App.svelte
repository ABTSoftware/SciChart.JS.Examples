<script>
    import { Router, Link, Route } from "svelte-routing";
    import Home from "./routes/Home.svelte";
    import About from "./routes/About.svelte";
</script>

<Router>
    <nav style="width: 100vw; gap: 1rem; display: flex; padding: 1rem">
        <Link to="/">Home</Link>
        <Link to="about">About</Link>
    </nav>
    <div>
        <Route path="about" component="{About}" />
        <Route path="/" component="{Home}" />
    </div>
</Router>