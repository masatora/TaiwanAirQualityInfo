const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
/*
  devServer: {
    proxy: {
      '/api/*': {
        target: 'http://opendata.epa.gov.tw',
	ws: true,
	changeOrigin: true
      }
    }
  },
*/
  publicPath: process.env.NODE_ENV === 'production' ? '/TaiwanAirQualityInfo/' : '/',
  configureWebpack: config => {
    if (isProduction) {
      config.plugins.push(new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }))
    }
  }
}
