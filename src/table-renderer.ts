import Vue from "vue"
import Component from "vue-class-component"
import { Prop } from "vue-property-decorator"
import template from './table-renderer.html'
import documentationService from "./documentation-service"
import ValueInput from './value-input'
import JSONViewer from './json-viewer'
import './table-renderer.scss'

@Component({
    template,
    propsData: {
        show: false,
        properties: {}
    },
    components: {
        'json-viewer': JSONViewer,
        'value-input': ValueInput
    }
})

export default class TableRenderer extends Vue {

    name: string = 'table-renderer'
    service = documentationService

    @Prop()
    show: boolean = this.show

    @Prop()
    properties: any = this.properties
}