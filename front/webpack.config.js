const path = require('path');

module.exports = {
    devtool: 'inline-source-map',
    entry: './index.ts',
    mode: 'development',
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }]
    },
    output: {
        filename: 'index.ts',
        path: path.resolve(__dirname, '..', 'public/javascripts')
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js']
    },
};
