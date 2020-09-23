import * as React from "react";
import { useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { searchItems, TSearchItem } from "./searchItems";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            width: "80ch"
        }
    },
    mySearchField: {
        "& .MuiInputBase-root": {
            backgroundColor: "#67bb6a",
            "&:hover": {
                backgroundColor: "#79c37c"
            }
        },
        "& .MuiOutlinedInput-notchedOutline": {
            border: 0
        }
    }
}));

export default function Search() {
    const classes = useStyles();
    const history = useHistory();

    const handleChange = (_e: any, value: TSearchItem | string) => {
        if (value && value.link) {
            const v = value as TSearchItem;
            history.push(v.link);
        }
    };

    return (
        <div className={classes.root}>
            <Autocomplete
                id="someElement1"
                freeSolo
                options={searchItems.map(option => option)}
                getOptionLabel={option => option.title}
                onChange={handleChange}
                renderInput={params => (
                    <TextField
                        {...params}
                        margin="normal"
                        variant="outlined"
                        placeholder="Search for example names, chart types, source-code types or classes"
                        className={classes.mySearchField}
                        InputProps={{
                            ...params.InputProps,
                            autoComplete: "new-password",
                            type: "text",
                            style: { padding: 0 },
                            startAdornment: (
                                <InputAdornment position="start" style={{ marginLeft: 10 }}>
                                    &nbsp;
                                    <SearchIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                )}
            />
        </div>
    );
}
