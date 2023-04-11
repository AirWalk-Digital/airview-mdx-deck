const path = require('path');

module.exports = async ({ config, mode }) => {
  config.module.rules.push({
    test: /\.mdx$/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-react',
            '@babel/preset-env',
          ],
        },
      },
      {
        loader: 'mdx-remote-loader',
        options: {
          mdxOptions: {
            remarkPlugins: [],
            rehypePlugins: [],
          },
        },
      },
    ],
  });

  config.resolve.fallback = {
    os: false, // use an empty module for the 'os' module
    fs: false,
  };

  config.resolve.alias = {
    ...config.resolve.alias,
    react: path.resolve(__dirname, '..', 'node_modules', 'react'),
    'react/jsx-runtime': path.resolve(__dirname, '..', 'node_modules', 'react/jsx-runtime'),
  };

  return config;
};
