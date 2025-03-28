const { composePlugins, withNx } = require('@nx/webpack');

module.exports = composePlugins(withNx(), (config) => {
  // Explicitly define Webpack configuration to avoid using deprecated options.

  // Add any additional configuration as needed.
  // e.g., config.plugins.push(new MyPlugin());

  return config;
});
