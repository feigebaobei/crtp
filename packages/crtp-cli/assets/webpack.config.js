const path = require('path')

module.exports = (env) => {
    return {
        mode: env.production ? 'production' : 'development',
        entry: './src/index.js',
        devtool: 'inline-source-map',
        devServer: {
            static: './dist',
            hot: true,          // 启动hmr
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                }
            ]
        },
        output: {
            filename: 'main.js',
            path: path.resolve(__dirname, 'dist'),
            clean: true
        },
        externals: [],
        optimization: {
            usedExports: true,          // 
        }
    }
}