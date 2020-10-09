import Vue from 'vue'
import App from './App'

// 引入uview-ui组件库
import uView from 'uview-ui';
Vue.use(uView);

// 引入Vuex
import store from '@/store/index.js';
Vue.prototype.$store = store;

// 引入请求库, 使用方式示例: this.$http.getUserinfo().then()
import http from '@/common/luchApi/api.js';
Vue.use(http);

// 引入工具函数库
import helperUtil from '@/utils/helper.js';
Vue.prototype.$helper = helperUtil;

// 全局注册加载提示组件
import uniLoadMore from '@/components/uniapp-components/uni-load-more/uni-load-more.vue';
Vue.component('uniLoadMore', uniLoadMore);

// 全局注册空数据提示组件
import noData from '@/components/mqb-components/no-data.vue';
Vue.component('noData', noData);

import appPhoneInfo from '@/utils/appPhoneInfo.js' //封装了获取手机型号和版本号

Vue.config.productionTip = false
App.mpType = 'app';
const app = new Vue({
	store,
    ...App
})
app.$mount()
