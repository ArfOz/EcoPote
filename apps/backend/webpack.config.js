const { composePlugins, withNx } = require('@nx/webpack');

module.exports = composePlugins(withNx(), (config) => {
  // Explicitly define Webpack configuration to avoid using deprecated options.

  // Add CORS headers to the dev server configuration
  if (!config.devServer) {
    config.devServer = {};
  }
  config.devServer.headers = {
    'Access-Control-Allow-Origin': '*', // Allow all origins (use specific origins in production)
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers':
      'X-Requested-With, content-type, Authorization',
  };

  // Add any additional configuration as needed.
  // e.g., config.plugins.push(new MyPlugin());

  return config;
});
