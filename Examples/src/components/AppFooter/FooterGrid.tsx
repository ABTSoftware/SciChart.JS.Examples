import * as React from "react";
import List from "@material-ui/core/List";
import { TMenuItem } from "../AppRouter/examples";
import { Box, Grid } from "@material-ui/core";
import classes from "./FooterGrid.module.scss";

// import Box from "../shared/Helpers/Box/Box";

type TProps = {
    historyPushPath: (path: string) => void;
    title: string;
    menuItems: TMenuItem[];
    menuItemsId: string;
};

const FooterGrid: React.FC<TProps> = props => {
    const { historyPushPath, title, menuItems } = props;

    return (
        <Box mb={24}>
            <Box mb={16}>
                <h5>{title}</h5>
                <div className={classes.divider}>
                    <div className={classes.dividerBox}></div>
                </div>
            </Box>

            <Grid container direction="row" alignItems="flex-start">
                {menuItems.map(el => (
                    <div className={classes.listItems} key={el.item.id}>
                        <div>
                            <div className={classes.listItemText}>
                                <h6>{el.item.name}</h6>
                            </div>

                            <Box mb={8}>
                                <List component="div" disablePadding>
                                    {el.submenu.map(subEl => (
                                        <p className={classes.listItemText2} key={subEl.id}>
                                            <a href={subEl.path} title={subEl.title}>
                                                {subEl.title}
                                            </a>
                                        </p>
                                    ))}
                                </List>
                            </Box>
                        </div>
                    </div>
                ))}
            </Grid>
        </Box>
    );
};

export default FooterGrid;
