import http from "@/common/luchApi/index.js";
export default {
	
	/**
	 * 功能: 发送验证码
	 * @param {String} mobile 手机号码
	 * @param {String} event 验证码类型 
	 * 'login': 验证码登录 
	 * 'register': 注册
	 * 'forget': 忘记密码
	 * 'changePhone': 修改手机号
	 * 'bindPhone': 绑定手机号码
	 */
	sendSms: function({mobile, event}) {
		return http.post('/sms/aliSend', {
			mobile,
			event
		});
	},
	
	/**
	 * 功能: 获取协议和条款
	 * @param {String} type 协议类型
	 * 1: 用协议和隐私政策 
	 * 2: 使用条款
	 * 3: 注册协议
	 */
	getAgreement({type}){
		return http.get('/instruction/queryTerms', {
			type
		});
	},
	
	/**
	 * 功能: 检测版本更新
	 * @param {String} type 系统类型 1:Andorid 2:IOS
	 * @param {String} version 版本号
	 */
	doUpdateAPI({type, version}){
		return http.get('/app/version/checkUpdate', {
			type,
			version
		});
	},

	

	/**
	 * 实名认证：添加记录
	 * @param {String} identityAgainstUrl  身份证反面的图片地址
	 * @param {String} identityCard   身份证号
	 * @param {String} identityJustUrl  身份证正面的图片地址
	 * @param {String} identityName  身份证姓名
	 * @param {String} mobile   手机号
	 * @param {String} verificationCode  验证码
	 */
	realNameAdd(identityAgainstUrl, identityCard, identityJustUrl, identityName, mobile, verificationCode) {
		return http.post("identity/identity/add", {
			identityAgainstUrl,
			identityCard,
			identityJustUrl,
			identityName,
			mobile,
			verificationCode
		})
	},

	/**
	 * 功能: 解析图片得到身份证上面的信息
	 * @param {String} identityType  身份证的正反面标记，正面:'front' 反面:''
	 * @param {String} imageUrl  身份证上传后返回的图片地址
	 */
	realNameGetCardInfo(identityType, imageUrl) {
		return http.get("identity/identity/realNameAuthentication", {
			identityType,
			imageUrl
		})
	},

	/**
	 * 功能: 执行认证添加之前的校验
	 * @param {String} name  表单中获取的真实姓名
	 * @param {String} idCard  表单中获取的身份证号码
	 */
	realNameAuthentication(name, idCard) {
		return http.get('identity/identity/identityCard', {
			name,
			idCard,
		})
	},
	
	/**功能: 获取当前系统版本
	 * @param {Object} type
	 */
	queryLastVersion({type}){
		return http.get('/app/version/queryLastVersion', {
			type
		});
	}
}
