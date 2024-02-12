const path = require('path');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, './src/index.ts'),
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        use: 'ts-loader',
        include: [path.resolve(__dirname, 'src')],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  target: 'node',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
