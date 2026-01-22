import { Project, SyntaxKind } from "ts-morph";
import * as fs from "fs";
import * as path from "path";

const project = new Project();
// Add all your step files
project.addSourceFilesAtPaths("src/steps/**/*.ts");

const steps: any[] = [];

project.getSourceFiles().forEach((sourceFile) => {
  const functions = sourceFile.getFunctions().filter((f) => f.isExported());

  functions.forEach((fn) => {
    const name = fn.getName();
    const jsDocs = fn.getJsDocs();
    let description = "";
    let examples: string[] = [];

    if (jsDocs.length > 0) {
      const doc = jsDocs[0];
      description = doc.getDescription().trim();

      // Extract @example tags
      examples = doc
        .getTags()
        .filter((tag) => tag.getTagName() === "example")
        .map((tag) => tag.getCommentText() || "")
        .filter((text) => text.length > 0);
    }

    // Convert function name (camelCase) or a custom logic to a Gherkin Label
    // Here we use the first @example as the label, or the function name
    const label =
      examples.length > 0
        ? examples[0].replace(/^(Given|When|Then|And|But)\s+/, "").trim()
        : name || "Unknown Step";

    steps.push({
      label: label,
      functionName: name,
      detail: "Appium BDD Step",
      documentation: description,
      examples: examples,
      // Create a snippet based on Gherkin syntax
      insertText: label
        .replace(/\{string\}/g, '"${1:text}"')
        .replace(/\{int\}/g, "${1:0}"),
    });
  });
});

const outputPath = path.join(__dirname, "..", "dist", "metadata.json");
if (!fs.existsSync(path.dirname(outputPath))) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify({ steps }, null, 2));
console.log(`✅ Metadata generated at: ${outputPath}`);
