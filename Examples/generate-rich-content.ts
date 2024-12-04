import * as fs from "fs";
import * as path from "path";
import fetch from "node-fetch";

const OpenAI_API_Key = "YOUR_API_KEY";
const OpenAI_API_Endpoint = "https://api.openai.com/v1/chat/completions";
const model = "gpt-4o-mini";

// Define allowed file extensions
const allowedExtensions = [".ts", ".tsx"];

async function generateMarkdown(exampleTitle: string, localFolderPath: string, outputFileName: string) {
    // Validate folder existence
    if (!fs.existsSync(localFolderPath) || !fs.statSync(localFolderPath).isDirectory()) {
        throw new Error(`The specified folder does not exist: ${localFolderPath}`);
    }

    // Read and combine the content of all files in the folder
    const files = fs.readdirSync(localFolderPath).filter((file) => allowedExtensions.includes(path.extname(file)));

    if (files.length === 0) {
        throw new Error("No valid files found in the folder.");
    }

    const combinedContent = files
        .map((file) => {
            const filePath = path.join(localFolderPath, file);
            const fileContent = fs.readFileSync(filePath, "utf8");
            return `### File: ${file}\n${fileContent}`;
        })
        .join("\n\n");

    // Prepare the prompt
    const prompt = `
The following are the contents of multiple source-code files which make up a single example or demo of SciChart.js - High Performance JavaScript Charts. The example title is ${exampleTitle}

${combinedContent}

Output a response in Markdown format with the following headings & generated content:

1. Under the H1 ${exampleTitle} add an H2 titled "Summary". In less than 100 words, from your understanding of the example, summarise what the example does for SEO purposes. This should rank for the search terms 'javascript charts' as well as ${exampleTitle}.
2. Add an H2 titled "How it works". Read and understand the source-code in \`drawExample.ts\` and explain how it works. Mention all the SciChart specific classes or types that you discover. For each SciChart class, link to the documentation in the format https://www.scichart.com/documentation/js/current/typedoc/classes/CLASS_NAME.html. Include code samples that are relevant.
2. Under the H2 "React-Specific Setup" read and understand the source-code in \`index.tsx\` and explain how it works. Mention in a code snippet that you must \`npm install scichart scichart-react\`. Include some code samples showing usage of <SciChartReact/>.
3. Only if \`angular.ts\` exists: Under the H2 "Angular-Specific Setup" read and understand the source-code in \`angular.ts\` and explain how it works. Mention in a code snippet that you must \`npm install scichart scichart-angular\`. Include some code samples showing usage of <scichart-angular/>.
`;

    // Create payload for OpenAI
    const payload = {
        model,
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt },
        ],
    };

    try {
        // Make the API request
        const response = await fetch(OpenAI_API_Endpoint, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${OpenAI_API_Key}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`OpenAI API request failed with status ${response.status}`);
        }

        const responseData = await response.json();
        // @ts-ignore
        const markdownContent = responseData.choices[0]?.message?.content;

        if (!markdownContent) {
            throw new Error("No content returned from OpenAI API.");
        }

        // Write the markdown content to the output file
        const outputFilePath = path.join(localFolderPath, outputFileName);
        console.log(`writing output file to ${outputFilePath}`);
        fs.writeFileSync(outputFilePath, markdownContent, "utf8");

        console.log(`OpenAI response saved to: ${outputFilePath}`);
    } catch (error) {
        // @ts-ignore
        console.error(`An error occurred: ${error.message}`);
    }
}

const _exampleTitle = process.argv[2];
const _localFolderPath = process.argv[3];
const _outputFileName = process.argv[4];

generateMarkdown(_exampleTitle, _localFolderPath, _outputFileName).catch((err) => console.error(err.message));
