#!/bin/bash

# Run script: ./updateMarkdown.sh

# This script will find the markdownContent.md files, and if they exist,
# it will inject their stringified content into the "markdownContent" property
# within the export object of the exampleInfo.tsx file at the same level.

# Function to escape double quotes for JSON stringification
escape_quotes() {
    echo "$1" | sed 's/"/\\"/g'
}

# Loop through directories and find markdownContent.md files
for folder in $(find ./src/components -type f -name "markdownContent.md" -exec dirname {} \;); do
    markdown_file="$folder/markdownContent.md"
    example_info_file="$folder/exampleInfo.tsx"

    # Check if markdownContent.md exists
    if [ -f "$markdown_file" ]; then
        echo "Found markdownContent.md in: $folder"
        
        # Read and escape the markdown file content
        markdown_content=$(cat "$markdown_file")
        markdown_content_escaped=$(escape_quotes "$markdown_content")

        # Check if exampleInfo.tsx exists
        if [ -f "$example_info_file" ]; then
            echo "Updating exampleInfo.tsx in: $folder"

            # Insert or update the markdownContent property in the export object
            perl -i -0pe "
            s/(export default \{[^}]*?)(markdownContent:\s*\"[^\"]*\"|)([^}]*?\})/\1markdownContent: \"$markdown_content_escaped\",\3/s" "$example_info_file"
        
        else
            echo "exampleInfo.tsx not found in: $folder"
        fi
    else
        echo "No markdownContent.md found in: $folder"
    fi
done
