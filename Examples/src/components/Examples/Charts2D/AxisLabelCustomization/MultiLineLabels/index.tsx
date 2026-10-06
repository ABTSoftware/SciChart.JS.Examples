import { useRef, useState } from "react";
import { drawExample } from "./drawExample";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { TextLabelProvider } from "scichart";
export default function MultiLineLabels() {
    const labelProviderRef = useRef<TextLabelProvider>(undefined);

    const [preset, setPreset] = useState<number>(2);

    const handlePreset = (value: number) => {
        setPreset(value);
        switch (value) {
            case 0:
                labelProviderRef.current.rotation = 0;
                labelProviderRef.current.maxLength = 9;
                break;
            case 1:
                labelProviderRef.current.rotation = 20;
                labelProviderRef.current.maxLength = 0;
                break;
            case 2:
                labelProviderRef.current.rotation = 30;
                labelProviderRef.current.maxLength = 15;
                break;
            default:
                labelProviderRef.current.rotation = 30;
                labelProviderRef.current.maxLength = 15;
                break;
        }
    };

    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
                <div className="sc-button-group" role="group" aria-label="Label layout">
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={preset === 0}
                        onClick={() => handlePreset(0)}
                    >
                        Multi-Line
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={preset === 1}
                        onClick={() => handlePreset(1)}
                    >
                        Single Line Rotated
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={preset === 2}
                        onClick={() => handlePreset(2)}
                    >
                        Multi-Line Rotated
                    </button>
                </div>
            </header>
            <SciChartReact
                initChart={drawExample}
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    const { labelProvider } = initResult;
                    labelProviderRef.current = labelProvider;
                }}
            />
        </div>
    );
}
