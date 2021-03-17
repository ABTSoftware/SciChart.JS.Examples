import * as React from "react";
import { useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { searchItems, TSearchItem } from "./searchItems";
import classes from './Search.module.scss';

export default function Search() {
    const history = useHistory();

    const handleChange = (_e: any, value: TSearchItem | string) => {
        if (value && value.link) {
            const v = value as TSearchItem;
            history.push(v.link);
        }
    };

    return (
        <div className={classes.Search}>
            <Autocomplete
                id="someElement1"
                freeSolo
                options={searchItems.map(option => option)}
                getOptionLabel={option => option.title}
                onChange={handleChange}
                renderInput={params => (
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
                            )
                        }}
                    />
                )}
            />
        </div>
    );
}
