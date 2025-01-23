import { useContext, useMemo } from "react";
import { useNavigate } from "react-router";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { generateSearchItems, TSearchItem } from "./searchItems";
import classes from "./Search.module.scss";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";
import { ALL_MENU_ITEMS } from "../AppRouter/examples";

export default function Search() {
    const navigate = useNavigate();
    const framework = useContext(FrameworkContext);
    const searchItems: TSearchItem[] = useMemo(() => generateSearchItems(ALL_MENU_ITEMS, framework), [framework]);

    const handleChange = (_e: any, value: TSearchItem | string) => {
        if (value && typeof value === "object" && "link" in value) {
            const v = value as TSearchItem;
            navigate(v.link);
        }
    };

    return (
        <div className={classes.Search}>
            <Autocomplete
                id="someElement1"
                freeSolo
                options={searchItems}
                componentsProps={{
                    paper: {
                        sx: {
                            backgroundColor: "var(--bg)",
                            color: "var(--text)",
                            border: "1px solid var(--border-color)",
                        },
                    },
                }}
                getOptionLabel={(option) => {
                    // Check if option is TSearchItem and return title
                    if (typeof option === "object" && "title" in option) {
                        return option.title;
                    }
                    return option; // In case option is a string, return it directly
                }}
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
                                <InputAdornment position="start" style={{ marginLeft: 8 }}>
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "4px",
                                height: "44px",
                            },
                            "& fieldset": {
                                border: "none",
                            },
                        }}
                    />
                )}
            />
        </div>
    );
}
