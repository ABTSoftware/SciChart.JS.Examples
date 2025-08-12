import { SciChartReact } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";

import appleLogo from "./images/apple.png";
import samsungLogo from "./images/samsung.png";
import xiaomiLogo from "./images/xiaomi.png";
import huaweiLogo from "./images/huawei.png";
import oppoLogo from "./images/oppo.png";
import vivoLogo from "./images/vivo.png";
import realmeLogo from "./images/realme.png";
import motorolaLogo from "./images/motorola.png";
import unknownLogo from "./images/question.png";
import lgLogo from "./images/lg.png";
import oneplusLogo from "./images/oneplus.png";
import tecnoLogo from "./images/tecno.png";
import infinixLogo from "./images/infinix.png";
import googleLogo from "./images/google.png";
import nokiaLogo from "./images/nokia.png";

const emojiUrls = [
    appleLogo,
    samsungLogo,
    xiaomiLogo,
    huaweiLogo,
    oppoLogo,
    vivoLogo,
    realmeLogo,
    motorolaLogo,
    unknownLogo,
    lgLogo,
    oneplusLogo,
    tecnoLogo,
    infinixLogo,
    googleLogo,
    nokiaLogo,
];

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    return <SciChartReact initChart={drawExample(emojiUrls)} className={commonClasses.ChartWrapper} />;
}
