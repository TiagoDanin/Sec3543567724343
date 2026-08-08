import type { Preview, Decorator } from "@storybook/nextjs-vite";
import { fontVariables } from "../src/lib/fonts";
import "../src/app/globals.css";

// O escuro é intenção de marca, não preferência de sistema: toda story renderiza
// sobre o chão de igapó, com as três famílias já aplicadas.
const withBrand: Decorator = (Story) => (
  <div className={`${fontVariables} bg-ink text-cream font-sans min-h-svh p-8`}>
    <Story />
  </div>
);

const preview: Preview = {
  decorators: [withBrand],
  parameters: {
    layout: "fullscreen",
    backgrounds: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: { test: "todo" },
  },
};

export default preview;
