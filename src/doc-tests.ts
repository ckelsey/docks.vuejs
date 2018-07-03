import Vue from "vue"
import Component from "vue-class-component"
import template from './doc-tests.html'
import documentationService from "./documentation-service"
import TestItem from './test-item'
import testService from "./test-service";
// import './test-item.scss'

@Component({
    template,
    components: {
        'test-item': TestItem
    }
})

export default class DocTests extends Vue {

    name: string = 'doc-tests'
    service = documentationService
    testService = testService

    get tests(){
        return this.testService.getTests(this.service.doc)
    }
}