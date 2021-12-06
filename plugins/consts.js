import Vue from 'vue'

export default ({ app }, inject) => {
    inject('consts', Vue.observable({
        title: '鬼斩的 Maven 构建页面'
    }))
}
