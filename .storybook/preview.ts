import type { Preview } from "@storybook/react";
import { StrictMode } from 'react';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    react: {
      // ...
      strictMode: true,
    },
  },
};

export default preview;
