import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { generateSearchItems, TSearchItem } from "./searchItems";
import classes from "./Search.module.scss";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";
import { ALL_MENU_ITEMS } from "../AppRouter/examples";

export default function Search() {
    const navigate = useNavigate();
    const framework = useContext(FrameworkContext);
    const searchItems: TSearchItem[] = useMemo(() => generateSearchItems(ALL_MENU_ITEMS, framework), [framework]);

    const handleChange = (_e: any, value: TSearchItem | string) => {
        if (value && value.link) {
            const v = value as TSearchItem;
            navigate(v.link);
        }
    };

    return (
        <div className={classes.Search}>
            <Autocomplete
                id="someElement1"
                freeSolo
                options={searchItems.map((option) => option)}
                getOptionLabel={(option) => option.title}
                onChange={handleChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        size="small"
                        margin="none"
                        variant="outlined"
                        placeholder="Search for example names and chart types"
                        className={classes.SearchField}
                        InputProps={{
                            ...params.InputProps,
                            autoComplete: "new-password",
                            type: "text",
                            startAdornment: (
                                <InputAdornment position="start" style={{ marginLeft: 10 }}>
                                    &nbsp;
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                )}
            />
        </div>
    );
}
