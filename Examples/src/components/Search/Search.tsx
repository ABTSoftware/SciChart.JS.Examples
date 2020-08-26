import * as React from "react";
import { useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { searchItems, TSearchItem } from "./searchItems";

export default function Search() {
    const history = useHistory();

    const handleChange = (_e: any, value: TSearchItem | string) => {
        if (value && value.link) {
            const v = value as TSearchItem;
            history.push(v.link);
        }
    };

    return (
        <div style={{ width: "100%", marginBottom: 10 }}>
            <Autocomplete
                id="someElement1"
                freeSolo
                options={searchItems.map((option) => option)}
                getOptionLabel={(option) => option.title}
                onChange={handleChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search"
                        margin="normal"
                        variant="outlined"
                        placeholder="Search for example names, chart types, source-code types or classes"
                        InputProps={{
                            ...params.InputProps,
                            autoComplete: "new-password",
                            type: "search",
                            startAdornment: (
                                <InputAdornment position="start">
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
