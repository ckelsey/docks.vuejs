import Vue from "vue"
import Component from "vue-class-component"
import { Prop } from "vue-property-decorator"

import service from './documentation-service'
import testService from './test-service'

import TableRenderer from "./table-renderer";

import template from './component-renderer.html'
import './component-renderer.scss'

@Component({
    template,
    components: {
        'table-renderer': TableRenderer
    },
    propsData: {
        'launch':()=>{}
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
            data: this.service.doc.data,
            columns: [{
                key: 'name',
                label: 'name'
            }, {
                key: 'type',
                label: 'type'
            }, {
                key: 'description',
                label: 'description'
            }]
        }
    }

    get methods() {
        return {
            data: this.service.doc.methods,
            columns: [{
                key: 'name',
                label: 'name'
            }, {
                key: 'description',
                label: 'description'
            }, {
                key: 'params',
                label: 'arguments'
            }, {
                label: 'returns',
                key: 'returns'
            }]
        }
    }

    get attributeProps() {
        return {
            data: this.service.doc.props,
            columns: [{
                key: 'name',
                label: 'name'
            }, {
                key: 'type',
                label: 'type'
            }, {
                key: 'description',
                label: 'description'
            }, {
                key: 'value',
                label: 'value'
            }]
        }
    }

    get computedProps() {
        return {
            data: this.service.doc.computed,
            columns: [{
                key: 'name',
                label: 'name'
            }, {
                key: 'description',
                label: 'description'
            }, {
                key: 'returns',
                label: 'returns'
            }]
        }
    }
}