module.exports = {
    entry: "./test/tests.ts",
    output: {
        path: __dirname,
        filename: "../built/test/bundled_test.js"
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
        configFileName: __dirname+'/test/tsconfig.json',
        compilerOptions:{
            target: 'es5',
            sourceMap: true,
            experimentalDecorators: true,
            emitDecoratorMetadata: true
        }
    }
};

