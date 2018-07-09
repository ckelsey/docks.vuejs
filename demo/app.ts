import Vue from "vue"
import Component from "vue-class-component"
import Docks from '../src/documentation'
import demoTests from './test'
import serviceTests from './tests2'

import ComponentRenderer from '../src/component-renderer'
import DocSidebar from "../src/doc-sidebar"
import JSONViewer from "../src/json-viewer"
import ServiceRenderer from "../src/service-renderer"
import TableRenderer from "../src/table-renderer"
import TestItem from "../src/test-item"
import TestSection from "../src/test-section"
import ValueInput from "../src/value-input"

const DocsData = require('./docs/docsData.json')

@Component({
    template: `<documentation :docs="DocksData" :tests="tests" :componentClasses="componentClasses"></documentation>`,
    components:{
        'documentation': Docks
    }
})

export default class Demo extends Vue {

    name: string = 'App'
    DocksData = DocsData
    tests = {
        Demo: demoTests,
        TestService: serviceTests
    }

    componentClasses = {
        'component-renderer': ComponentRenderer,
        'doc-sidebar': DocSidebar,
        'documentation': Docks,
        'json-viewer': JSONViewer,
        'service-render': ServiceRenderer,
        'table-renderer': TableRenderer,
        'test-item': TestItem,
        'test-section': TestSection,
        'value-input': ValueInput
    }
}