import * as React from "react";
import List from "@material-ui/core/List";
import { TMenuItem } from "../AppRouter/examples";
import { Grid } from "@material-ui/core";
import Box from "../../helpers/shared/Helpers/Box/Box";
import classes from "./FooterGrid.module.scss";

type TProps = {
    historyPushPath: (path: string) => void;
    title: string;
    menuItems: TMenuItem[];
    menuItemsId: string;
};

const FooterGrid: React.FC<TProps> = props => {
    const { title, menuItems } = props;

    return (
        <Box mb={24} className={classes.FooterGrid}>
            <Box mb={16} className={classes.TitleBox}>
                <h5>{title}</h5>
                <div className={classes.divider}>
                    <div className={classes.dividerBox}></div>
                </div>
            </Box>

            <Grid container className={classes.GridListContainer} direction="row" alignItems="flex-start">
                {menuItems.map(el => (
                    <div className={classes.FooterGridList} key={el.item.id}>
                        <h6>{el.item.name}</h6>

                        <Box mb={8}>
                            <List component="div" disablePadding>
                                {el.submenu.map(subEl => (
                                    <a href={subEl.path} title={subEl.title} key={subEl.id}>
                                        {subEl.title}
                                    </a>
                                ))}
                            </List>
                        </Box>
                    </div>
                ))}
            </Grid>
        </Box>
    );
};

export default FooterGrid;
