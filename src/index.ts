import Vue from 'vue'
import Doc from './documentation'

export default {
    install(Vue:any, options:any) {
        Vue.component('documentation', Doc)
    }
}