import webpack from 'webpack'
import path from 'path'

const babelSettings = { stage: 0 }
const config = {

  context: __dirname,
  entry: {
    app: [
      `webpack-dev-server/client?http://0.0.0.0:1234`,
      'webpack/hot/dev-server',
      './src/index.js',
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/static/',
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel?' + JSON.stringify(babelSettings)],
        include: path.join(__dirname, 'src'),
      },
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
}

export default config
