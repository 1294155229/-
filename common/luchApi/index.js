// 引入工具函数
import {
	objToUrl,
	urlToObj
} from '@/common/luchApi/util.js';

// 引入请求的全局配置{baseUrl}
import globalConfig from "@/common/config.js" //导入基础路径

// 引入请求库
import Request from '@/common/luchApi/request.js';

// 创建请求实例
const http = new Request();
import store from '@/store/index.js';

// 请求的全局配置
http.setConfig((config) => {
	/* 请求的根路径 */
	config.baseUrl = globalConfig.baseUrl;
	return config;
})

// 请求拦截器，在发送请求之前做点什么
http.interceptor.request((config, cancel) => {
	uni.showLoading({
		title:"加载中...",
		mask:true
	})
	//过滤不需要token的接口
	if (config.url.indexOf('user/login') >= 0 ||
		config.url === 'user/register' ||
		config.url == 'sms/testSend' ||
		config.url == 'user/bindMobile' ||
		config.url == 'user/mobileThirdLogin'
	) {
		return config;
	} else {
		config.header = {
			...config.header,
			// 'X-AUTH-TOKEN': '1'
			// 'X-AUTH-TOKEN': ''
		}
		// if (!config.header.TOKEN) {
		//     cancel('token 不存在', config) 
		// }
		var token = uni.getStorageSync('user_token');
		// console.log(token)
		config.header['TOKEN'] = token;
		// config.header['TOKEN'] = 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ7XCJjbGllbnRcIjoyLFwib3BlbklkXCI6XCJcIixcInBob25lXCI6XCIxOTk0MDU2MTk0MVwiLFwidXNlcklkXCI6XCI3MDc1ODg0MjQ3ODUxOTkxMDRcIn0iLCJ1c2VySWQiOiI3MDc1ODg0MjQ3ODUxOTkxMDQiLCJwaG9uZSI6IjE5OTQwNTYxOTQxIiwiY2xpZW50IjoyLCJleHAiOjE1ODk5NjkwNjR9.Do8F6HSk20LS9uPPr7l_3xNZHR0AWf5T2YSTARNpIdIAdiKIjWlr8LDtW8dPmHc_jXtKDSpwH2rOaBlCpVZmw2e7Bers4rUipOs47k0tV5lV9vE82PE4Ie-W9Oe4WxIgO8EkpCGPhb4h6lBP6PN4YGvOvQuyAhgzf6fh-sd_kkfbkNOtw1j7YbjRGJWrFGm95aiqWpLNkE3lMGEimV_Rn5djGTvxRxUVI6f1g1meMJdj-NXp4ndLC_Nr3m6FigmYvuHE0UyVWypM7aLpcWghAaOcDsCXVAtxVyCXs4ddinAskoVkCpzLdewg-hm-GbUfyXgB0wNjDYJTh9i5zpQDyg';
		// 异步设置不能用
		// uni.getStorage({
		// 	key: 'user_token',
		// 	success: res => {
		// 		console.log(res)
		// 		// 给所有请求添加自定义header
		// 		config.header['TOKEN'] = res.data;
		// 		if (config.url === 'user/getMsgCount' || config.url === 'user/queryUserById') {
		// 			return config;
		// 		} else {
		// 			// uni.showLoading({
		// 			// 	title: '加载中...',
		// 			// 	mask: true
		// 			// });
		// 			return config;
		// 		}
		// 		console.log(config)
		// 		return config
		// 	},
		// 	fail: err => {
		// 		//终止请求
		// 		console.log(err.errMsg + '~~~API配置打印：尚未登录~~~');
		// 	}
		// });
		// console.log("config555",config)
		// return config
	}
	// console.log("config666",config)
	return config;
})

//路由守卫添加
http.interceptor.response((response) => {
	uni.hideLoading()
	/**
	 * @param {code}
	 * 0:请求报错，直接弹框提示
	 * 1:请求成功，处理数据，进行页面交互
	 * 2:用户登录失效，提示登录失效，自动跳转登录。
	 * */
	if (response.data.code == 1 || response.data.code == 3 || response.data.code == 4) {
		return response.data
	} else if (response.data.code == 2) { // 一般后台返回code为2时做未登录处理
		// store.commit('clearStoreState');
		uni.removeStorageSync("user_token")
		// uni.showToast({
		// 	title: '登录失效 请重新登录',
		// 	icon: 'none',
		// 	duration: 1500
		// })
		store.dispatch('initUser', null);
		// uni.navigateTo({
		// 	url: "/pages/views/login/login"
		// })
		return response.data
	} else if (response.data.code == 0) {
		if(response.data.msg){
			uni.showToast({
				icon: 'none',
				title: response.data.msg,
				duration: 1500,
				complete: () => {}
			});
		}
		return response.data
	} else if(response.data.code == 500){
		uni.showToast({
			icon: 'none',
			title: response.data.message,
			duration: 1500,
			complete: () => {}
		});
	} else {
		// if(response.data.msg=='手机号不存在'){

		// }else {
		// 	uni.showToast({
		// 		icon: 'none',
		// 		title: response.data.msg || '数据返回异常',
		// 		duration: 2000,
		// 		complete: () => {}
		// 	});
		// }

		return response.data
	}

}, (response) => { /*  对响应错误做点什么 （statusCode !== 200），必须return response*/
	// console.log('对响应错误做点什么',response);
	return response;
})

export default http;
