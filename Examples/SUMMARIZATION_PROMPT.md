# Example Summarization Prompt Template

Use this prompt to create comprehensive functional and technical summaries for SciChart.js examples:

---

**TASK:**
Study the code in example '[EXAMPLE_PATH]' starting at '[MAIN_INDEX_FILE]' and summarize the functionality both from a user perspective and the technical implementation of that functionality. Talk about where custom code has been created to achieve certain things.

Do not go into detail about the data generation. Just say where it comes from eg generated, loaded from server etc

Produce the summary in markdown format in a file in the example folder.

**STRUCTURE REQUIREMENTS:**

### 1. Overview

-   **Dashboard/Interface Layout**: Describe the visual layout and main components
-   **User Interactions**: Detail what users can click, select, hover, or manipulate
-   **Interactive Features**: Explain the workflow and how interactions connect different parts
-   **Primary Use Cases**: What problems this example solves or demonstrates

### 2. Technical Implementation

#### Architecture Overview

-   Focus on SciChart React integration (how `SciChartReact` components manage lifecycle)
-   Chart coordination and communication patterns
-   NOT React state management details

#### Individual Chart/Component Analysis

For each major chart or component:

**API Surface Documentation:**

-   **Input Parameters**: What data and callbacks the component expects
-   **Return Values**: What methods and objects are exposed for external control
-   **Callback Interfaces**: Function signatures for inter-component communication
-   **Update Methods**: How components can be programmatically updated

**Key Technical Features:**

-   Custom SciChart series, modifiers, or providers used
-   Notable SciChart API usage (sub-charts, filters, palette providers, etc.)
-   Custom classes or extensions created

#### Component Communication

-   Document the specific APIs that enable coordination between components
-   Explain callback patterns and method calls that facilitate communication
-   Detail any manual synchronization required between different interaction patterns

#### Performance Optimizations & Advanced Features

-   Memory management approaches
-   Rendering optimizations
-   Custom implementations of SciChart interfaces

**FORMATTING GUIDELINES:**

-   Use markdown with clear headings and structure
-   Reference files using relative links: `[filename](filename.ext)`
-   Reference specific code constructs as: `[ClassName/methodName()](filename.ext:line)`
-   NO code samples - readers can view the actual code in adjacent files
-   Focus on WHAT is exposed and HOW components work together, not the internal implementation details

**RESTRICTIONS:**

-   Do NOT include TypeScript/JavaScript code blocks
-   Do NOT detail React state management
-   Do NOT explain basic SciChart concepts - focus on custom implementations

**OUTPUT:**
Create a `README.md` file in the example folder with the complete analysis.
