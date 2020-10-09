<template>
	<view>
		<!-- 头部信息区域 -->
		<view class="section-list">
			<detailTop :type="type" :item="detailObj"></detailTop>
		</view>

		<!-- 中间的内容展示 -->
		<detailCont :type="type" :item="detailObj"></detailCont>

		<!-- 底部的评论模块 -->
		<view class="comment">
			<view class="title-box"><view class="title">全部评论（{{plarraydata.total}}）</view></view>
			
			<!-- 单个评论项 -->
			<view class="comment-item" v-for="(item, index) in plarraydata.records" :key="index">
				<u-image class="comment-user-photo" :src="$http.IMG_BASE_URL+item.avatar" width="64" height="64" border-radius="1000"></u-image>
				<view class="comment-right u-border-bottom">
					<view class="line1">
						<view class="comment-user-nickname">{{item.nickname}}</view>
						<view class="comment-time">{{item.createTime.substring(0, 10)}}</view>
					</view>
					<view class="comment-cont huanhan">{{item.content}}</view>
					<view class="reply-btn" @click="choicedata(item)">回复</view>
					<view class="reply-box" v-for="(items,indexdata) in item.secondEvaluates" :key="indexdata">
						<view class="reply-user">
							<u-image class="img" :src="$http.IMG_BASE_URL+items.avatar" width="48" height="48" border-radius="1000"></u-image>
							<view class="username">{{items.nickname}}</view>
						</view>
						<view class="reply-cont">{{items.content}}</view>
					</view>
				</view>
			</view>
			
			<!-- 展开查看更多 -->
			<view class="look-more" v-if="plarraydata.total!=0">
				<view class="u-text-center" @click="numdata">
					<view class="more-text">展开评论</view>
					<image class="more-img" src="/static/image/common/arrow_down.png" mode=""></image>
				</view>
			</view>
			<view style="height:100rpx"></view>
		</view>
		<view class="all_input">
		
			<input type="text" placeholder="请输入" v-model="pltexts" @blur="showfocus=!showfocus" :focus='showfocus'/>
			<image src="../../../../static/image/index/addpl.png" mode="" @click="addpldata"></image>
			<!-- <img src="/static/image/index/addpl.png" alt="" > -->
		</view>
	</view>
</template>

<script>
import detailTop from '@/components/mqb-components/detail-top.vue';
import detailCont from '@/components/mqb-components/detail-cont.vue';
export default {
	components:{
		detailTop,
		detailCont
	},
	data(){
		return {
			addchoicedata:{},
			pltexts:'',
			type: '1',
			id: '',
			detailObj: {},
			plarraydata:[],
			showfocus:false,
			numdatas:1
		}
	},
	onLoad({id, type}) {
		this.type = type;
		this.id = id;
		this.getDetail();
	},
	methods: {
		numdata(){
			this.numdatas=this.numdatas+1;
			let datas={
				infoId:this.id,
				pageNo:this.numdatas,
				pageSize:10
			}
					
			this.$http.getSecondqueryEvaluateByInfoId(datas).then(res => {
				if(res.code == 1){
					// this.plarraydata.records.push(res.data.records)
					// console.log(this.plarraydata)
			
					this.plarraydata.records=[...this.plarraydata.records,...res.data.records]
				}
			})
				
			if(this.plarraydata.records.length==this.plarraydata.total){
			this.$helper.showN('- - 人家也是有底线的 - -');
			}
		},
		choicedata(item){
			this.addchoicedata=item
			this.pltexts='@'+item.nickname+' '
			this.showfocus=true
			
		},
		// 发布回复
		choipldata(){
			let data=this.pltexts.split(this.addchoicedata.nickname)
	
			let dataname=this.pltexts
			dataname=dataname.replace(/\s*/g,''); 
			let that=this
			let datas={
				content:data[1],
				evaluateType: 2,
				parentId:this.addchoicedata.id,   // 评论的ID
				parentUserId:this.addchoicedata.userId   // 发布评论用户的ID
			}
			console.log(dataname,666)
			if(!dataname){
			  return	this.$helper.showN('请输入评论');
			}
			
			this.$http.getInfoaddEvaluates(datas).then(res => {
				if(res.code == 1){
					this.pltexts=''
					this.$helper.showN(res.msg);
					that.getDetail()
					that.addchoicedata={}
				}
			})
			
		},
		
		// 发布评论 || 回复入口
		addpldata(){
			if(JSON.stringify(this.addchoicedata) != "{}"){
				this.numdatas=1
				this.choipldata()
			}else{
				// 发布评论
				let dada= uni.getStorageSync("user_token")
				let dataname=this.pltexts
				dataname=dataname.replace(/\s*/g,''); 
				if(dada){
					let datas={
						content:dataname,
						evaluateType: 1,
						parentId: this.id,   // 信息ID
						parentUserId: this.detailObj.userId   // 发布此信息的用户ID
					}
					let that=this
					if(!dataname){
					  return	this.$helper.showN('请输入评论');
					}
					this.$http.getInfoaddEvaluates(datas).then(res => {
						if(res.code == 1){
							this.pltexts=''
							this.$helper.showN(res.msg);
							that.getDetail()
							// this.detailObj = res.data;
						}
					})
				}else{
					this.$helper.to('/pages/views/login/login')
				}
				// dada?this.$helper.to(navUrlObj[index.sort]+'?item='+ JSON.stringify(index)):this.$helper.to('/pages/views/login/login')
			
			}
		
		
		},
		getDetail() {
			let param = {
				id: this.id
			}
			this.$http.getInfoDetail(param).then(res => {
				if(res.code == 1){
					this.detailObj = res.data;
				}
			})
			let datas={
				infoId:this.id,
				pageNo:this.numdatas,
				pageSize:10
			}
		
			this.$http.getSecondqueryEvaluateByInfoId(datas).then(res => {
				if(res.code == 1){
					// res.data.records.forEach(itin=>{
					
					// 	itin.avatar=this.$http.IMG_BASE_URL+itin.avatar
					// 		console.log(itin)
					// })
					this.plarraydata = res.data;
				}
			})
			// getSecondqueryEvaluateByInfoId
		}
	},
};
</script>

<style scoped lang="scss">
	page{
		background-color: #FFFFFF;
	}
.section-list {
	padding: 0 32rpx;
	margin-top: 20rpx;
}
.bar {
	height: 100rpx;
	display: flex;
	align-items: center;
	padding: 0 32rpx;
	.bar-title {
		font-size: 34rpx;
		font-weight: bold;
	}
}
	
.all_input{
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100vw;
	height: 98rpx;
	background: #fff;
	z-index: 100;
	input{
		font-size: 28rpx;
		text-indent: 1em;
		margin: 17rpx 0;
		margin-left: 32rpx;
		height: 64rpx;
		border-radius: 64rpx;
		width: 610rpx;
		background: #F9F9F9;
		display: inline-block;
	}
	image{
		float: right;
		width: 44rpx;
		height: 44rpx;
		margin: 27rpx 0;
		margin-right: 32rpx;
	}
}
.page-text {
	font-size: 28rpx;
	font-weight: 400;
	line-height: 50rpx;
	color: #999999;
}

.page-img {
	width: 100%;
	height: auto;
}
	
.huanhan{
	 word-break:break-all;
}
</style>
