import Vue from 'vue'

import DocumentationService from './documentation-service'

class TestService {
    doc: any = {}
    openedDoc: string = 'doc-active-dropdown'
    testResults: any = {
        testsAreRunning: false,
        tests: {}
    }

    tests: any = {}
    flatTests: any = {}
    testTypes: any = {
        class: [],
        components: [],
        modules: [],
        "object literals": [],
        interfaces: [],
        variable: []
    }
    shownTestsState: string = ``

    setTests(tests: any) {
        this.tests = tests
        this.testTypes.class = DocumentationService.getThis(this.tests, `class`, [])

        let typesToTest = [
            `methods`,
            `properties`,
            `attributeProperties`,
            `computed`
        ]

        for (let type in DocumentationService.DocsData) {
            if (DocumentationService.DocsData[type]) {

                for (let docName in DocumentationService.DocsData[type]) {
                    if (DocumentationService.DocsData[type][docName] && docName !== `DocumentationService` && docName !== `TestService`) {

                        let serviceTest = DocumentationService.getThis(this.testTypes, `${type}.${docName}`, { tests: [] })
                        let serviceTestTests: any = {}

                        serviceTest.tests.forEach((test: any) => {
                            let fors = test.for

                            if (!fors) {
                                fors = test.name
                            }

                            if (Array.isArray(fors)) {
                                fors.forEach(_for => {
                                    if (!serviceTestTests[_for]) {
                                        serviceTestTests[_for] = [test]
                                        return
                                    }

                                    serviceTestTests[_for].push(test)
                                })
                            } else {
                                if (!serviceTestTests[fors]) {
                                    serviceTestTests[fors] = [test]
                                    return
                                }
                                serviceTestTests[fors].push(test)
                            }
                        })

                        if (DocumentationService.DocsData[type][docName].children){
                            
                            for (let childName in DocumentationService.DocsData[type][docName].children) {
                                if (DocumentationService.DocsData[type][docName].children[childName] && typesToTest.indexOf(childName) > -1) {

                                    for (let propName in DocumentationService.DocsData[type][docName].children[childName]) {
                                        if (DocumentationService.DocsData[type][docName].children[childName][propName]) {

                                            DocumentationService.DocsData[type][docName].children[childName][propName].tests = serviceTestTests[propName]
                                            DocumentationService.DocsData[type][docName].children[childName][propName].testCases = serviceTestTests[propName] ? serviceTestTests[propName].map((test: any) => {
                                                return test.name
                                            }) : []
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    hasTestRan(doc: string, testName: string) {

        if (!doc) {
            return false
        }

        return DocumentationService.getThis(this.testResults.tests, `${doc}.results.${testName}`)
    }

    hasTestPassed(doc: string, testName: string) {

        if (!doc) {
            return undefined
        }

        return DocumentationService.getThis(this.testResults.tests, `${doc}.results.${testName}.pass`)
    }

    getTestAssertResult(doc: string, testName: string, index: number) {
        if (!doc) {
            return undefined
        }

        return DocumentationService.getThis(this.testResults.tests, `${doc}.results.${testName}.results.${index}`)
    }

    hasTestAsserts(doc: string, testIndex: number) {

        if (!doc) {
            return undefined
        }

        let asserts: Array<any> = DocumentationService.getThis(this.tests, `${doc}.tests.${testIndex}.asserts`)
        let assertKeys: Array<string> = []

        if (asserts) {
            asserts.forEach(element => {
                if (element.name) {
                    assertKeys.push(element.name)
                } else {
                    assertKeys.push(element)
                }
            })
        }

        return assertKeys
    }

    isTestRunning(doc: string, testName?: string) {

        if (!doc) {
            return undefined
        }

        if (!testName) {
            return DocumentationService.getThis(this.testResults.tests, `${doc}.running`)
        }

        return DocumentationService.getThis(this.testResults.tests, `${doc}.results.${testName}.running`)
    }

    getTests(doc: string) {

        if (!doc) {
            return false
        }

        return this.tests[doc] || undefined
    }

    runAsserts(test: any) {
        return new Promise((resolve, reject) => {
            test.results = []

            const runAssert = (index: number) => {
                if (!test.asserts[index]) {
                    return resolve(test.results)
                }

                let key: any = test.asserts[index]
                let fn: Function = () => { }
                let pre: Function | null = null
                let val: any

                if (typeof key === `string`) {
                    fn = test.methods[key]
                } else if (typeof test.asserts[index] === `object`) {
                    key = test.asserts[index].name
                    fn = test.asserts[index].fn
                    pre = test.asserts[index].pre || pre
                }

                const setResult = () => {
                    if (val instanceof Promise) {
                        val
                            .then(res => {
                                test.results.push({ pass: true, message: res, key })
                                runAssert(index + 1)
                            })
                            .catch(res => {
                                test.results.push({ pass: false, message: res, key })
                                runAssert(index + 1)
                            })
                    } else {
                        test.results.push({ pass: !!val, message: val, key })
                        runAssert(index + 1)
                    }
                }

                if (!pre) {
                    val = fn()
                    setResult()
                } else {
                    pre()
                        .then(() => {
                            val = fn()
                            setResult()
                        })
                        .catch(() => {
                            val = fn()
                            setResult()
                        })
                }
            }

            runAssert(0)
        })
    }

    runTest(test: any, groupKey: string) {
        let now = new Date().getTime()

        return new Promise((resolve, reject) => {
            this.testResults.testsAreRunning = true

            if (!this.testResults.tests[groupKey]) {
                Vue.set(this.testResults.tests, groupKey, {
                    pass: 0,
                    results: {},
                    running: true
                })
            }

            this.testResults.tests[groupKey].running = true

            let setResults = (res: any) => {
                this.testResults.tests[groupKey].running = false
                Vue.set(this.testResults.tests[groupKey].results, test.name, res)
                this.testResults.testsAreRunning = false

                if (res.pass) {
                    return resolve(res)
                }

                return reject(res)
            }

            let finishAssert = (res: any) => {
                let passed = true

                res.forEach((element: any) => {
                    if (!element.pass) {
                        passed = false
                    }
                })

                setResults({
                    pass: passed,
                    message: ``,
                    time: new Date().getTime() - now,
                    running: false,
                    results: res
                })
            }

            Vue.set(this.testResults.tests[groupKey].results, test.name, {
                pass: undefined,
                message: ``,
                time: 0,
                running: true
            })

            if (test.asserts && test.asserts.length) {

                this.runAsserts(test).then(finishAssert, finishAssert)

            } else if (test.fn && typeof test.fn === `function`) {
                test.fn()
                    .then((res: any) => {
                        setResults({
                            pass: true,
                            message: ``,
                            time: new Date().getTime() - now,
                            running: false,
                            results: res
                        })
                    }, (rej: any) => {
                        setResults({
                            pass: false,
                            message: rej,
                            time: new Date().getTime() - now,
                            running: false,
                            results: rej
                        })
                    })
            }
        })

    }

    runTestGroup(group: any) {

        return new Promise((resolve, reject) => {

            Vue.set(this.testResults.tests, group.name, {
                pass: undefined,
                results: {}
            })

            let setResults = (res: any, index: number) => {
                let cantUpdatePass = this.testResults.tests[group.name].pass === false
                let newPass = cantUpdatePass ? this.testResults.tests[group.name].pass : res.pass

                Vue.set(this.testResults.tests[group.name], `pass`, newPass)
                Vue.set(this.testResults.tests[group.name].results, group.tests[index].name, res)

                run(index + 1)
            }

            let run = (index: number) => {
                let now = new Date().getTime()

                if (group.tests[index]) {
                    this.runTest(group.tests[index], group.name)
                        .then((res: any) => {
                            setResults(res, index)
                        })
                        .catch((res: any) => {
                            setResults(res, index)
                        })

                } else {
                    resolve(this.testResults.tests[group.name])
                }
            }

            run(0)
        })

    }

    /**
     * @desc Runs all tests
     * @param test - testing param description
     */
    runTests(test?: { id: string }) {

        return new Promise((resolve, reject) => {

            let run = (index: number) => {
                let thisTest = this.tests[Object.keys(this.tests)[index]]

                if (thisTest) {
                    this.runTestGroup(thisTest)
                        .then((res: any) => {
                            Vue.set(this.testResults.tests, thisTest.name, res)
                            run(index + 1)
                        }, (rej: any) => {
                            Vue.set(this.testResults.tests, thisTest.name, rej)
                            run(index + 1)
                        })
                } else {
                    resolve(this.testResults.tests)
                }
            }

            run(0)
        })
    }

    getFormatedTime(timestamp: number) {
        if (timestamp < 1000) {
            return timestamp + `ms`
        }

        if (timestamp < 1000 * 60) {
            return (timestamp / 1000) + `s`
        }

        if (timestamp < 1000 * 60 * 60) {
            return (timestamp / 1000 * 60) + `m`
        }

        return ``
    }
}

export default new TestService()