import Vue from "vue"
import Component from "vue-class-component"

import service from '../documentation-service'
import testService from "../test-service"

import TestItem from '../test-item/test-item'

import template from './test-section.html'
import './test-section.scss'

@Component({
    template,
    components: {
        'test-item': TestItem
    }
})

export default class TestSection extends Vue {

    name: string = 'test-section'
    service = service
    testService = testService

    showHideTest(testName: string) {
        this.testService.shownTestsState = this.testService.shownTestsState === testName ? `` : testName
    }

    getPassed(groupName: string) {
        return testService.testResults.tests[groupName].passCount
    }

    getTotal(groupName: string) {
        return testService.testResults.tests[groupName].total
    }

    getScoreNumber(groupName: string) {
        return this.getPassed(groupName) / this.getTotal(groupName)
    }

    getScore(groupName: string) {
        if (testService.testResults.tests[groupName]) {
            if (!isNaN(this.getScoreNumber(groupName))) {
                return ` : ${Math.round(this.getScoreNumber(groupName)) * 100}%`
            }
        }

        return ``
    }

    testsPassed(groupName: string) {
        return service.getThis(testService.testResults.tests, `${groupName}.pass`)
    }

    notCoveredMethods(group: any) {

        let noCoverage: Array<{ name: string, method: Function }> = []

        if (group.for) {            
            let serviceKeys = Object.getOwnPropertyNames(Object.getPrototypeOf(group.for))
            serviceKeys = serviceKeys.concat(Object.keys(group.for))

            if (serviceKeys){
                serviceKeys.forEach(key => {
                    if (key === `constructor`) {
                        return
                    }

                    let hasTest = false

                    if (group.tests){
                        group.tests.forEach((test: any) => {
                            if (test.for) {
                                if (typeof test.for === `string` && test.for === key) {
                                    hasTest = true
                                }

                                if (Array.isArray(test.for) && test.for.indexOf(key) > -1) {
                                    hasTest = true
                                }
                            } else {
                                if (typeof test.name === `string` && test.name === key) {
                                    hasTest = true
                                }
                            }
                        })
                    }

                    if (!hasTest) {
                        noCoverage.push({
                            name: key,
                            method: group.for[key]
                        })
                    }
                })
            }
        }

        return noCoverage
    }
}