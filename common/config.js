/**
 * @Author: ying
 * @createTime: 2020-8-21
 * @updateTime: 2020-8-21
 * @description: 配置文件入口，便于统一调用以及修改。
 */

// 引入开发环境的配置
import devConfig from '@/common/devConfig.js';

// 引入生产环境的配置
import prodConfig from '@/common/prodConfig.js';

// 区分环境
const environment = process.env.NODE_ENV;
let configObj = {
	'development': devConfig,
	'production': prodConfig
}

// 全局配置的请求基准路径，此处参数在luchApi/index.js中使用
export default {
	baseUrl: configObj[environment]['API_BASE_URL'],
}

// 项目中需要使用的全局基准路径，此处参数在luchApi/api.js中使用
export const globalConfig = configObj[environment];
