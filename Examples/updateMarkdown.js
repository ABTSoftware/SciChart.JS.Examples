const fs = require('fs');
const path = require('path');

// Set the root directory for the search
const rootDir = 'src/components';

// ANSI color codes
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

// Function to escape special characters
function escapeQuotes(content) {
    return content
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\//g, '\\/');
}

// Loop through directories and find markdownContent.md files
function processDirectory(directory) {
    fs.readdirSync(directory).forEach(file => {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            processDirectory(filePath); // Recursively process subdirectories
        } else if (file === 'markdownContent.md') {
            const markdownFile = filePath;
            const exampleInfoFile = path.join(directory, 'exampleInfo.tsx');

            // Read markdown file content
            const markdownContent = fs.readFileSync(markdownFile, 'utf-8');

            // Escape special characters
            const escapedMarkdownContent = escapeQuotes(markdownContent);

            // Check if exampleInfo.tsx exists
            if (fs.existsSync(exampleInfoFile)) {
                // Read exampleInfo.tsx and replace content
                let exampleInfoContent = fs.readFileSync(exampleInfoFile, 'utf-8');
                
                // Regular expression to match and replace the whole content inside the backticks
                const updatedContent = exampleInfoContent.replace(/const markdownContent: string = `[^`]*`;/, 
                    `const markdownContent: string = \`${escapedMarkdownContent}\`;`);
                
                fs.writeFileSync(exampleInfoFile, updatedContent, 'utf-8');

                console.log(`${GREEN}    ${directory}${RESET}`);
            } else {
                console.log(`${RED}exampleInfo.tsx not found in: ${directory}${RESET}`);
            }
        }
    });
}

// Start processing from the root directory
console.log(`${RESET}Updating exampleInfo.tsx in:${RESET}`);
processDirectory(rootDir);