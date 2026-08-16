export default {
  source: ["src/**/*.json"],
  platforms: {
    css: {
      transformGroup: "css",
      files: [
        {
          destination: "build/css/tokens.css",
          format: "css/variables",
        },
      ],
      expand: true,
    },
  },
};
