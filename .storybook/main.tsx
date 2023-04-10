import type { StorybookConfig } from "@storybook/nextjs";
import type { webpack5 } from '@storybook/core/server';

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
        babelOptions: {},
        sourceLoaderOptions: null,
      },
    },
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  webpackFinal: async (config: webpack5.Configuration) => {
    config.module.rules.push({
      test: /\.mdx$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            plugins: ['@babel/plugin-transform-react-jsx']
          }
        },
        // {
        //   loader: '@mdx-js/loader',
        //   options: {
        //     remarkPlugins: [require('remarkGfm')],
        //   },
        // },
        {
          loader: 'next-mdx-remote/loader',
          options: {
            remarkPlugins: [require('remarkGfm')],
            /* your options here */
          },
        },
      ]
    });
    return config;
  },
};
export default config;


