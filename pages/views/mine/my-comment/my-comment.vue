<template>
	<view>
		<view class="top-nav-box">
			<u-tabs
				:list="tabList"
				:is-scroll="false"
				height="80"
				:bar-style="{ width: '60rpx', marginLeft: '-10rpx', height: '4rpx', background: '#02B5FC' }"
				active-color="#02B5FC"
				bg-color="#ffffff"
				:current="currentTab"
				@change="tabChange"
				class="u-border-bottom"
			></u-tabs>
		</view>
		<view class="nav-place"></view>
		<view class="comment">
			<!-- 空数据提示 -->
			<view class="no_data" v-if="!len && loadStatus != 'loading'">
				<noData></noData>
			</view>
			<view class="comment-item" v-for="(item, index) in lists" :key="index">
				<u-image class="comment-user-photo" :src="$http.IMG_BASE_URL+item.avatar" width="64" height="64" border-radius="1000"></u-image>
				<view class="comment-right u-border-bottom">
					<view class="line1">
						<view class="comment-user-nickname">{{item.nickname}}</view>
						<view class="comment-del-btn" @tap="doDel(item, index)">删除</view>
					</view>
					<view class="comment-cont">{{item.content}}</view>
					<!-- <view class="reply-btn" @click="choicedata(item)">回复</view>
					<view class="reply-box" v-for="(items,indexdata) in item.secondEvaluates" :key="indexdata">
						<view class="reply-user">
							<u-image class="img" :src="$http.IMG_BASE_URL+items.avatar" width="48" height="48" border-radius="1000"></u-image>
							<view class="username">{{items.nickname}}</view>
						</view>
						<view class="reply-cont">{{items.content}}</view>
					</view> -->
				</view>
			</view>
			<uniLoadMore :status="loadStatus" :contentText="loadTextObj"></uniLoadMore>
		</view>
	</view>
</template>

<script>
import loadMoreMixin from '@/utils/load-more-mixin.js';
export default {
	mixins:[loadMoreMixin],
	data() {
		return {
			tabList: [
				{
					name: '我的评论'
				},
				{
					name: '我收到的评论'
				}
			],
			currentTab: 0,
			lists: [],
		};
	},
	onShow() {
		this.init();
		this.getList();
	},
	methods: {
		tabChange(index) {
			if(index == this.currentTab) return ;
			this.currentTab = index;
			this.init();
			this.getList();
		},
		
		// 查询列表
		getList() {
			this.loadStatus = 'loading';
			let param = {
				type: this.currentTab + 1,
				pageNo: this.pageNo,
				pageSize: this.pageSize
			}
			this.$http.getUserCommentList(param).then(res => {
				if(res.code == 1){
					this.lists = this.lists.concat(res.data.records);
					this.total = res.data.total;
				}
			})
		},
		
		// 删除操作
		doDel(item, index){
			uni.showModal({
				cancelText:"取消",
				confirmText:"确定",
				title:"提示",
				content:"确定要删除此评论吗？",
				success: res => {
					if(res.confirm){
						let param = {
							id: item.id
						}
						this.$http.delUserComment(param).then(res => {
							if(res.code == 1){
								this.$helper.showN('删除成功');
								setTimeout(() => {
									this.init();
									this.getList();
								}, 800);
							}	
						});
					}
				}
			})
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #FFFFFF;
}

.nav-place{
	height: 80rpx;
}

.top-nav-box{
	position: fixed;
	left: 0;
	right: 0;
	height: 80rpx;
	z-index: 10;
}

.comment-item{
	padding-top: 32rpx;
	
	.comment-del-btn{
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		color: #999999;
	}
}
</style>
