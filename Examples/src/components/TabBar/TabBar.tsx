import { TabName } from "../TopBarTabs";
import classes from "./TabBar.scss";

export default function TabBar({ activeTab, handleTabClick }: {
    activeTab: TabName;
    handleTabClick: (tab: TabName) => void;
}) {
    return (
        <div className={classes.tabwrapper}>
            <ul className={classes.tabs}>
                <li
                    className={`${classes.tablink} ${activeTab === "Featured Apps" ? classes.active : ""}`}
                    onClick={() => handleTabClick("Featured Apps")}
                >
                    Featured&nbsp;Apps
                </li>
                <li
                    className={`${classes.tablink} ${activeTab === "2D Charts" ? classes.active : ""}`}
                    onClick={() => handleTabClick("2D Charts")}
                >
                    2D&nbsp;Charts
                </li>
                <li
                    className={`${classes.tablink} ${activeTab === "3D Charts" ? classes.active : ""}`}
                    onClick={() => handleTabClick("3D Charts")}
                >
                    3D&nbsp;Charts
                </li>
                <li
                    className={`${classes.tablink} ${classes.mobilehidden} ${activeTab === "Demos by Industry" ? classes.active : ""}`}
                    onClick={() => handleTabClick("Demos by Industry")}
                >
                    Demos&nbsp;by&nbsp;Industry
                </li>
                <li
                    className={`${classes.tablink} ${classes.mobilehidden} ${activeTab === "Demos by Feature" ? classes.active : ""}`}
                    onClick={() => handleTabClick("Demos by Feature")}
                >
                    Demos&nbsp;by&nbsp;Feature
                </li>
            </ul>
        </div>
    )
}