import * as React from "react";

type TProps = {
    example: () => JSX.Element;
};

const ExamplesRoot: React.FC<TProps> = (props) => {
    const CurrentExample = props.example;
    React.useEffect(() => {
        window.Prism.highlightAll();
    }, []);

    return <CurrentExample />;
};

export default ExamplesRoot;
