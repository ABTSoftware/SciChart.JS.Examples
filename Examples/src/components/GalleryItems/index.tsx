import React, { useState, useEffect, useContext, Dispatch, SetStateAction } from "react";
import classes from "./index.scss";
import { Link, useNavigate } from "react-router-dom";
import { GalleryItem } from "../../helpers/types/types";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";

type TProps = {
    examples: GalleryItem[];
    setMostVisibleCategory?: React.Dispatch<React.SetStateAction<string | null>>;
};

enum EGridType {
    Cardview,
    Grid2or3,
    Grid5or6,
}

const GridSelection: React.FC<{ 
    gridType: EGridType, 
    setGridType: Dispatch<React.SetStateAction<EGridType>> 
}> = ({ gridType, setGridType }) => {
    return (
        <ul className={classes.gridSelection}>
            <li onClick={() => setGridType(EGridType.Cardview)} className={gridType === EGridType.Cardview ? classes.activeGrid : ''}>
                <svg width="34" height="30" viewBox="0 0 34 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.80208 6.66667C5.64303 6.66667 7.13542 5.17428 7.13542 3.33333C7.13542 1.49238 5.64303 0 3.80208 0C1.96113 0 0.46875 1.49238 0.46875 3.33333C0.46875 5.17428 1.96113 6.66667 3.80208 6.66667Z"/>
                    <path d="M13.8021 6.66667H30.4688C32.3021 6.66667 33.8021 5.16667 33.8021 3.33333C33.8021 1.5 32.3021 0 30.4688 0H13.8021C11.9687 0 10.4688 1.5 10.4688 3.33333C10.4688 5.16667 11.9687 6.66667 13.8021 6.66667Z"/>
                    <path d="M3.80208 18.3337C5.64303 18.3337 7.13542 16.8413 7.13542 15.0003C7.13542 13.1594 5.64303 11.667 3.80208 11.667C1.96113 11.667 0.46875 13.1594 0.46875 15.0003C0.46875 16.8413 1.96113 18.3337 3.80208 18.3337Z"/>
                    <path d="M30.4688 11.667H13.8021C11.9687 11.667 10.4688 13.167 10.4688 15.0003C10.4688 16.8337 11.9687 18.3337 13.8021 18.3337H30.4688C32.3021 18.3337 33.8021 16.8337 33.8021 15.0003C33.8021 13.167 32.3021 11.667 30.4688 11.667Z"/>
                    <path d="M3.80208 30.0002C5.64303 30.0002 7.13542 28.5078 7.13542 26.6668C7.13542 24.8259 5.64303 23.3335 3.80208 23.3335C1.96113 23.3335 0.46875 24.8259 0.46875 26.6668C0.46875 28.5078 1.96113 30.0002 3.80208 30.0002Z"/>
                    <path d="M30.4688 23.3335H13.8021C11.9687 23.3335 10.4688 24.8335 10.4688 26.6668C10.4688 28.5002 11.9687 30.0002 13.8021 30.0002H30.4688C32.3021 30.0002 33.8021 28.5002 33.8021 26.6668C33.8021 24.8335 32.3021 23.3335 30.4688 23.3335Z"/>
                </svg>
            </li>

            <li onClick={() => setGridType(EGridType.Grid2or3)} className={gridType === EGridType.Grid2or3 ? classes.activeGrid : ''}>
                <svg width="32" height="30" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.06624 0H10.6313C12.3479 0 13.7522 1.39307 13.7522 3.09596V9.60851C13.7522 11.3114 12.3479 12.7045 10.6313 12.7045H4.06624C2.34962 12.7045 0.945312 11.3114 0.945312 9.60851V3.09596C0.945312 1.39307 
                    2.34962 0 4.06624 0ZM22.0752 17.2952H28.6403C30.3569 17.2952 31.7612 18.6882 31.7612 20.3911V26.9037C31.7612 28.6066 30.3569 30 28.6403 30H22.0752C20.3586 30 18.9539 28.6066 18.9539 26.9037V20.3911C18.9539 18.6882 20.3586 17.2952 22.0752 17.2952ZM4.06624 
                    17.2952H10.6313C12.3479 17.2952 13.7522 18.6882 13.7522 20.3911V26.9037C13.7522 28.6066 12.3479 30 10.6313 30H4.06624C2.34962 30 0.945312 28.6066 0.945312 26.9037V20.3911C0.945312 18.6882 2.34962 17.2952 4.06624 17.2952ZM22.0752 0H28.6403C30.3569 0 31.7612 
                    1.39307 31.7612 3.09596V9.60851C31.7612 11.3114 30.3569 12.7045 28.6403 12.7045H22.0752C20.3586 12.7045 18.9539 11.3114 18.9539 9.60851V3.09596C18.9539 1.39307 20.3586 0 22.0752 0Z"/>
                </svg>
            </li>

            <li onClick={() => setGridType(EGridType.Grid5or6)} className={gridType === EGridType.Grid5or6 ? classes.activeGrid : ''}>
                <svg width="32" height="30" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M2.36392 0H5.34804C6.12832 0 6.76664 0.633214 6.76664 1.40726V4.3675C6.76664 5.14154 6.12832 5.77476 5.34804 5.77476H2.36392C1.58363 5.77476 0.945312 5.14154 0.945312 4.3675V1.40726C0.945312 0.633214 1.58363 0 2.36392 0ZM10.5498 7.86144H13.5339C14.3142 7.86144 14.9525 8.49465 14.9525 9.26869V12.2289C14.9525 13.003 14.3142 13.6364 13.5339 13.6364H10.5498C9.76953 13.6364 9.13104 13.003 9.13104 12.2289V9.26869C9.13104 8.49465 9.76953 7.86144 10.5498 7.86144ZM2.36392 7.86144H5.34804C6.12832 7.86144 6.76664 8.49465 6.76664 9.26869V12.2289C6.76664 13.003 6.12832 13.6364 5.34804 13.6364H2.36392C1.58363 13.6364 0.945312 13.003 0.945312 12.2289V9.26869C0.945312 8.49465 1.58363 7.86144 2.36392 7.86144ZM10.5498 0H13.5339C14.3142 0 14.9525 0.633214 14.9525 1.40726V4.3675C14.9525 5.14154 14.3142 5.77476 13.5339 5.77476H10.5498C9.76953 5.77476 9.13104 5.14154 9.13104 4.3675V1.40726C9.13104 0.633214 9.76953 0 10.5498 0Z"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M18.778 16.3633H21.7621C22.5424 16.3633 23.1807 16.9965 23.1807 17.7705V20.7308C23.1807 21.5048 22.5424 22.138 21.7621 22.138H18.778C17.9977 22.138 17.3594 21.5048 17.3594 20.7308V17.7705C17.3594 16.9965 17.9977 16.3633 18.778 16.3633ZM26.9639 24.2247H29.948C30.7283 24.2247 31.3666 24.8579 31.3666 25.632V28.5922C31.3666 29.3663 30.7283 29.9996 29.948 29.9996H26.9639C26.1836 29.9996 25.5451 29.3663 25.5451 28.5922V25.632C25.5451 24.8579 26.1836 24.2247 26.9639 24.2247ZM18.778 24.2247H21.7621C22.5424 24.2247 23.1807 24.8579 23.1807 25.632V28.5922C23.1807 29.3663 22.5424 29.9996 21.7621 29.9996H18.778C17.9977 29.9996 17.3594 29.3663 17.3594 28.5922V25.632C17.3594 24.8579 17.9977 24.2247 18.778 24.2247ZM26.9639 16.3633H29.948C30.7283 16.3633 31.3666 16.9965 31.3666 17.7705V20.7308C31.3666 21.5048 30.7283 22.138 29.948 22.138H26.9639C26.1836 22.138 25.5451 21.5048 25.5451 20.7308V17.7705C25.5451 16.9965 26.1836 16.3633 26.9639 16.3633Z"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M18.778 0H21.7621C22.5424 0 23.1807 0.633214 23.1807 1.40726V4.3675C23.1807 5.14154 22.5424 5.77476 21.7621 5.77476H18.778C17.9977 5.77476 17.3594 5.14154 17.3594 4.3675V1.40726C17.3594 0.633214 17.9977 0 18.778 0ZM26.9639 7.86144H29.948C30.7283 7.86144 31.3666 8.49465 31.3666 9.26869V12.2289C31.3666 13.003 30.7283 13.6364 29.948 13.6364H26.9639C26.1836 13.6364 25.5451 13.003 25.5451 12.2289V9.26869C25.5451 8.49465 26.1836 7.86144 26.9639 7.86144ZM18.778 7.86144H21.7621C22.5424 7.86144 23.1807 8.49465 23.1807 9.26869V12.2289C23.1807 13.003 22.5424 13.6364 21.7621 13.6364H18.778C17.9977 13.6364 17.3594 13.003 17.3594 12.2289V9.26869C17.3594 8.49465 17.9977 7.86144 18.778 7.86144ZM26.9639 0H29.948C30.7283 0 31.3666 0.633214 31.3666 1.40726V4.3675C31.3666 5.14154 30.7283 5.77476 29.948 5.77476H26.9639C26.1836 5.77476 25.5451 5.14154 25.5451 4.3675V1.40726C25.5451 0.633214 26.1836 0 26.9639 0Z"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M2.41079 16.3633H5.39491C6.1752 16.3633 6.81352 16.9965 6.81352 17.7705V20.7308C6.81352 21.5048 6.1752 22.138 5.39491 22.138H2.41079C1.63051 22.138 0.992188 21.5048 0.992188 20.7308V17.7705C0.992188 16.9965 1.63051 16.3633 2.41079 16.3633ZM10.5967 24.2247H13.5808C14.3611 24.2247 14.9994 24.8579 14.9994 25.632V28.5922C14.9994 29.3663 14.3611 29.9996 13.5808 29.9996H10.5967C9.81641 29.9996 9.17791 29.3663 9.17791 28.5922V25.632C9.17791 24.8579 9.81641 24.2247 10.5967 24.2247ZM2.41079 24.2247H5.39491C6.1752 24.2247 6.81352 24.8579 6.81352 25.632V28.5922C6.81352 29.3663 6.1752 29.9996 5.39491 29.9996H2.41079C1.63051 29.9996 0.992188 29.3663 0.992188 28.5922V25.632C0.992188 24.8579 1.63051 24.2247 2.41079 24.2247ZM10.5967 16.3633H13.5808C14.3611 16.3633 14.9994 16.9965 14.9994 17.7705V20.7308C14.9994 21.5048 14.3611 22.138 13.5808 22.138H10.5967C9.81641 22.138 9.17791 21.5048 9.17791 20.7308V17.7705C9.17791 16.9965 9.81641 16.3633 10.5967 16.3633Z"/>
                </svg>
            </li>
        </ul>
    );
};

const Example: React.FC<{
    example: GalleryItem, 
    index: number,
    setMostVisibleCategory: Dispatch<SetStateAction<string>>,
    gridType: EGridType,
    setGridType: Dispatch<SetStateAction<EGridType>>
}> = ({ example, index, setMostVisibleCategory, gridType, setGridType }) => {
    const navigate = useNavigate();
    const framework = useContext(FrameworkContext);

    const handleSubmenuClick = (path: string) => {
        navigate(`/${framework}/${path}`);
    };

    const sectionRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!setMostVisibleCategory || !sectionRef.current) return () => {};
    
        const observer = new IntersectionObserver((entries) => {
                // Track the visible area for all observed elements
                const visibilityMap = new Map<string, number>();

                entries.forEach((entry) => {
                    // Calculate the visible area in square pixels
                    const visibleArea = entry.intersectionRect.width * entry.intersectionRect.height;

                    const category = example.chartGroupTitle;
                    if (category) {
                        visibilityMap.set(category, visibleArea);
                    }
                });

                // Find the component with the maximum visible area
                let mostVisible = null;
                let maxVisibleArea = 0;

                visibilityMap.forEach((visibleArea, category) => {
                    if (visibleArea > maxVisibleArea) {
                        mostVisible = category;
                        maxVisibleArea = visibleArea;
                    }
                });

                    // Update the state only if the most visible changes
                if (mostVisible) {
                    setMostVisibleCategory(mostVisible);
                }
            },
            {
                root: null, // Observe relative to the viewport
                threshold: [0], // Trigger callback on any visibility change
            }
        );
    
        observer.observe(sectionRef.current);
    
        return () => {
            observer.disconnect();
        };
    }, [setMostVisibleCategory]);    

    return (
        <div 
            key={example.id}
            ref={sectionRef}
        >
            <div className={classes.showcaseheadingwrap}>
                {/* group title */}
                <h2 id={example.id}>
                    {`${example.chartGroupTitle} (${"items" in example ? example.items.length : 0} Demo${
                        "items" in example && example.items.length !== 1 ? "s" : ""
                    })`}
                </h2>
                {index === 0 && <GridSelection gridType={gridType} setGridType={setGridType} />}
            </div>

            {"items" in example && example.items.length > 0 ? 
            <section className={`
                ${classes.gridWrap}
                ${gridType === EGridType.Cardview ? classes.cardView
                    : gridType === EGridType.Grid2or3 ? classes.gridView2or3 
                    : classes.gridView5or6}
            `}>
                {example.items.map((item, index) => (
                    <div key={index} className={classes.card}>
                        <div className={classes.imgWrapper}>
                            <img
                                onClick={() => handleSubmenuClick(item.examplePath)}
                                src={item.imgPath}
                                alt={item.seoTitle}
                                title={item.title}
                            />
                        </div>
                        <div className={classes.content}>
                            <h3>{item.title}</h3>
                            <p>{item.description || "No description available for this example yet"}</p>
                            {/* <div className={classes.tabbtnwrap}>
                                <Link
                                    to={`/${framework}/${item.examplePath}`}
                                    className={classes.btnprimary}
                                >
                                    View Full Screen
                                </Link>
                            </div> */}
                        </div>
                    </div>
                ))}
            </section> 
            : <p>No items available</p>}
        </div>
    );
}

const GalleryItems: React.FC<TProps> = ({ examples, setMostVisibleCategory }) => {
    const [gridType, setGridType] = useState<EGridType>(EGridType.Grid2or3);

    return (
        <div className={classes.showcaseWrap}>
            {examples.map((group, index) => (
                <Example 
                    key={index} 
                    example={group}
                    index={index}
                    setMostVisibleCategory={setMostVisibleCategory}
                    gridType={gridType}
                    setGridType={setGridType}
                />
            ))}
        </div>
    );
};

export default GalleryItems;
