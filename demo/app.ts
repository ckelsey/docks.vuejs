import Vue from "vue"
import Component from "vue-class-component"
import Docks from '../src/documentation/documentation'

import ComponentRenderer from '../src/component-renderer/component-renderer'
import DocSidebar from "../src/doc-sidebar/doc-sidebar"
import JSONViewer from "../src/json-viewer/json-viewer"
import TableRenderer from "../src/table-renderer/table-renderer"
import TestItem from "../src/test-item/test-item"
import TestSection from "../src/test-section/test-section"
import ValueInput from "../src/value-input/value-input"

import Tests from './tests/tests'
import documentationService from "../src/documentation-service";

@Component({
    template: `<documentation :docs="DocksData" :tests="tests" :componentClasses="componentClasses" :initial="'about.tldr;'"></documentation>`,
    components:{
        'documentation': Docks
    }
})

export default class Demo extends Vue {

    name: string = 'App'
    DocksData = require('./docks/docks.json')
    tests = Tests
    componentClasses = {
        'component-renderer': ComponentRenderer,
        'doc-sidebar': DocSidebar,
        'documentation': Docks,
        'json-viewer': JSONViewer,
        'table-renderer': TableRenderer,
        'test-item': TestItem,
        'test-section': TestSection,
        'value-input': ValueInput
    }

    created(){
        this.DocksData.about = {
            "tldr":{
                name: "tldr;",
                description: "Summary about the codebase",
                body: `
                    <ul>
                        <li>It's super cool</li>
                        <li>Holla, shot calla</li>
                    </ul>
                `
            }
        }
    }
}