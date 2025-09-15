import { useEffect } from "react";
import Charts from "./Charts";
import useDataStore, { WaferData } from "./store";
import { csvJSON } from "./helpers";

import { generateWaferData } from "./waferData";

export default function Overview() {
    const { setData, data } = useDataStore();

    useEffect(() => {
        const fetchDies = async () => {
            // const response = await fetch("./wfdata.csv");
            // const csvContent = await response.text();

            // // console.log(csvJSON(csvContent))

            // const dataJSON = csvJSON(csvContent) as WaferData[];


            let data = generateWaferData(100)

            setData(data);
        };

        fetchDies();
    }, [setData]);

    return data.length ? <Charts></Charts> : null;
}
