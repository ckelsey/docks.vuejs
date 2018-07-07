import Vue from "vue"
import Component from "vue-class-component"
import { Prop } from "vue-property-decorator"
import template from './json-viewer.html'
import JSONFormatter from 'json-formatter-js'
import './json-viewer.scss'

@Component({
    template,
    propsData: {
        json: {}
    }
})

export default class JSONViewer extends Vue {

    name: string = 'json-viewer'

    @Prop()
    json: any = this.json

    jsonViewer(json:any) {
        const formatter = new JSONFormatter(json, 0, {
            hoverPreviewEnabled: false,
            hoverPreviewArrayCount: 100,
            hoverPreviewFieldCount: 5,
        });

        this.$el.innerHTML = ''
        this.$el.appendChild(formatter.render());
    }

    get newJson(){
        return this.jsonViewer(this.json)
    }

    mounted() {
        this.jsonViewer(this.json)
    }
}