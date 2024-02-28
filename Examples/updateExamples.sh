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
file_content="import { drawExample } from \"./drawExample\";\n\n/**\n * Creates charts on the provided root elements\n * @returns cleanup function\n */\nconst create = async () => {\n    const { sciChartSurface } = await drawExample(\"chart\");\n\n    const destructor = () => {\n        sciChartSurface.delete();\n    };\n\n    return destructor;\n};\n\ncreate();\n\n// call the \`destructor\` returned by the \`create\` promise to dispose the charts when necessary\n"

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
    file_to_add="${folder}/vanilla.ts"
    # Check if the file_to_add already exists, if not, rename originalModule
    if [ ! -e "$file_to_add" ]; then
        # echo "Missing: $file_to_add"
        echo -e "$file_content" > "$file_to_add"
        echo "File created: $file_to_add"
    else
        echo "Logic Module already exists in: $folder"
    fi

done