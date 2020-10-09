/**
 * @description 开发环境的根路径配置
 */

const host = 'http://192.168.0.191:8080';
// const host = 'http://8.129.59.68:8080';

// 请求根路径，必须填写
const API_BASE_URL = `${host}/muqiangbao/api/v1`;

// 图片的根路径
const IMG_BASE_URL = 'https://muqiangbao.oss-cn-shenzhen.aliyuncs.com/';

// 图片上传的接口路径
const IMG_UPLOAD_URL = `${host}/muqiangbao/api/v1/common/uploadImageAli`;

// 资源升级的下载路径
const RESOURCE_DOWNLOAD_URL = `${host}/muqiangbao/static/mqb.wgt`;

// 分享的跟路径
const SHARE_BASE_URL = 'https://www.baidu.com';

// 分享出去页面的访问根路径
const DOWNLOAD_BASE_URL = 'https://www.baidu.com';

export default {
	API_BASE_URL,
	IMG_BASE_URL,
	IMG_UPLOAD_URL,
	SHARE_BASE_URL,
	RESOURCE_DOWNLOAD_URL,
	DOWNLOAD_BASE_URL
}
