import StyleDictionary from "style-dictionary";
import { promises as fs } from "fs";
import path from "path";

const baseSd = new StyleDictionary({
  source: ["src/primitives/**/*.json", "src/semantic/**/*.json"],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "build/css/",
      files: [
        {
          destination: "tokens.css",
          format: "css/variables",
          options: {
            outputReferences: true,
          },
        },
      ],
      expand: true,
    },
  },
});

const themeLightSd = new StyleDictionary({
  source: ["src/primitives/**/*.json", "src/themes/light.json"],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "build/css/",
      files: [
        {
          destination: "theme-light.css",
          format: "css/variables",
          filter: (token) => token.filePath && token.filePath.includes("light.json"),
          options: {
            outputReferences: true,
            selector: ':root, [data-theme="light"]',
          },
        },
      ],
      expand: true,
    },
  },
});

const themeDarkSd = new StyleDictionary({
  source: ["src/primitives/**/*.json", "src/themes/dark.json"],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "build/css/",
      files: [
        {
          destination: "theme-dark.css",
          format: "css/variables",
          filter: (token) => token.filePath && token.filePath.includes("dark.json"),
          options: {
            outputReferences: true,
            selector: '[data-theme="dark"]',
          },
        },
        {
          destination: "theme-dark-media.css",
          format: "css/variables",
          filter: (token) => token.filePath && token.filePath.includes("dark.json"),
          options: {
            outputReferences: true,
            selector: "@media (prefers-color-scheme: dark) {\n  :root",
          },
        },
      ],
      expand: true,
    },
  },
});

await baseSd.buildAllPlatforms();
await themeLightSd.buildAllPlatforms();
await themeDarkSd.buildAllPlatforms();

// Append closing bracket for theme-dark-media.css if generated
const buildCssDir = path.join("build", "css");
const mediaCssPath = path.join(buildCssDir, "theme-dark-media.css");
try {
  let content = await fs.readFile(mediaCssPath, "utf-8");
  content += "\n}\n";
  await fs.writeFile(mediaCssPath, content, "utf-8");
} catch {
  // Ignore if file doesn't exist
}

// Bundle into master tokens.css
const mainTokens = await fs.readFile(path.join(buildCssDir, "tokens.css"), "utf-8");
const themeLight = await fs.readFile(path.join(buildCssDir, "theme-light.css"), "utf-8");
const themeDark = await fs.readFile(path.join(buildCssDir, "theme-dark.css"), "utf-8");
const themeDarkMedia = await fs.readFile(path.join(buildCssDir, "theme-dark-media.css"), "utf-8");

const fullCss = `${mainTokens}\n${themeLight}\n${themeDarkMedia}\n${themeDark}`;
await fs.writeFile(path.join(buildCssDir, "tokens.css"), fullCss, "utf-8");
