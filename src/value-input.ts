import Vue from "vue"
import Component from "vue-class-component"
import { Prop, Watch } from "vue-property-decorator"
import template from './value-input.html'
import documentationService from "./documentation-service"

@Component({
    template,
    propsData: {
        model: {}
    }
})

export default class ValueInput extends Vue {

    name: string = 'value-input'
    service = documentationService

    @Prop()
    model: any = this.model

    proxyModel = ``

    getProxyModel() {
        switch (this.type) {
            case `string`:
                return this.model.value ? this.model.value.toString() : ``
            case `number`:
                return this.model.value ? parseFloat(this.model.value) : 0
            case `boolean`:
                return this.model.value

            default:
                let val = this.model.value

                try {
                    val = JSON.stringify(this.model.value)
                } catch (error) { }

                return val || `{}`
        }
    }

    get type() {
        return this.model.type || this.model.kind || `string`
    }

    updateVal() {
        let value = this.proxyModel

        switch (this.type) {
            case `string`:
                this.model.value = value ? value.toString() : ``
                break
            case `number`:
                this.model.value = value ? parseFloat(value) : 0
                break
            case `boolean`:
                this.model.value = !!value
                break

            default:
                try {
                    value = JSON.parse(value)
                } catch (error) { }

                this.model.value = value || {}
        }
    }

    mounted(){
        this.proxyModel = this.getProxyModel()
    }
}