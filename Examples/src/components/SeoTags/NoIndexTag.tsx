import * as React from "react";
import { Helmet } from "react-helmet";

const NoIndexTag: React.FC = () => {
    return (
        <Helmet>
            <meta name="robots" content="noindex"/>
        </Helmet>
    );
};

export default NoIndexTag;
