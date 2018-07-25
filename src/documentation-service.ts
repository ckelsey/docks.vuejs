class DocumentationService {
    doc: any = {}
    openedDoc: string = 'doc-active-dropdown'
    DocsData:any = {}

    states = {
        props: false,
        methods: false,
        computed: false,
        dataProps: false,
        demo: false,
        demoOverlay: false,
        components: false,
        tests: false,
        view: '',
        sidebarState: ``,
        argToShow: ``
    }

    setDocs(DocsData: any) {
        this.DocsData = DocsData
    }

    setDoc() {
        this.doc = this.getThis(this.DocsData, this.openedDoc, {})
        return this.doc
    }

    openDoc(doc: string) {
        this.openedDoc = doc
        this.states.view = `components`
        this.setDoc()
    }

    getMarkup(doc: any) {
        let props = []

        for (var p in doc.props) {
            if (doc.props[p]) {
                props.push(`:${p}="doc.props.${p}.value"`)
            }
        }

        return `<${doc.name}${props.length ? `\n  ` : ``}${props.join('\n  ')}${props.length ? `\n` : ``}></${doc.name}>`
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

        return doc.name
    }

    /**
     * @param el The starting object
     * @param path String to follow
     * @param emptyVal What is returned if undefined
     * @desc Navigates an object or array to find a value
     */
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