const path = require('path');
 const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
   entry: {
     app: './src/index.js',
   },
   module: {
       rules: [
           {
               test: /\.tsx?$/,
               use: 'ts-loader',
               exclude: /node_modules/,
           }
       ]
   },
   resolve: {
    extensions: ['.tsx', '.ts', '.js']
   },
   plugins: [
     new HtmlWebpackPlugin({
       title: 'Production',
     }),
   ],
   output: {
     filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
     clean: true,
   },
 };