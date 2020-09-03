import * as React from "react";
import ListItemText from "@material-ui/core/ListItemText";

type TProps = {
    text: string;
};

const MenuListItemText: React.FC<TProps> = (props) => {
    const { text } = props;
    return (
        <ListItemText primaryTypographyProps={{ variant: "body2" }}>
            <span style={{ fontWeight: 600 }}>{text}</span>
        </ListItemText>
    );
};

export default MenuListItemText;
