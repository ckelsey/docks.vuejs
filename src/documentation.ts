import Vue from "vue"
import Component from "vue-class-component"
import { Prop } from "vue-property-decorator"

import DocumentationService from './documentation-service'

import TestSection from './test-section'
import TestItem from './test-item'
import DocSidebar from './doc-sidebar'
import ServiceRenderer from './service-renderer'

import template from './documentation.html'
import './documentation.scss'
import testService from "./test-service";

@Component({
    template,
    propsData:{
        docs: {},
        tests: {}
    },
    components: {
        'test-item': TestItem,
        'doc-sidebar': DocSidebar,
        'test-section': TestSection,
        'service-renderer': ServiceRenderer
    }
})

export default class Documentation extends Vue {

    name: string = 'documentation'
	service = DocumentationService
	components: {[key: string]: any} = this.components

    @Prop()
    docs: any = this.docs

    @Prop()
    tests: any = this.tests

    launch(doc: any) {
        let propsData: { [key: string]: any } = {}
        let container = document.getElementById(`demo-overlay`)

        if (container) {
            container.innerHTML = ``

            if(this.components){
            	let _Class = this.components[doc.meta.name.default]

				if (_Class) {
					DocumentationService.states.demoOverlay = true

					for (var p in doc.props) {
						if (doc.props[p]) {
							switch (doc.props[p].type) {
								case 'Function':
									propsData[p] = new Function(doc.props[p].value)
									break

								default:
									propsData[p] = doc.props[p].value
									break
							}
						}
					}

					let Class = Vue.extend(_Class)
					let Instance = new Class({ propsData })

					Instance.$mount()
					container.appendChild(Instance.$el)
				}   
            }
        }
    }

    mounted(){
        this.service.setDocs(this.docs)
        testService.setTests(this.tests)
    }
}