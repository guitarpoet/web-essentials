var path = require("path");
var webpack = require('webpack');
var SRC_DIR= path.resolve(__dirname, "framework");
var BUILD_DIR = path.resolve(__dirname, "dist/js");

//======================================================================
//
// For definitions
//
//======================================================================


var env = JSON.stringify("development");

var commit = JSON.stringify("NONE");
if(process.env.COMMIT) {
    commit = JSON.stringify(process.env.COMMIT)
}

var version = JSON.stringify("NONE");
if(process.env.VERSION) {
    version = JSON.stringify(process.env.COMMIT)
}

var defines = {
    "process.env": {
        "VERSION": version,
        "COMMIT": commit,
        "NODE_ENV": env
    }
}

var config = {
    entry:  {
        "bundle": SRC_DIR + "/index.jsx",
        "test": SRC_DIR + "/test.jsx"
    },
    devtool: "source-map",
    output: {
        path: BUILD_DIR,
        publicPath: "/js/",
        filename: "[name].js"
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    plugins: [
        new webpack.DefinePlugin(defines)
    ],
    module : {
        preLoaders: [
            {
                test: /\.(js|jsx)$/,
                include: SRC_DIR,
                loader: 'eslint-loader'
            }
        ],
        loaders : [
            {
                test: /\.scss$/,
                include : SRC_DIR,
                loaders: ["style", "css?sourceMap", "sass?sourceMap"]
            },
            {
                test: /\.sass$/,
                loaders: ["style", "css?sourceMap", "sass?sourceMap"]
            },
            { 
                test: /\.css$/, 
                include : SRC_DIR,
                loaders: ["style", "css?sourceMap"]
            },
            {
                test : /\.json$/,
                exclude: /node_modules/,
                loaders : ["json-loader"]
            },
            {
                test : /\.jsx$/,
                exclude: /node_modules/,
                loaders : ["babel"]
            }
        ]
    },
    node: {
        fs: "empty"
    }
};

module.exports = config;
