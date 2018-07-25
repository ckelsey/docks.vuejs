import Vue from "vue"
import Component from "vue-class-component"
import { Prop } from "vue-property-decorator"
import documentationService from "../documentation-service"
import template from './test-item.html'
import './test-item.scss'
import testService from "../test-service"

@Component({
    template,
    propsData: {
        testKey: ``,
        testGroup: ``,
        testType: ``
    }
})

export default class TestItem extends Vue {

    name: string = 'test-item'
    service = documentationService
    testService = testService

    @Prop()
    testKey: string = this.testKey

    @Prop()
    testType: string = this.testType

    @Prop()
    testGroup: string = this.testGroup

    get test(){
        let test = this.service.getThis(this.testService.tests, `${this.testType}.${this.testGroup}.tests.${this.testKey}`, {})
        return test
    }

    get testPath() {
        return `${this.testType}.${this.testGroup}`
    }
}