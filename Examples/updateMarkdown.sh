#!/bin/bash

# This script updates the `exampleInfo.tsx` files with the content of the `markdownContent.md` files.

# Run script: ./updateMarkdown.sh
# or
# Run script: npm run updateMarkdown

set -e
GREEN='\033[0;32m'
RED='\033[0;31m'
RESET="\033[0m"

echo -e "Updating exampleInfo.tsx in:${GREEN}"

# Function to escape special characters and double quotes for JSON stringification
escape_quotes() {
    echo "$1" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | sed 's/\//\\\//g' | tr '\n' ' ' | sed 's/ *$//g'
}

# Loop through directories and find markdownContent.md files
for folder in $(find ./src/components -type f -name "markdownContent.md" -exec dirname {} \;); do
    markdown_file="$folder/markdownContent.md"
    example_info_file="$folder/exampleInfo.tsx"

    # Check if markdownContent.md exists
    if [ -f "$markdown_file" ]; then        
        # Read and escape the markdown file content
        markdown_content=$(cat "$markdown_file")
        markdown_content_escaped=$(escape_quotes "$markdown_content")

        if [ -f "$example_info_file" ]; then
            echo -e "    ${GREEN}$folder${RESET}"

            # Replace the value in "const markdownContent" variable with the new markdown content
            sed -i '' "s|const markdownContent: string =.*|const markdownContent: string = \`$markdown_content_escaped\`;|g" "$example_info_file"
        else
            echo -e "${RED}exampleInfo.tsx not found in: $folder${RESET}"
        fi
    else
        echo -e "${RED}No markdownContent.md found in: $folder${RESET}"
    fi
done