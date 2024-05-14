import { chartConfig } from "./chart-configurations"
import { SciChartReact } from "scichart-react";

function App() {
    return (
        <div style={{
            display: 'flex', 
            flexDirection: 'column',
            height: '100vh', 
            justifyContent: 'center', 
            alignItems: 'center'
        }}>
            <h1>SciChart with React + Vite</h1>
            <SciChartReact config={chartConfig} style={{ width: 900 }} />
        </div>
    )
}

export default App