import { FC, useContext } from "react";
import { Helmet } from "react-helmet";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";

type TProps = {
    title: string;
    keywords: string;
    description: string;
    image: string;
    url: string;
    framework: string;
};

const baseUrl = "https://www.scichart.com/demo";

const SeoTags: FC<TProps> = (props) => {
    const framework = useContext(FrameworkContext);
    const { title, keywords, description, image, url } = props;

    const exampleUrl = `${baseUrl}/${framework}/${url}`.replace(/\/$/, '');
    return (
        <Helmet>
            <title>{title}</title>
            <link rel="canonical" href={exampleUrl} />
            <meta name="keywords" content={keywords + `, ${framework}`} />
            <meta name="description" content={description} />
            <meta property="og:url" content={exampleUrl} />
            <meta property="og:image" content={'/demo/' + image} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:image" content={'/demo/' + image} />
            <meta name="twitter:image:alt" content={title} />
            <meta name="twitter:domain" content={baseUrl} />
            <meta property="twitter:url" content={exampleUrl} />
        </Helmet>
    );
};

export default SeoTags;