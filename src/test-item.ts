import Vue from "vue"
import Component from "vue-class-component"
import { Prop } from "vue-property-decorator";
import documentationService from "./documentation-service"
import template from './test-item.html'
import './test-item.scss'
import testService from "./test-service";

@Component({
    template,
    propsData: {
        testKey: ``
    }
})

export default class TestItem extends Vue {

    name: string = 'test-item'
    service = documentationService
    testService = testService

    @Prop()
    testKey: string = this.testKey

    get test(){
        return this.testService.getTests(this.service.doc).tests[this.testKey] || {}
    }
}