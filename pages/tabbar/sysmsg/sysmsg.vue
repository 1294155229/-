<template>
	<view>
		<view class="msg-list u-border-top">
			<block v-for="(item, index) in lists" :key="index">
				<view class="msg-item u-border-bottom" @tap="$helper.to('/pages/tabbar/sysmsg/sysmsg-detail/sysmsg-detail?id=' + item.id)">
					<view class="title u-line-1">{{item.title}}</view>
					<view class="cont u-line-2">{{item.intro}}</view>
					<view class="time">{{item.createTime}}</view>
				</view>
			</block>
			
			<!-- 空数据提示 -->
			<view class="no_data" v-if="!len && loadStatus != 'loading'">
				<noData></noData>
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
			lists: []
		};
	},
	onLoad() {
		this.getList();
	},
	methods: {
		getList() {
			this.loadStatus = 'loading';
			let param = {
				pageNo: this.pageNo,
				pageSize: this.pageSize
			}
			this.$http.getSystemMessageList(param).then(res => {
				if(res.code == 1){
					this.total = res.data.total;
					this.lists = this.lists.concat(res.data.records);
				}
			})
		}
	},
};
</script>

<style lang="scss">
page {
	background-color: #ffffff;
}
.msg-list {
	padding: 0 32rpx;

	.msg-item {
		padding: 32rpx 0;
		
		.title{
			font-size: 32rpx;
			color: #333333;
		}
		
		.cont{
			margin-top: 20rpx;
			margin-bottom: 32rpx;
			font-size: 28rpx;
			color: #999999;
			line-height: 48rpx;
		}
		.time{
			text-align: right;
			color: #999999;
			font-size: 24rpx;
		}
	}
}
</style>
