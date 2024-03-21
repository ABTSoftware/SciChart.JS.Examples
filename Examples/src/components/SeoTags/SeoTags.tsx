import { FC, useContext } from "react";
import { Helmet } from "react-helmet";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";

type TProps = {
    title: string;
    keywords: string;
    description: string;
    image: string;
    url: string;
};

const baseUrl = "https://demo.scichart.com";

const SeoTags: FC<TProps> = (props) => {
    const framework = useContext(FrameworkContext);
    const { title, keywords, description, image, url } = props;
    const exampleUrl = `${baseUrl}/${url}`;

    return (
        <Helmet>
            <title>{`${title}`}</title>
            <meta name="keywords" content={keywords + `, ${framework}`} />
            <meta name="description" content={description} />
            <meta property="og:url" content={exampleUrl} />
            <meta property="og:image" content={image} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:image" content={image} />
            <meta name="twitter:image:alt" content={title} />
            <meta name="twitter:domain" content={baseUrl} />
            <meta property="twitter:url" content={exampleUrl} />
            <link rel="canonical" href={`https://www.scichart.com/example/javascript-chart/javscript-${url}/`} />
        </Helmet>
    );
};

export default SeoTags;
