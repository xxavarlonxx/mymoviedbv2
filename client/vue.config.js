const path = require('path');

module.exports = {
  //outputDir: path.resolve(__dirname, "../server/public"),
  //indexPath: "main.html",
  //filenameHashing: false,
  devServer: {
    //proxy: 'http://dev:3000/',
    proxy: {
      '/api': {
        target: 'http://localhost:3333',
        changeOrigin: true,
      },
    },
  },
};
