const path = require('path');

module.exports = {
  mode: 'production', // Set mode to 'production' or 'development'
  entry: './src/index.js', // Entry file of your package
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.js', // Output bundle filename
    library: 'Delimiter', // Exported library name
    libraryTarget: 'umd', // Universal Module Definition
    libraryExport: 'default', // Default exports are needed for Editor.js
    umdNamedDefine: true,
  },
};
