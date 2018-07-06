import Vue from 'vue'

// SERVICES
import DocumentationService from './documentation-service'

class TestService {
    doc: any = {}
    openedDoc: string = 'doc-active-dropdown'
    testResults: any = {
        testsAreRunning: false,
        tests: {}
    }

    tests: any = {}

    setTests(tests: any) {
        this.tests = tests
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

    hasTestAsserts(doc: string, testName: string) {

        if (!doc) {
            return undefined
        }

        return DocumentationService.getThis(this.testResults.tests, `${doc}.results.${testName}.results`)
    }

    isTestRunning(doc: string, testName: string) {

        if (!doc) {
            return undefined
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
        return new Promise((resolve, reject)=>{
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
                                test.results.push({ pass: true, message: res.toString(), key })
                                runAssert(index + 1)
                            })
                            .catch(res => {
                                test.results.push({ pass: false, message: res.toString(), key })
                                runAssert(index + 1)
                            })
                    } else {
                        test.results.push({ pass: val, message: val.toString(), key })
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
                    total: this.tests[groupKey] ? this.tests[groupKey].length : 0,
                    pass: 0,
                    results: {}
                })
            }

            let setResults = (res: any) => {
                Vue.set(this.testResults.tests[groupKey].results, test.name, res)
                this.testResults.testsAreRunning = false

                if (res.pass) {
                    this.testResults.tests[groupKey].pass = this.testResults.tests[groupKey].pass + 1
                    return resolve(res)
                }

                return reject(res)
            }

            Vue.set(this.testResults.tests[groupKey].results, test.name, {
                pass: undefined,
                message: ``,
                time: 0,
                running: true
            })

            if (test.asserts && test.asserts.length) {
                this.runAsserts(test)
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

            let results: any = {
                total: group.tests.length,
                pass: 0,
                results: {}
            }

            let run = (index: number) => {
                let now = new Date().getTime()

                if (group.tests[index]) {
                    this.runTest(group.tests[index], group.name)
                        .then((res: any) => {
                            results.pass++
                            results.results[group.tests[index].name] = res
                            run(index + 1)
                        })
                        .catch((res: any) => {
                            results.results[group.tests[index].name] = res
                            reject(results)
                        })

                } else {
                    resolve(results)
                }
            }

            run(0)
        })

    }

    runTests() {

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
                            resolve(this.testResults.tests)
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