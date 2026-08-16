import fs from "node:fs";
import path from "node:path";

const [category, name] = process.argv.slice(2);

if (!category || !name) {
  console.error("Usage: node scaffold-component.js <category> <name-kebab-case>");
  console.error("Categories: forms, layout, feedback");
  process.exit(1);
}

const validCategories = ["forms", "layout", "feedback"];
if (!validCategories.includes(category)) {
  console.error(`Invalid category: ${category}. Must be one of: ${validCategories.join(", ")}`);
  process.exit(1);
}

const pascalName = name
  .split("-")
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join("");

const rootDir = process.cwd();
const targetDir = path.join(rootDir, "packages", "components", "src", category);

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const tsxPath = path.join(targetDir, `${name}.tsx`);
const cssPath = path.join(targetDir, `${name}.module.css`);
const indexPath = path.join(rootDir, "packages", "components", "src", "index.ts");

const tsxContent = `import type { Component, ComponentProps } from 'solid-js';
import styles from './${name}.module.css';

export interface ${pascalName}Props extends ComponentProps<'div'> {
  variant?: 'primary' | 'secondary';
}

export const ${pascalName}: Component<${pascalName}Props> = (props) => {
  return (
    <div class={styles.root} {...props}>
      {props.children}
    </div>
  );
};
`;

const cssContent = `.root {
  display: block;
}
`;

fs.writeFileSync(tsxPath, tsxContent, "utf-8");
console.log(`Created ${tsxPath}`);

fs.writeFileSync(cssPath, cssContent, "utf-8");
console.log(`Created ${cssPath}`);

let indexContent = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, "utf-8") : "";
const exportLine = `export * from './${category}/${name}';\n`;

if (!indexContent.includes(exportLine)) {
  indexContent += exportLine;
  fs.writeFileSync(indexPath, indexContent, "utf-8");
  console.log(`Updated ${indexPath} with export line.`);
}
