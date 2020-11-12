import * as React from "react";
import { Helmet } from "react-helmet";

type TProps = {
    title: string;
    keywords: string;
    description: string;
};

// const PERMANENT_TITLE = "| Fast, High Performance JavaScript Chart Examples - SciChart.js";

const SeoTags: React.FC<TProps> = props => {
    const { title, keywords, description } = props;
    return (
        <Helmet>
            <title>
                {`${title}`}
            </title>
            <meta name="keywords" content={keywords} />
            <meta name="description" content={description} />
        </Helmet>
    );
};

export default SeoTags;
