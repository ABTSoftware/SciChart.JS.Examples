#!/bin/bash

#run script : ./updateExamples.sh

# find ./src/components/Examples -name node_modules -prune -o -name package.json -execdir rm -rf package-lock.json \; -execdir npm install \;
# Specify the pattern for folders
originalModule="index.tsx"
logicModule="drawExample.ts"
# Specify the content for the file to be added
file_content="import * as React from "react";\nimport { appTheme } from "scichart-example-dependencies";\nimport { SciChartReact } from \"scichart-react\";\nimport classes from \"../../../styles/Examples.module.scss\";\nimport { drawExample } from \"./drawExample\";\n\n// React component needed as our examples app is react.\n// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info\nexport default function ChartComponent() {\n    return <SciChartReact initChart={drawExample} className={classes.ChartWrapper} />;\n}"

# Specify the file containing the search text
search_text_file="./search-text.txt"
# replace_text_file="./after.txt"

# Read the search text from the file
# search_text=$(<"$search_text_file")
# Escape special characters in the regex pattern
# escaped_search_text=$(printf "%s" "$search_text" | sed 's/[][\/.^$*+?{}()|]/\\&/g')

# Loop through folders matching the pattern
for folder in $(find ./src/components -type d -exec test -e "{}/$originalModule" \; -print); do
    # echo "Folder found: $folder"
    # Generate a unique filename
    file_to_add="${folder}/drawExample.ts"
    # Check if the file_to_add already exists, if not, rename originalModule
    if [ ! -e "$file_to_add" ]; then
        # echo "Missing: $file_to_add"
        # Rename 
        cd "$folder" || exit
        git mv "$originalModule" "$logicModule"
        cd - || exit
        echo "File renamed in: $folder"

        # Add new originalModule
        new_file_path="${folder}/index.tsx"
        # Check if the file already exists, if not, create it with default Layout code
        if [ ! -e "$new_file_path" ]; then
            echo -e "$file_content" > "$new_file_path"
            echo "File created: $new_file_path"
        else
            echo "Replacement could not be created already exists: $new_file_path"
        fi

        # original_file="${folder}/index.tsx"
        # if [ -f "$original_file" ]; then

        if [ -f "$file_to_add" ]; then
            echo "Looking for mathes in: $file_to_add"
            perl -i -0 -pe '$b = `cat search-text.txt`; $a = ``; s/\Q$b\E/$a/s' "$file_to_add"
            echo "Text replaced in $file_to_add"
        fi

    else
        echo "Logic Module already exists in: $folder"
    fi

done