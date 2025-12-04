import { SciChartSurface } from "scichart";
import { SciChartReact, type TResolvedReturnType } from "scichart-react";
import { drawExample } from "./chart-setup/drawExample";

SciChartSurface.loadWasmFromCDN();

function App() {
    return (
        <div className="text-center">
            <header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
                <SciChartReact
                    style={{ width: "70%", aspectRatio: "3 / 2" }}
                    initChart={drawExample}
                    onInit={({ sciChartSurface, controls }: TResolvedReturnType<typeof drawExample>) => {
                        controls.startUpdate();
                    }}
                />
            </header>
        </div>
    );
}

export default App;
