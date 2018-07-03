import Vue from "vue"
import Component from "vue-class-component"

import service from './documentation-service'
import testService from "./test-service";

import template from './test-section.html'
import './test-section.scss'

@Component({
    template
})

export default class TestSection extends Vue {

    name: string = 'test-section'
    service = service
    testService = testService
}