var configFileName = __dirname + '/tsconfig.json';

console.log('configFileName:'+ configFileName);

module.exports = {
    entry: "./test/tests.ts",
    output: {
        path: __dirname,
        filename: "../built_test/bundled.js"
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    // Source maps support ('inline-source-map' also works)
    devtool: 'source-map',
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    },
    ts:{
        configFileName: configFileName,
        compilerOptions:{
            target: 'es5',
            sourceMap: true,
            experimentalDecorators: true,
            emitDecoratorMetadata: true,
            sourceMap: true
        }
    }
};

