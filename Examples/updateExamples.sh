#!/bin/bash

#run script : ./updateExamples.sh

# The script is supposed to update the examples by splitting drawExample code from React component setup.
# Then use SciChartReact instead of ChartComponent.

# Execution steps:
# - find example folders with index.tsx
# - rename it t

# find ./src/components/Examples -name node_modules -prune -o -name package.json -execdir rm -rf package-lock.json \; -execdir npm install \;
# Specify the pattern for folders
originalModule="index.tsx"
logicModule="drawExample.ts"
# Specify the content for the file to be added
file_content="import * as React from \"react\";\n\nimport { SciChartReact } from \"scichart-react\";\nimport classes from \"../../../styles/Examples.module.scss\";\nimport { drawExample } from \"./drawExample\";\n\n// React component needed as our examples app is react.\n// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info\nexport default function ChartComponent() {\n    return <SciChartReact initChart={drawExample} className={classes.ChartWrapper} />;\n}"

# Specify the file containing the search text
search_text_file="./text-replacement-patterns/search-text.txt"

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
           perl -i -0 -pe '$b = `cat ./text-replacement-patterns/search-text.txt`; $a = ``; s/\Q$b\E/$a/s' "$file_to_add"
        # perl -i -0 -pe '$b = `cat ./text-replacement-patterns/search-text.txt`; $a = ``; $count = s/\Q$b\E/$a/s; if ($count > 0) { print "Replacements were made: $count\n"; }' "$file_to_add"
        # perl -i -0 -pe '$b = `cat ./text-replacement-patterns/search-text.txt`; $a = ``; $count = s/\Q$b\E/$a/s; if ($count > 0) { echo "Replacements were made: $count\n"; } else { echo "No replacements were made.\n"; }' "$file_to_add"
        # perl -i -0 -ne '$b = `cat ./text-replacement-patterns/search-text.txt`; $a = ``; $count = s/\Q$b\E/$a/s; if ($count > 0) { print "Replacements were made: $count\n"; print; } else { print "No replacements were made.\n"; print; }' "$file_to_add"
        # perl -0 -ne '$b = `cat ./text-replacement-patterns/search-text.txt`; $a = ``; $count = s/\Q$b\E/$a/s; 
        # if ($count > 0) { 
        #     print "Replacements were made: $count\n";
        #      } else { 
        #         print "No replacements were made.\n"; 
        # }' "$file_to_add"

                # remove redundant imports which were moved to new module
                perl -i -0 -pe '$b = `cat ./text-replacement-patterns/div-element-id-search-text.txt`; $a = ``; s/\Q$b\E/$a/s' "$file_to_add"
                perl -i -0 -pe '$b = `cat ./text-replacement-patterns/react-import-search-text.txt`; $a = ``; s/\Q$b\E/$a/s' "$file_to_add"
                perl -i -0 -pe '$b = `cat ./text-replacement-patterns/classes-import-search-text.txt`; $a = ``; s/\Q$b\E/$a/s' "$file_to_add"
                perl -i -0 -pe '$b = `cat ./text-replacement-patterns/init-function-search-text.txt`; $a = `cat ./text-replacement-patterns/export-statement-text.txt`; s/\Q$b\E/$a/s' "$file_to_add"
                # echo "Replaced text in: $file_to_add"
                # export drawExample
                # perl -i -0 -pe '$b = `cat ./text-replacement-patterns/init-function-search-text.txt`; $a = `cat ./text-replacement-patterns/export-statement-text.txt`; s/\Q$b\E/$a/s' "$file_to_add"
        # perl -i -0 -pe '$b = `cat ./text-replacement-patterns/init-function-search-text.txt`; $a = `cat ./text-replacement-patterns/export-statement-text.txt`; $count = s/\Q$b\E/$a/s; if ($count > 0) { print "Replacements were made: $count\n"; }' "$file_to_add"
                
                # remove redundant imports which were moved to new module
                # perl -i -0 -pe '$b = `cat ./text-replacement-patterns/div-element-id-search-text.txt`; $a = ``; s/\Q$b\E/$a/s' "$file_to_add"
                # perl -i -0 -pe '$b = `cat ./text-replacement-patterns/react-import-search-text.txt`; $a = ``; s/\Q$b\E/$a/s' "$file_to_add"
                # perl -i -0 -pe '$b = `cat ./text-replacement-patterns/classes-import-search-text.txt`; $a = ``; s/\Q$b\E/$a/s' "$file_to_add"
            # else
                # echo "Text to replace not found in: $file_to_add"
            # fi
         
        fi

    else
        echo "Logic Module already exists in: $folder"
    fi

done