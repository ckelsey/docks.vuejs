import Vue from "vue"
import Component from "vue-class-component"
import { Prop } from "vue-property-decorator"

import DocumentationService from '../documentation-service'
import testService from "../test-service"

import TestSection from '../test-section/test-section'
import TestItem from '../test-item/test-item'
import DocSidebar from '../doc-sidebar/doc-sidebar'
import ComponentRenderer from '../component-renderer/component-renderer'

import template from './documentation.html'
import './documentation.scss'

@Component({
    template,
    propsData:{
        docs: {},
        tests: {},
        componentClasses: {}
    },
    components: {
        'test-item': TestItem,
        'doc-sidebar': DocSidebar,
        'test-section': TestSection,
        'component-renderer': ComponentRenderer
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

    @Prop()
    componentClasses: any = this.componentClasses

    launch(doc: any) {

        if(!doc){
            doc = this.service.doc
        }

        if(!doc){
            return
        }

        let propsData: { [key: string]: any } = {}
        let container = document.getElementById(`demo-overlay`)

        if (container) {
            container.innerHTML = ``

            if (this.componentClasses){
                let _Class = this.componentClasses[doc.name]

				if (_Class) {
					DocumentationService.states.demoOverlay = true

                    for (var p in doc.children.attributeProperties) {
                        if (doc.children.attributeProperties[p]) {
                            switch (doc.children.attributeProperties[p].type) {
								case 'Function':
                                    propsData[p] = new Function(doc.children.attributeProperties[p].value)
									break

								default:
                                    propsData[p] = doc.children.attributeProperties[p].value
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