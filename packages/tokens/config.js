import StyleDictionary from "style-dictionary";

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

const lightSd = new StyleDictionary({
  source: ["src/primitives/**/*.json", "src/semantic/**/*.json", "src/themes/light.json"],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "build/css/",
      files: [
        {
          destination: "light.css",
          format: "css/variables",
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

const darkSd = new StyleDictionary({
  source: ["src/primitives/**/*.json", "src/semantic/**/*.json", "src/themes/dark.json"],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "build/css/",
      files: [
        {
          destination: "dark.css",
          format: "css/variables",
          options: {
            outputReferences: true,
            selector: '[data-theme="dark"]',
          },
        },
      ],
      expand: true,
    },
  },
});

export default {
  build: async () => {
    await baseSd.buildAllPlatforms();
    await lightSd.buildAllPlatforms();
    await darkSd.buildAllPlatforms();
  },
};
