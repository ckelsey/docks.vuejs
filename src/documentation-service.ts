// SERVICES

class DocumentationService {
    doc: any = {}
    openedDoc: string = 'doc-active-dropdown'
    DocsData = {}

    states = {
        props: false,
        methods: false,
        computed: false,
        dataProps: false,
        demo: false,
        demoOverlay: false,
        components: false,
        services: false,
        tests: false,
        view: '',
        argToShow: ``
    }

    setDocs(DocsData: any) {
        this.DocsData = DocsData
    }

    setDoc() {
        this.doc = this.getThis(this.DocsData, this.openedDoc, {})
        return this.modelDoc(this.doc)
    }

    openDoc(doc: string) {
        this.openedDoc = doc
        this.states.view = `components`
        this.setDoc()
    }

    openService(doc: string) {
        this.openedDoc = doc
        this.states.view = `services`
        this.setDoc()
    }

    modelDoc(doc: any) {
        doc.methods = {}
        doc.data = {}
        doc.props = {}
        doc.computed = {}
        doc.meta = {}

        for (var p in doc.children) {
            if (doc.children[p]) {

                let prop = `meta`

                switch (doc.children[p].kind) {
                    case `Method`:
                        prop = `methods`
                        break
                    case `Accessor`:
                        prop = `computed`
                        break
                    case `Prop`:
                        prop = `props`
                        doc.children[p].value = null
                        break
                    case `Property`:
                        if (p !== `name` && p !== `_description`) {
                            prop = `data`
                        }
                        break
                }

                doc[prop][p] = doc.children[p]
            }
        }

        if (!Object.keys(doc.methods).length) {
            delete doc.methods
        }

        if (!Object.keys(doc.data).length) {
            delete doc.data
        }

        if (!Object.keys(doc.props).length) {
            delete doc.props
        }

        if (!Object.keys(doc.computed).length) {
            delete doc.computed
        }

        return doc
    }

    getMarkup(doc: any) {
        let props = []

        for (var p in doc.props) {
            if (doc.props[p]) {
                props.push(`:${p}="doc.props.${p}.value"`)
            }
        }

        return `<${doc.meta.name.default}${props.length ? `\n  ` : ``}${props.join('\n  ')}${props.length ? `\n` : ``}></${doc.meta.name.default}>`
    }

    formatReturn(obj: any): any {

        if (!obj) {
            return
        }

        if (obj.properties) {
            return this.formatProperties(obj.properties)
        } else if (obj.type && obj.type.toLowerCase) {
            if (obj.type.toLowerCase() === `promise`) {

                if (typeof obj.values === `string`){
                    return `Promise => ${obj.values}`
                }

                return { Promise: this.formatReturn(obj.values) }
            }

            if (obj.type.toLowerCase() === `array`) {
                let key = `Array(${obj.values.type})`
                let data: any = {}
                data[key] = this.formatReturn(obj.values)
                return data
            }

            if (obj.type.toLowerCase() === `object`) {
                return this.formatReturn(obj.values)
            }

            return `${obj.name} (${obj.type})`

        } else if (obj.values && Array.isArray(obj.values)) {
            let result = obj.values.map((element: any) => {
                if (element.values) {
                    return this.formatReturn(element)
                }

                if (element.type) {
                    return element.type
                }

                return element
            })

            let allStrings = true

            for (let i = 0; i < result.length; i++) {
                if (typeof result[i] !== `string`) {
                    allStrings = false
                    break
                }
            }

            if (allStrings) {
                result = result.join(` | `)
            }

            return result
        } else if (Array.isArray(obj)) {
            obj = obj.map(element=>{
                return this.formatReturn(element)
            })
        }

        return obj
    }

    formatProperties(obj: any): any {
        let result: any = {}


        if (!obj) {
            return ''
        }

        if (obj.properties) {
            return this.formatProperties(obj.properties)
        } else {
            for (var p in obj) {
                if (obj[p]) {
                    if (obj[p].properties) {
                        result[`${p} (${obj[p].type})`] = this.formatProperties(obj[p].properties)
                    } else if (Array.isArray(obj[p].type)) {
                        result[`${p} (Array<${obj[p].type[0].type}>)`] = this.formatProperties(obj[p].type[0].properties)
                    } else {
                        result[p] = obj[p].type
                    }
                }
            }
        }

        return result
    }

    json(obj: any) {
        let result = ``

        try {
            result = JSON.stringify(obj, null, "    ")
        } catch (error) { }

        return result
    }

    docName(doc: any) {

        if (!doc) {
            return
        }

        return this.getThis(doc, `meta.name.default`, doc.name)
    }

    getThis(el: any, path: Array<any> | string, emptyVal?: any) {
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
                let argsString: string = ''

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
}

export default new DocumentationService()