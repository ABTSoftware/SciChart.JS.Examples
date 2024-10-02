import { Link } from "react-router-dom";
import {
    EPageFramework,
    FRAMEWORK_NAME,
    useExampleRouteParams,
} from "../../helpers/shared/Helpers/frameworkParametrization";
import classes from "./AppDeatilsRouter.scss";

export const FrameworkSelect = () => {
    const { currentExample, framework: currentFramework } = useExampleRouteParams();
    return (
        <div className={classes.frameworksection}>
            <div className={classes.FrameworkList}>
                {Object.values(EPageFramework).map((framework) => (
                    <Link
                        to={currentExample ? `${framework}/${currentExample.path}` : `/${framework}`}
                        style={{ fontWeight: 500, fontFamily: "Arial", fontSize: "20px", textDecoration: "none" }}
                        className={`${classes.FrameworkListItem} ${
                            currentFramework === framework ? classes.active : ""
                        }`}
                    >
                        {FRAMEWORK_NAME[framework]}
                    </Link>
                ))}
            </div>
        </div>
    );
};
