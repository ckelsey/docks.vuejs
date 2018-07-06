import Vue from "vue"
import Component from "vue-class-component"
import { Prop } from "vue-property-decorator"
import template from './doc-tests.html'
import documentationService from "./documentation-service"
import TestItem from './test-item'
import testService from "./test-service"

@Component({
    template,
    components: {
        'test-item': TestItem
    },
    propsData:{
        testGroup: ``
    }
})

export default class DocTests extends Vue {

    name: string = 'doc-tests'
    service = documentationService
    testService = testService

    @Prop()
    testGroup: string = this.testGroup

    get tests(){
        let tests = this.service.getThis(this.testService.tests, `${this.testGroup}.tests`, {})
        console.log(`tests`, tests);
        
        return tests
    }

    get groupName() {
        let name = this.service.docName(this.service.doc)
        console.log(`name`, name);
        
        return name
    }
}