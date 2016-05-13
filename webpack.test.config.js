var configFileName = __dirname + '/test/tsconfig.json';

console.log('Webpack: configFileName:'+ configFileName);

var outputFileName = "./built_test/bundled.js";

console.log('Webpack: outputFileName: ' + outputFileName);

var entry = "./test/tests.ts";

console.log("Webpack: entry: " + entry ) ;

module.exports = {
    entry: entry,
    output: {
        path: __dirname,
        filename: outputFileName
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    // Source maps support ('inline-source-map' also works)
    //devtool: 'source-map',
    devtool: 'inline-source-map',
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    },
    ts:{
        configFileName: configFileName,
        compilerOptions:{
            sourceMap: true
        }
    }
};

