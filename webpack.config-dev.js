import webpack from 'webpack'
import path from 'path'

var babelSettings = { stage: 0 }

babelSettings.plugins = ['react-transform:after']
babelSettings.extra = {
  'react-transform': {
    transforms: [{
      transform: 'react-transform-hmr',
      imports: ['react'],
      locals: ['module']
    }, {
      transform: 'react-transform-catch-errors',
      imports: ['react']
    }]
  }
}

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
