"use strict";
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
        server:{
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

gulp.task('docs', ['createDocs', 'publish'])

gulp.task("createDocs", function (done) {
    console.log(`START DOCS`)

    let dir = path.resolve(__dirname, `docs`)
    let srcPath = path.resolve(dir, `docs.json`)
    let outPath = path.resolve(dir, `docsData.json`)

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }

    // fs.openSync(srcPath, 'w')
    // fs.openSync(outPath, 'w')

    const exec = require('child_process').exec
    exec(`typedoc --json ./docs/docs.json ../src/ --tsconfig ./tsconfig.json --excludeExternals --includeDeclarations --exclude node_modules --ignoreCompilerErrors --target ES5 --mode file`, function () {

        const Docs = require(srcPath)

        let results = {
            components: {},
            services: {}
        }

        const getProps = (_p, _obj) => {
            if (_p.type.type === `reference`) {
                Docs.children.forEach(el => {
                    if (el.id === _p.type.id && el.children) {
                        _obj.properties = {}

                        el.children.forEach(p => {
                            _obj.properties[p.name] = {
                                name: p.name,
                                type: getType(p)
                            }

                            getProps(p, _obj.properties[p.name])
                        })
                    }
                })
            }
        }

        const joinTypes = (types) => {
            let _types = []
            let isReference = false

            types.forEach(_type => {
                if (_type.typeArguments) {
                    let props = {
                        type: _type.name,
                    }

                    _type.typeArguments.forEach(arg => {
                        props.value = getType(arg)
                    })

                    _types.push(props)

                    return
                }

                if (_type.id && _type.type === `reference`) {
                    isReference = true

                    let props = {
                        type: _type.name
                    }

                    getProps({ type: _type }, props)

                    _types.push(props)

                    return
                }

                if (_type.name) {
                    _types.push(_type.name)
                }
            })

            if (isReference) {
                return _types
            }

            return _types.join(' | ')
        }

        const getType = (item) => {
            let result = ``

            if (item.type) {
                let t = null

                if (item.type.name) {
                    result = item.type.name
                }

                if (item.type.types && item.type.types.length) {
                    t = `types`
                }

                if (item.type.typeArguments && item.type.typeArguments.length) {
                    t = `typeArguments`
                }

                if (t) {
                    result = joinTypes(item.type[t])
                }
            } else if (item.kindString) {
                result = item.kindString
            }

            return result
        }

        const getReturn = (item) => {

            if (item) {
                if (item.type.typeArguments) {
                    let values = item.type.typeArguments.map(type => {
                        return getReturn(type) || type.name
                    })

                    if (values.length === 1) {
                        values = values[0]
                    }

                    return {
                        type: item.type.name,
                        values
                    }
                }

                if (item.typeArguments) {
                    let values = item.typeArguments.map(type => {
                        return getReturn(type) || type.name
                    })

                    if (values.length === 1) {
                        values = values[0]
                    }

                    return {
                        type: item.name,
                        values
                    }
                }

                if (item.type.types) {
                    let values = item.type.types.map(type => {
                        return getReturn(type) || type.name
                    })

                    if (values.length === 1) {
                        values = values[0]
                    }

                    return {
                        type: item.type.name,
                        values
                    }
                }

                if (item.type === `reference`) {

                    let props = {
                        type: item.name
                    }

                    getProps({ type: item }, props)

                    return props
                }

                if (item.type.type === `reference`) {

                    let props = {
                        type: item.type.name
                    }

                    getProps({ type: item.type }, props)

                    return props
                }

                return item.type.name
            }

            return `void`
        }

        const getChildren = (obj) => {
            let children = {}

            obj.forEach(item => {

                let child = {
                    name: item.name,
                    kind: getThis(item, 'decorators.0.name') || item.kindString,
                    children: item.children && item.children.length ? getChildren(item.children) : undefined,
                    default: item.defaultValue ? item.defaultValue.replace(/'|"|`/g, '') : '',
                    description: getThis(item, 'comment.tags.0.text'),
                    required: getThis(item, 'flags.isOptional'),
                    type: getType(item)
                }

                if (child.type === `Method` || child.type === `Accessor`) {
                    child.returns = getReturn(getThis(item, 'signatures.0'))
                    child.description = getThis(item, 'signatures.0.comment.tags.0.text')
                }

                if (item.getSignature) {
                    child.returns = getType(item.getSignature)
                }

                let params = getThis(item, 'signatures.0.parameters')

                if (params && params.length) {
                    let _params = []

                    params.forEach(param => {
                        let thisParam = {
                            name: param.name,
                            type: getType(param)
                        }

                        getProps(param, thisParam)

                        _params.push(thisParam)
                    })

                    child.params = _params
                }

                children[child.name] = child
            })


            return children
        }

        Docs.children.forEach(element => {
            let propertyToAddTo = null

            if (getThis(element, 'decorators.0.name') === 'Component') {
                propertyToAddTo = `components`
            } else if (element.kindString === `Class`) {
                propertyToAddTo = `services`
            }

            if (propertyToAddTo) {
                results[propertyToAddTo][element.name] = {
                    name: element.name,
                    kind: element.kindString,
                    children: getChildren(element.children)
                }
            }
        })

        fs.writeFileSync(outPath, JSON.stringify(results))
        console.log(`DOCS WRITTEN`)
        done()
    })
});

gulp.task("dev", [`set-dev-env`, `publish`], function () {
    gulp.watch(paths.watch, [`set-dev-env`, `publish`]);
});

gulp.task("build", function (cb) {
    gulpSequence(`set-prod-env`, `createDocs`, `publish`)(cb)
});

gulp.task("default", [
    "dev"
], function () { });