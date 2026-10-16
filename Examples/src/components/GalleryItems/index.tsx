import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { GalleryItem } from "../../helpers/types/types";
import { _useContext } from "../../helpers/shared/Helpers/Context";

type TProps = {
    examples: GalleryItem[];
    setMostVisibleCategory?: React.Dispatch<React.SetStateAction<string | null>>;
    /**
     * Whether the title can be an H1 or not.
     * (we try and avoid multiple h1's per page, **seeAlso** title cannot be an H1 since the page already has one)
     *
     * Default `true`
     */
    needsH1?: boolean;
};

const GridSelection = ({
    isCompact,
    setIsCompact,
}: {
    isCompact: boolean;
    setIsCompact: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
    <div className="sc-button-group sc-gallery-view-options" role="group" aria-label="Gallery view">
        <button
            type="button"
            className="sc-button sc-button-icon"
            aria-label="Large thumbnails"
            title="Large thumbnails"
            aria-pressed={!isCompact}
            onClick={() => setIsCompact(false)}
        >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
        </button>
        <button
            type="button"
            className="sc-button sc-button-icon"
            aria-label="Small thumbnails"
            title="Small thumbnails"
            aria-pressed={isCompact}
            onClick={() => setIsCompact(true)}
        >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <rect x="3" y="3" width="4" height="4" rx="1" />
                <rect x="10" y="3" width="4" height="4" rx="1" />
                <rect x="17" y="3" width="4" height="4" rx="1" />
                <rect x="3" y="10" width="4" height="4" rx="1" />
                <rect x="10" y="10" width="4" height="4" rx="1" />
                <rect x="17" y="10" width="4" height="4" rx="1" />
                <rect x="3" y="17" width="4" height="4" rx="1" />
                <rect x="10" y="17" width="4" height="4" rx="1" />
                <rect x="17" y="17" width="4" height="4" rx="1" />
            </svg>
        </button>
    </div>
);

interface ExampleProps {
    example: GalleryItem;
    index: number;
    isCompact: boolean;
    setIsCompact: React.Dispatch<React.SetStateAction<boolean>>;
    needsH1?: boolean;
}

const Example = React.forwardRef<HTMLHeadingElement, ExampleProps>(
    ({ example, index, isCompact, setIsCompact, needsH1 }, ref) => {
        const { state } = _useContext();
        const framework = state.framework;
        const frameworkLabel = { javascript: "JavaScript", react: "React", angular: "Angular" }[framework];
        const Heading = needsH1 ? "h1" : "h2";

        return (
            <div>
                {index === 0 && (
                    <div className="sc-gallery-heading">
                        <Heading>{frameworkLabel} chart examples & demos</Heading>
                        <GridSelection isCompact={isCompact} setIsCompact={setIsCompact} />
                    </div>
                )}

                <div className="sc-gallery-heading">
                    <h3
                        ref={ref}
                        id={example.id}
                        style={{
                            scrollMarginTop: 112, // just under the navbar
                        }}
                    >
                        {`${example.chartGroupTitle} (${"items" in example ? example.items.length : 0} demo${
                            "items" in example && example.items.length !== 1 ? "s" : ""
                        })`}
                    </h3>
                </div>

                {"items" in example && example.items.length > 0 ? (
                    <section
                        className={`sc-gallery-grid ${isCompact ? "sc-gallery-dense-grid" : "sc-gallery-medium-grid"}`}
                    >
                        {example.items.map((item, index) => (
                            <Link
                                to={`/${framework}/${item.examplePath}`}
                                title={item.seoTitle}
                                className="sc-gallery-card"
                                key={index}
                            >
                                <div className="sc-gallery-image">
                                    {item?.isNew && (
                                        <div className="sc-gallery-new">
                                            <span>New</span>
                                        </div>
                                    )}
                                    <img src={item.imgPath} alt={item.seoTitle} title={item.title} />
                                </div>
                                <div className="sc-gallery-card-content">
                                    <h3>{item.title}</h3>
                                </div>
                            </Link>
                        ))}
                    </section>
                ) : (
                    <p>No items available</p>
                )}
            </div>
        );
    }
);

const GalleryItems: React.FC<TProps> = ({ examples, setMostVisibleCategory, needsH1 = true }) => {
    const [isCompact, setIsCompact] = useState(true);
    const headingRefs = useRef<(HTMLHeadingElement | null)[]>([]);
    const currentActive = useRef<string | null>(null);
    const scrollTimeout = useRef<number | null>(null);

    useEffect(() => {
        const calculateClosest = () => {
            const referenceLine = window.innerHeight / 3; // 1/3 of height from the top
            let closestId: string | null = null;
            let minDistance = Infinity;

            headingRefs.current.forEach((ref) => {
                if (!ref || !ref.id) return;

                const rect = ref.getBoundingClientRect();
                if (rect.height === 0) return; // Skip invisible elements

                // Calculate distance from element top to reference line
                const distance = Math.abs(rect.top - referenceLine);

                // Prioritize elements that are either:
                // 1. Closer to the reference line, or
                // 2. Same distance but above the line when scrolling up
                if (distance < minDistance || (distance === minDistance && rect.top < referenceLine)) {
                    minDistance = distance;
                    closestId = ref.id;
                }
            });

            return closestId;
        };

        const handleScroll = () => {
            // Cancel pending updates
            if (scrollTimeout.current) {
                cancelAnimationFrame(scrollTimeout.current);
            }

            // Schedule new update with RAF-based debounce
            scrollTimeout.current = requestAnimationFrame(() => {
                const closestId = calculateClosest();
                if (closestId && closestId !== currentActive.current) {
                    currentActive.current = closestId;
                    setMostVisibleCategory?.(closestId);
                }
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (scrollTimeout.current) {
                cancelAnimationFrame(scrollTimeout.current);
            }
        };
    }, [examples, setMostVisibleCategory]);

    return (
        <div className="sc-gallery">
            {examples.map((ex, index) => (
                <Example
                    key={ex.id}
                    ref={(el) => {
                        headingRefs.current[index] = el;
                    }}
                    example={ex}
                    index={index}
                    isCompact={isCompact}
                    setIsCompact={setIsCompact}
                    needsH1={needsH1}
                />
            ))}
        </div>
    );
};

export default GalleryItems;
