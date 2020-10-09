import http from "@/common/luchApi/index.js";
export default {
	/**
	 * 功能: 查询首页轮播图
	 */
	getBanner() {
		return http.get('/index/queryBanners');
	},

	/**
	 * 功能: 查询首页图标列表
	 */
	getIconList() {
		return http.get('/index/queryIcons');
	},

	/**
	 * 功能: 根据一级分类ID查询二级分类
	 * @param {Object} iconId
	 */
	getSecondClassifyList(iconId) {
		return http.get('/info/queryClassifys', {
			iconId
		});
	},
	getSecondClassissueInfo(data) {
		return http.post('/info/issueInfo', data);
	},
	
	//用户的评论
	getSecondqueryEvaluateByInfoId({
		infoId,
		pageNo,
		pageSize
	}) {
		return http.get('/evaluate/queryEvaluateByInfoId', {
			infoId,
			pageNo,
			pageSize
		});
	},
	
	/**
	 * 功能: 查询用户的评论信息
	 * @param {String} type
	 * @param {String} pageNo
	 * @param {String} pageSize
	 */
	getUserCommentList({type, pageNo, pageSize}){
		return http.get('/evaluate/myEvaluate', {
			type, pageNo, pageSize
		})
	},
	
	/**
	 * 功能: 根据ID删除我的评论
	 * @param {Object} id
	 */
	delUserComment({id}){
		return http.get('/evaluate/deleteEvaluateById', {
			id
		});
	},
	
	/**
	 * 功能: 查询全部的信息列表
	 * @param {String} iconId   一级分类ID
	 * @param {String} classifyIds  二级分类ID
	 * @param {String} title  搜索关键字
	 * @param {String} sort  排序:  0-最新发布 1-离我最近
	 * @param {String} state  工作状态：0-闲 1-忙 
	 * @param {String}  longitude  经度
	 * @param {String}  latitude  纬度
	 * @param {Number} pageNo
	 * @param {Number} pageSize
	 */
	getInfoList({
		iconId,
		classifyIds,
		title,
		sort,
		state,
		cityName,
		longitude,
		latitude,
		pageNo,
		pageSize
	}) {
		return http.get('/info/search', {
			iconId,
			classifyIds,
			title,
			sort,
			state,
			cityName,
			longitude,
			latitude,
			pageNo,
			pageSize
		});
	},
	//添加评论
	getInfoaddEvaluates(data) {
		return http.post('/evaluate/addEvaluate', data);
	},
	//编辑
	getInfoaddEvaluaeditInfo(data) {
		return http.post('/info/editInfo', data);
	},
	/**
	 * 功能: 个人中心我的发布
	 * @param {String} iconId
	 * @param {String} classifyIds
	 * @param {String} pageNo
	 * @param {String} pageSize
	 */
	getUserInfoList({
		iconId,
		classifyIds,
		pageNo,
		pageSize
	}) {
		return http.get('/instruction/queryMyIssue', {
			iconId: iconId ? iconId : '',
			classifyIds: classifyIds ? classifyIds : '',
			pageNo: pageNo ? pageNo : '',
			pageSize: pageSize ? pageSize : ''
		});
	},

	/**
	 * 功能: 查询信息详情
	 * @param {Object} id
	 */
	getInfoDetail({
		id
	}) {
		return http.get('/info/queryInfoById', {
			id
		});
	},

	/**
	 * 功能: 全部发布操作
	 * @param {String} address   地址
	 * @param {String} brand   品牌
	 * @param {String} iconId  一级分类ID
	 * @param {String} classifyIds  二级分类ID 
	 * @param {String} contactName  联系人姓名
	 * @param {String} contactWay  联系方式
	 * @param {String} eduRequire  学历要求
	 * @param {String} firstWorkAddr  优先考虑工作地点
	 * @param {String} imgUrls   图片地址
	 * @param {String} intro  简介、内容
	 * @param {String} jobDuty  岗位职责
	 * @param {String} jobRequire  	岗位要求
	 * @param {String} projectCase  工程案例
	 * @param {String} remark  备注
	 * @param {String} runRange  经营范围
	 * @param {String} salaryRange  薪资范围
	 * @param {String} state  工作状态： 0-闲 1-忙
	 * @param {String} teamNum  队伍人数
	 * @param {String} title  所有的标题、名称、找人工的姓名，用这个字段
	 * @param {String} workTime  工作年限
	 */
	sendInfo({
		address,
		brand,
		iconId,
		classifyIds,
		contactName,
		contactWay,
		eduRequire,
		firstWorkAddr,
		imgUrls,
		intro,
		jobDuty,
		jobRequire,
		projectCase,
		remark,
		runRange,
		salaryRange,
		state,
		teamNum,
		title,
		workTime
	}) {
		return http.post('/info/issueInfo', {
			address,
			brand,
			iconId,
			classifyIds,
			contactName,
			contactWay,
			eduRequire,
			firstWorkAddr,
			imgUrls,
			intro,
			jobDuty,
			jobRequire,
			projectCase,
			remark,
			runRange,
			salaryRange,
			state,
			teamNum,
			title,
			workTime
		});
	},

	/**
	 * 功能: 根据ID删除信息
	 * @param {String} id  信息ID
	 */
	delInfoById({
		id
	}) {
		return http.get('/info/deleteInfoById', {
			id
		});
	},

	/**
	 * 功能: 更新信息状态
	 * @param {String} id  信息ID
	 * @param {String} state  工作状态： 0-闲 1-忙
	 */
	changeState({
		id,
		state
	}) {
		return http.get('/info/changeState', {
			id,
			state
		});
	}

}
