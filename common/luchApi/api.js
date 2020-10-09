/**
 * @description 项目所有请求模块的入口
 */

// 引入新创建的请求对象
import http from '@/common/luchApi/index.js';

// 引入全局的基础路径
import {
	globalConfig
} from '@/common/config.js';


// 引入公共请求模块
import commonAPI from '@/common/luchApi/modules/commonAPI.js';

// 引入用户相关请求
import userAPI from '@/common/luchApi/modules/userAPI.js';

// 引入消息相关请求
import msgAPI from '@/common/luchApi/modules/msgAPI.js';

// 引入订单相关请求
import orderAPI from '@/common/luchApi/modules/orderAPI.js';

// 引入会员相关请求
import vipAPI from '@/common/luchApi/modules/vipAPI.js';

// 引入项目的列表相关请求
import listAPI from '@/common/luchApi/modules/listAPI.js';

// 引入其他相关请求


const API = {
	// 全局的基础路径
	...globalConfig,

	// 引入请求的方法
	...commonAPI,
	...userAPI,
	...msgAPI,
	...orderAPI,
	...vipAPI,
	...listAPI
}

// 暴露为一个vue插件，在main.js通过Vue.use的方式使用即可
export default {
	install(Vue, options) {
		Vue.prototype.$http = API;
	}
}
