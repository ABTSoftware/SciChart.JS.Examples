import { FC, Fragment, useContext } from "react";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import { TMenuItem } from "../AppRouter/examples";
import { useMatch } from "react-router-dom";
import MenuListItemText from "../../helpers/shared/MenuListItemText/MenuListItemText";
import classes from "./ListItemsBlock.module.scss";
import ListItemCollapseArrowIcon from "./ListItemCollapseArrowIcon";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";
import { getTitle, useExampleRouteParams } from "../../helpers/shared/Helpers/frameworkParametrization";

type TProps = {
    onExpandClick: (id: string) => void;
    checkIsOpened: (id: string) => boolean;
    historyPushPath: (path: string) => void;
    title: string;
    menuItems: TMenuItem[];
    menuItemsId: string;
};

const ListItemsBlock: FC<TProps> = (props) => {
    const framework = useContext(FrameworkContext);
    const match = useExampleRouteParams();
    const selectedFramework = useContext(FrameworkContext);
    const { onExpandClick, checkIsOpened, historyPushPath, title, menuItems, menuItemsId } = props;

    return (
        <div className={classes.ListItemBlock}>
            <div onClick={() => onExpandClick(menuItemsId)} className={classes.CollapsibleMenuListItem}>
                <MenuListItemText text={title} className={classes.MenuListItemText} />
                <ListItemCollapseArrowIcon
                    className={classes.CollapseArrowButton}
                    isCollapseOpened={checkIsOpened(menuItemsId)}
                />
            </div>
            <Collapse in={checkIsOpened(menuItemsId)} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {menuItems.map((el) => (
                        <Fragment key={el.id}>
                            <div className={classes.CollapsibleMenuListItem} onClick={() => onExpandClick(el.id)}>
                                <MenuListItemText text={el.title} className={classes.SecondLevelMenuListItemText} />
                                <ListItemCollapseArrowIcon
                                    className={classes.CollapseArrowButton}
                                    isCollapseOpened={checkIsOpened(el.id)}
                                />
                                {/*{isOpened[el.item.id] ? <ExpandLess /> : <ExpandMore />}*/}
                            </div>
                            <Collapse in={checkIsOpened(el.id)} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {el.submenu.map((subEl) => (
                                        <div
                                            key={subEl.id}
                                            className={
                                                match?.currentExample?.path === subEl.path
                                                    ? classes.SelectedBottomLevelListItem
                                                    : classes.BottomLevelListItem
                                            }
                                            onClick={() => historyPushPath(`${selectedFramework}/${subEl.path}`)}
                                        >
                                            <a
                                                className={classes.ExampleLink}
                                                href={`${selectedFramework}/${subEl.path}`}
                                                title={getTitle(subEl.title, selectedFramework)}
                                            >
                                                {getTitle(subEl.title, selectedFramework)}
                                            </a>
                                            {/*<ListItemText*/}
                                            {/*    className={classes.listItemText2}*/}
                                            {/*    primary={subEl.title}*/}
                                            {/*    primaryTypographyProps={{ variant: "body2" }}*/}
                                            {/*/>*/}
                                        </div>
                                    ))}
                                </List>
                            </Collapse>
                        </Fragment>
                    ))}
                </List>
            </Collapse>
        </div>
    );
};

export default ListItemsBlock;
