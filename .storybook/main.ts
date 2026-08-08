import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: ["../src/components/**/*.mdx", "../src/components/**/*.stories.@(ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp",
  ],
  framework: "@storybook/nextjs-vite",
  staticDirs: ["../public"],
  core: { disableTelemetry: true },
};

export default config;
