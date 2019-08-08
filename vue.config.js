module.exports = {
  pages: {
    index: {
      entry: './src/pages/index/main.js',
      template: 'public/index.html',
      title: 'App Configurations',
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
    wifi: {
      entry: './src/pages/wifi/main.js',
      template: 'public/index.html',
      title: 'Wifi Configurations',
      chunks: ['chunk-vendors', 'chunk-common', 'wifi'],
    },
    login: {
      entry: './src/pages/login/main.js',
      template: 'public/index.html',
      title: 'Login',
      chunks: ['chunk-vendors', 'chunk-common', 'login'],
    },
  },
};
