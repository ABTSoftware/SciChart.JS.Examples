import * as React from "react";
import { Helmet } from "react-helmet";

type TProps = {
    title: string;
    keywords: string;
    description: string;
    image: string;
};

const SeoTags: React.FC<TProps> = props => {
    const { title, keywords, description, image } = props;
    return (
        <Helmet>
            <title>
                {`${title}`}
            </title>
            <meta name="keywords" content={keywords} />
            <meta name="description" content={description} />
            <meta name="og:image" content={image} />
            <meta name="og:title" content={title}/>
            <meta name="og:description" content={description} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:image" content={image} />
            <meta name="twitter:image:alt" content={title} />
        </Helmet>
    );
};

export default SeoTags;
