import Vue from "vue"
import Component from "vue-class-component"
import { Prop } from "vue-property-decorator"

import service from '../documentation-service'
import testService from '../test-service'

import TableRenderer from "../table-renderer/table-renderer";

import template from './component-renderer.html'

@Component({
    template,
    components: {
        'table-renderer': TableRenderer
    },
    propsData: {
        'launch': () => { }
    }
})

export default class ComponentRenderer extends Vue {

    name: string = 'component-renderer'
    service = service
    testService = testService

    @Prop()
    launch: Function = this.launch

    get properties() {
        return {
            data: this.service.doc.children.properties,
            columns: [{
                key: 'name',
                label: 'name'
            }, {
                key: 'type',
                label: 'type',
                required: true
            }, {
                key: 'description',
                label: 'description',
                required: true
            }, {
                key: 'testCases',
                label: 'test cases'
            }]
        }
    }

    get methods() {
        return {
            data: this.service.doc.children.methods,
            columns: [{
                key: 'name',
                label: 'name'
            }, {
                key: 'description',
                label: 'description',
                required: true
            }, {
                key: 'arguments',
                label: 'arguments'
            }, {
                label: 'returns',
                key: 'returns'
            }, {
                key: 'testCases',
                label: 'test cases'
            }]
        }
    }

    get attributeProps() {
        return {
            data: this.service.doc.children.attributeProperties,
            columns: [{
                key: 'name',
                label: 'name'
            }, {
                key: 'type',
                label: 'type',
                required: true
            }, {
                key: 'description',
                label: 'description',
                required: true
            }, {
                key: 'testCases',
                label: 'test cases'
            }, {
                key: 'value',
                label: 'value'
            }]
        }
    }

    get gettersProps() {
        return {
            data: this.service.doc.children.getters,
            columns: [{
                key: 'name',
                label: 'name'
            }, {
                key: 'description',
                label: 'description',
                required: true
            }, {
                key: 'returns',
                label: 'returns'
            }, {
                key: 'testCases',
                label: 'test cases'
            }]
        }
    }
}