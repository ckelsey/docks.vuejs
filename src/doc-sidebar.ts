import Vue from "vue"
import Component from "vue-class-component"

import service from './documentation-service'
import testService from './test-service'

import template from './doc-sidebar.html'
import './doc-sidebar.scss'

@Component({
    template
})

export default class DocSidebar extends Vue {

    name: string = 'doc-sidebar'
    service = service
    testService = testService
}