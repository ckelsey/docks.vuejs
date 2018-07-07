import Vue from "vue"
import Component from "vue-class-component"

import service from './documentation-service'
import testService from './test-service'

import TableRenderer from "./table-renderer";

import template from './service-renderer.html'
import './service-renderer.scss'

@Component({
    template,
    components: {
        'table-renderer': TableRenderer
    }
})

export default class ServiceRenderer extends Vue {

    name: string = 'service-renderer'
    service = service
    testService = testService

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
}