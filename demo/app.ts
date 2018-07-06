import Vue from "vue"
import Component from "vue-class-component"
import Docks from '../src/documentation'
import demoTests from './test'
const DocsData = require('./docs/docsData.json')

@Component({
    template: `<documentation :docs="DocksData" :tests="tests"></documentation>`,
    components:{
        'documentation': Docks
    }
})

export default class Demo extends Vue {

    name: string = 'App'
    DocksData = DocsData
    tests = {
        Demo: demoTests
    }

}