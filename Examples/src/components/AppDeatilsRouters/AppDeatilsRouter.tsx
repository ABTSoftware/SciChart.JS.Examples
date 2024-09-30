import React, { useState, FC, useContext, useMemo, useEffect } from "react";
import classes from "./AppDeatilsRouter.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { MENU_ITEMS_2D, MENU_ITEMS_3D, MENU_ITEMS_FEATURED_APPS } from "../AppRouter/examples";
import { getTitle } from "../../helpers/shared/Helpers/frameworkParametrization";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";
import ExamplesRoot from "../Examples/ExampleRootDetails";
import SearchIcon from "../TopBarTabs/images/icon-search.svg";
import { TExamplePage } from "../AppRouter/examplePages";
import { GalleryItem } from "../../helpers/types/types";
import { generateSearchItems, TSearchItem } from "../Search/searchItems";
import { ALL_MENU_ITEMS } from "../AppRouter/examples";
import SubMenuItems from "./SubMenuItems";
import SourceCode from "../SourceCode/SourceCode";
import DetailsCom from "./DetailsComp";

type TabName = "Featured Apps" | "2D Charts" | "3D Charts";

type TProps = {
    currentExample: TExamplePage;
    isIFrame?: boolean;
    seeAlso: GalleryItem[];
};

interface IFiles {
    [key: string]: {
        content: string;
        isBinary: boolean;
    };
}

const AppDeatilsRouter: FC<TProps> = (props) => {
    const { currentExample, seeAlso, isIFrame = false } = props;
    const [sourceFiles, setSourceFiles] = useState<{ name: string; content: string }[]>([]);
    const [selectedFile, setSelectedFile] = useState<{ name: string; content: string }>({
        name: "",
        content: "",
    });
    const location = useLocation();
    const currentPath = location.pathname;
    // Split the path into framework and the rest (example path)
    const [currentFramework, ...examplePath] = currentPath.split("/");
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabName>("Featured Apps");
    const [currentMenuItems, setCurrentMenuItems] = useState(MENU_ITEMS_FEATURED_APPS);
    const [selectedItemId, setSelectedItemId] = useState(currentMenuItems[0].item.id);
    const selectedFramework = useContext(FrameworkContext);

    const searchItems: TSearchItem[] = useMemo(
        () => generateSearchItems(ALL_MENU_ITEMS, selectedFramework),
        [selectedFramework]
    );
    const selectedItem = currentMenuItems.find((item) => item?.item.id === selectedItemId);
    const SubmenuTitle = selectedItem?.submenu?.map((item) => {
        return { title: getTitle(item?.title, selectedFramework), path: item.path };
    });
    const PageTitle = getTitle(currentExample.title, selectedFramework);
    const [query, setQuery] = useState("");
    const [filteredOptions, setFilteredOptions] = useState([]);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const value = (e.currentTarget as HTMLElement).getAttribute("data-value");
        if (value) {
            // Navigate to the new framework along with the current example path
            navigate(`/${value}/${examplePath.join("/")}`);
        }
    };

    const handleInputChange = (e: any) => {
        const value = e.target.value.toLowerCase();
        setQuery(value);

        if (value) {
            const filtered = searchItems.filter(
                (item) => item.category.toLowerCase().includes(value) || item.keywords.toLowerCase().includes(value)
            );
            setFilteredOptions(filtered);
        } else {
            setFilteredOptions([]);
        }
    };

    useEffect(() => {
        fetch("/source/" + currentExample.path + "?framework=" + selectedFramework)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((json) => {
                setSelectedFile({ name: json[0].name, content: json[0].content });
                setSourceFiles(json);
            });
    }, [currentExample, selectedFramework]);

    const handleFileClick = (fileName: string) => {
        const file = sourceFiles.find((f) => f.name === fileName);
        setSelectedFile({ name: fileName, content: file.content });
    };

    const handleOptionClick = (option: any) => {
        setQuery(option.title);
        setFilteredOptions([]);
        // Optionally, navigate to the link
        if (window) {
            window.location.href = option.link;
        }
    };

    const handleTabClick = (tabName: TabName) => {
        setActiveTab(tabName);
        switch (tabName) {
            case "Featured Apps":
                setCurrentMenuItems(MENU_ITEMS_FEATURED_APPS);
                setSelectedItemId(MENU_ITEMS_FEATURED_APPS[0].item.id);
                break;
            case "2D Charts":
                setCurrentMenuItems(MENU_ITEMS_2D);
                setSelectedItemId(MENU_ITEMS_2D[0].item.id);
                break;
            case "3D Charts":
                setCurrentMenuItems(MENU_ITEMS_3D);
                setSelectedItemId(MENU_ITEMS_3D[0].item.id);
                break;
        }
    };

    const handleClicks = (id: any) => {
        setSelectedItemId(id);
    };

    const handleSubmenuClick = (path: string) => {
        navigate(`/${selectedFramework}/${path}`);
    };

    return (
        <>
            <div className={classes.frameworksection}>
                <div className={classes.FrameworkList}>
                    <div
                        onClick={(e) => {
                            handleClick(e);
                        }}
                        data-value="react"
                        style={{ fontWeight: 500, fontFamily: "Arial", fontSize: "20px" }}
                        className={`${classes.FrameworkListItem} ${currentFramework === "react" ? classes.active : ""}`}
                    >
                        React
                    </div>
                    <div
                        onClick={(e) => {
                            handleClick(e);
                        }}
                        style={{ fontWeight: 500, fontFamily: "Arial", fontSize: "20px" }}
                        data-value="javascript"
                        className={`${classes.FrameworkListItem} ${
                            currentFramework === "javascript" ? classes.active : ""
                        }`}
                    >
                        JavaScript
                    </div>
                    <div
                        onClick={(e) => {
                            handleClick(e);
                        }}
                        style={{ fontWeight: 500, fontFamily: "Arial", fontSize: "20px" }}
                        data-value="angular"
                        className={`${classes.FrameworkListItem} ${
                            currentFramework === "angular" ? classes.active : ""
                        }`}
                    >
                        Angular
                    </div>
                </div>
            </div>
            <div className={classes.tabsection}>
                <div className={classes.container}>
                    <div className={classes.tabwrapper}>
                        <ul className={classes.tabs}>
                            <li
                                className={`${classes.tablink} ${activeTab === "Featured Apps" ? classes.active : ""}`}
                                onClick={() => handleTabClick("Featured Apps")}
                                style={{ fontWeight: 500, fontFamily: "Arial", fontSize: "18px" }}
                            >
                                Featured Apps
                            </li>
                            <li
                                className={`${classes.tablink} ${activeTab === "2D Charts" ? classes.active : ""}`}
                                onClick={() => handleTabClick("2D Charts")}
                                style={{ fontWeight: 500, fontFamily: "Arial", fontSize: "18px" }}
                            >
                                2D Charts
                            </li>
                            <li
                                className={`${classes.tablink} ${activeTab === "3D Charts" ? classes.active : ""}`}
                                onClick={() => handleTabClick("3D Charts")}
                                style={{ fontWeight: 500, fontFamily: "Arial", fontSize: "18px" }}
                            >
                                3D Charts
                            </li>
                        </ul>
                    </div>
                    <div className={classes.contentwrapper}>
                        <div id="tab-1" className={`${classes.tabcontent} ${classes.active}`}>
                            <div className={classes.tabbreadcrumbwrap}>
                                <ul style={{ fontWeight: 500, fontFamily: "Arial", fontSize: "15px" }}>
                                    <li>
                                        <a href="/react">Home</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0);">{currentFramework}</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0);">{activeTab}</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0);">
                                            {currentMenuItems.map((item) => {
                                                return <>{selectedItemId === item.item.id && item.item.name}</>;
                                            })}
                                        </a>
                                    </li>
                                    <li>{PageTitle}</li>
                                </ul>
                            </div>
                            <SubMenuItems
                                currentMenuItems={currentMenuItems}
                                selectedItemId={selectedItemId}
                                handleClicks={handleClicks}
                                SubmenuTitle={SubmenuTitle}
                                handleSubmenuClick={handleSubmenuClick}
                            />
                            {/* <!-- Search-box --> */}
                            <div className={classes.tabsearchwrap}>
                                <input
                                    className={classes.searchinput}
                                    type="text"
                                    value={query}
                                    onChange={handleInputChange}
                                    placeholder="Search..."
                                    required
                                />
                                <button className={classes.btnsearch} type="submit">
                                    <img src={SearchIcon} alt="Search" />
                                </button>

                                {filteredOptions.length > 0 && (
                                    <div className={classes.dropdown}>
                                        {filteredOptions.map((option, index) => (
                                            <div
                                                key={index}
                                                className={classes.dropdownItem}
                                                onClick={() => handleOptionClick(option)}
                                            >
                                                {option.title}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <h2 className={classes.headingtxt}>{PageTitle}</h2>
                            <div className={classes.chartwrap}>
                                <p>{currentExample.description}</p>
                                <div className={classes.chartimgwrap}>
                                    <ExamplesRoot examplePage={currentExample} seeAlso={seeAlso} />
                                    {/* <img src={currentExample.thumbnailImage} /> */}
                                </div>
                                <div className={classes.tabbtnwrap}>
                                    <a
                                        href={`/iframe/${currentExample.path}`}
                                        target="_blank"
                                        className={classes.btnprimary}
                                    >
                                        View Full Screen
                                    </a>
                                    <a
                                        target="_blank"
                                        href={`https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/${currentExample.filepath}/${selectedFile}`}
                                        className={classes.btnsecondary}
                                    >
                                        View Source in Github
                                    </a>
                                </div>
                            </div>
                            <div className={classes.editortabwrap}>
                                <div className={classes.tabwrapper}>
                                    <ul className={`${classes.tabs} ${classes.mobilehidden}`}>
                                        {sourceFiles.map((file) => (
                                            <li
                                                key={file.name}
                                                className={`${classes.tablink} ${
                                                    selectedFile.name === file.name ? classes.active : ""
                                                }`}
                                                onClick={() => handleFileClick(file.name)}
                                            >
                                                {file.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className={classes.contentwrapper}>
                                    <div id="tab-a" className={`${classes.tabcontent} ${classes.active}`}>
                                        <div className={classes.codeeditorwrap}>
                                            <div className={classes.codeedit}>
                                                <SourceCode
                                                    code={selectedFile.content}
                                                    language={selectedFile.name.substring(
                                                        selectedFile.name.indexOf(".") + 1
                                                    )}
                                                    githubUrl={`https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/${currentExample.filepath}/${selectedFile}`}
                                                    onClose={() => console.log("Close clicked")}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* this is not required in this branch ...  */}
                            {/* <div className="showcasewrap">
                                <h2 className={classes.headingtxt}>{seeAlso[0].chartGroupTitle}</h2>
                                <div className={`${classes.showcaserow} ${classes.tabmultiple}`}>
                                    {seeAlso[0].items.map((item, index) => (
                                        <div key={index} className={classes.showcasecol}>
                                            <div className={classes.showcasethumb}>
                                                <img src={item.imgPath} alt="" title="" />
                                            </div>
                                            <h3
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleSubmenuClick(item.examplePath)}
                                            >
                                                {item.title}
                                            </h3>
                                        </div>
                                    ))}
                                </div>
                            </div> */}
                            <DetailsCom currentExample={currentExample} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AppDeatilsRouter;
