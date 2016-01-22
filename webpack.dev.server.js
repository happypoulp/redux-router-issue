import WebpackDevServer from 'webpack-dev-server'
import webpack from 'webpack'
import webpackConfig from './webpack.config-dev.js'

const compiler = webpack(webpackConfig)
const PORT = 1234

new WebpackDevServer(compiler, {
  publicPath: webpackConfig.output.publicPath,
  hot: true,
  stats: {
    colors: true
  },
  watchOptions: {
    poll: true,
    aggregateTimeout: 1500
  }
}).listen(PORT, '0.0.0.0', function(err) {
  if (err) {
    console.log(err)
  }
  console.log(`webpack-dev-server listening on http://0.0.0.0:${PORT}`)
})
