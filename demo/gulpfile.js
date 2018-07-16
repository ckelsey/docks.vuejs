"use strict";
var typedocks = require('typedock')
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var webpack = require('webpack')
var path = require("path")
var exec = require('child_process').exec
const { spawn } = require('child_process');
var fs = require("fs")
const gulpSequence = require('gulp-sequence')

var paths = {
    watch: ["./*.ts", "../src/**/*.*", "../src/**/**/*.*"],
    jshint: ["./*.*", "../src/**/*.*", "../src/**/**/*.*"]
}

const getThis = (el, path, emptyVal) => {
    if (path && path.toString().split) {
        path = [el].concat(path.toString().split(`.`))
    } else {
        path = [el]
    }

    let result = path.reduce(function (accumulator, currentValue) {
        if (accumulator === undefined) {
            return emptyVal
        }

        if (currentValue.indexOf(`.`) === -1 && currentValue.indexOf(`(`) > -1) {
            let argsString = ''

            let argsObj = /\((.*?)\)/g.exec(currentValue)

            if (argsObj) {
                argsString = argsObj[1] || ``
            }

            let args = argsString.split(`,`).map((arg) => { return arg.trim() })
            let functionName = currentValue.split(`(`)[0]

            if (typeof accumulator[functionName] === `function`) {
                let result = accumulator[functionName].apply(accumulator, args)
                return result
            }
        }

        if (currentValue) {
            return accumulator[currentValue]
        } else {
            return accumulator
        }

    })

    if (result === undefined) {
        return emptyVal
    }

    return result
}

gulp.task('server', function () {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        https: true,
        single: true
    });
})

function pack() {
    console.log(__dirname)
    return new Promise(resolve => {

        const child = spawn(`webpack`, [`--config`, path.join(__dirname, 'webpack.config.js'), `--progress`]);

        child.stdout.on('data', (data) => {
            console.log(`${data}`);
        });

        child.stderr.on('data', (data) => {
            console.error(`${data}`);
        });

        child.on('exit', function (code, signal) {
            exec(`osascript -e 'display notification "Complete" with title "WEBPACK"'`)
            exec(`cp ./src/index.html ./dist`)
            exec(`cp -r ./src/assets ./dist`)
            resolve()
        });
    })
}

gulp.task('set-dev-env', function () {
    return process.env.NODE_ENV = 'development';
});

gulp.task('set-prod-env', function () {
    return process.env.NODE_ENV = 'production';
});

gulp.task('publish', () => {
    console.log(`START WEBPACK`)

    return pack()
        .then(() => {
            browserSync.reload()
        })
})

gulp.task("dev", [`set-dev-env`, `publish`], function () {
    gulp.watch(paths.watch, [`set-dev-env`, `publish`]);
});

gulp.task("build", function (cb) {
    gulpSequence(`set-prod-env`, `docks`, `publish`)(cb)
});

gulp.task(`docks`, [], (cb) => {
    let td = new typedocks({
        outputDirectory: path.resolve(__dirname, `docks`),
        sourceDirectory: path.resolve(__dirname, `../src`)
    })
    
    td.generate()
        .then(docs => {
            console.log(`docs`)
            return cb()
        })
        .catch(err => {
            console.log(`err`)
            return cb()
        })
})

gulp.task("default", [
    "dev"
], function () { });