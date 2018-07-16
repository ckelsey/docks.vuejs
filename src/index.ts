import Vue from 'vue'
import Doc from './documentation/documentation'

export default {
    install(Vue: any, options: any) {
        Vue.component('documentation', Doc)
    }
}