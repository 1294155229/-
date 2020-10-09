import http from "@/common/luchApi/index.js";
export default {
	/**
	 * 功能: 获取当前用户的消息列表
	 * @param {页码}  pageNo
	 * @param {页面大小}  pageSize
	 */
	getSystemMessageList({pageNo, pageSize}){
		return http.get('/message/list', {
			pageNo,
			pageSize
		});
	},
	
	/**
	 * 功能: 获取系统消息详情
	 * @param {Object} id
	 */
	getSystemMessageDetailById({id}){
		return http.post('/message/readById', {id});
	},
	
	/**
	 * 功能: 查询用户的未读消息数量
	 */
	getUnReadMsgCount(){
		return http.get('/message/getMsgNum');
	}
}
