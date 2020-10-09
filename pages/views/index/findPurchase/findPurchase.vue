<template>
	<view>
		<!-- 顶部类型选择 -->
		<view class="handel-type-box"><view class="handel-type"></view></view>
		<!-- #ifdef H5 -->
		<view class="handel-type-box" style="position: fixed; left: 0; z-index: 10; background-color: #FFFFFF;" :style="{ top: CustomBar + 'px' }">
		<!-- #endif -->
		<!-- #ifdef APP-PLUS -->
		<view class="handel-type-box" style="position: fixed; left: 0; z-index: 10; background-color: #FFFFFF;" :style="{ top: 0 + 'px' }">
		<!-- #endif -->
			<scroll-view class="handel-type u-border-bottom" scroll-x>
				<view class="u-flex u-col-center" style="height: 100%;">
					<block v-for="(item, index) in typeList" :key="index">
						<view class="type-item" :class="{'active': activeTab === index}" @tap="typeItemTap(index, item.id)">{{item.classifyName}}</view>
					</block>
				</view>
			</scroll-view>
			
			<view class="sub-type-list">
				<view class="sub-type-item" :class="{active: nativeSort == 0}" @tap="doItemChange(0)">最新发布</view>
				<view class="sub-type-item" :class="{active: nativeSort == 1}" @tap="doItemChange(1)">离我最近</view>
			</view>
		</view>

		
		<!-- 列表模块 -->
		<view class="section-list">
			<!-- 空数据提示 -->
			<view class="no_data" v-if="!len && loadStatus != 'loading'">
				<noData></noData>
			</view>
			<view v-for="(item, index) in lists" :key="index" @tap="$helper.to('/pages/views/index/allDetail/allDetail?type=6&id=' + item.id)">
				<listItem type="6" :item="item"></listItem>
			</view>
			<uniLoadMore :status="loadStatus" :contentText="loadTextObj"></uniLoadMore>
		</view>
	</view>
</template>

<script>
import listItem from '@/components/mqb-components/list-item.vue';
import loadMoreMixin from '@/utils/load-more-mixin.js';
import infoListMixin from '@/utils/info-list-mixin.js';
export default {
	mixins:[loadMoreMixin, infoListMixin],
	components:{
		listItem
	},
	data() {
		return {
			id: '',  // 一级分类ID
			activeTab: -1, 
			nativeSort: -1, 
		};
	},
	onNavigationBarButtonTap() {
		this.$helper.to('/pages/views/search/search?type=' + this.id);
	},
	methods: {
		typeItemTap(index, id) {
			this.activeTab = index;
			this.reqParam.classifyIds = id;
			this.init();
			this.getList();
		},
		
		doItemChange(index){
			this.nativeSort = index;
			this.reqParam.sort = index;
			if(index == 1){
				this.reqParam.longitude = this.$store.state.userPosition.longitude;
				this.reqParam.latitude = this.$store.state.userPosition.latitude;
			}
			this.init();
			this.getList();
		}
	},
};
</script>

<style lang="scss">
page {
	background-color: #f6f6f6;
}
.handel-type-box {
	width: 100%;
	height: 194rpx;
	margin-bottom: 24rpx;
	background-color: #FFFFFF;
}
.handel-type {
	position: relative;
	width: 100%;
	height: 88rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: #FFFFFF;
	.type-item{
		flex-shrink: 0;
		height: 56rpx;
		line-height: 56rpx;
		color: #999999;
		margin-right: 48rpx;
		font-weight: 500;
		font-size: 32rpx;
		
		&:first-child{
			margin-left: 32rpx;
		}
		
		&:last-child{
			margin-right: 32rpx;
		}
		
		&.active{
			position: relative;
			font-weight: bold;
			color: #333333;
		}
		&.active::after{
			content: "";
			position: absolute;
			bottom: -10rpx;
			left: 50%;
			transform: translate(-50%);
			width: 43rpx;
			height: 12rpx;
			background: url("/static/image/common/hu.png") no-repeat center center;
			background-size: 100% 100%;
		}
	}
}

.sub-type-list{
	height: 100rpx;
	display: flex;
	padding: 0 32rpx;
	align-items: center;
	.sub-type-item{
		padding: 12rpx 24rpx;
		height: 64rpx;
		background: #FAFAFA;
		border-radius: 8rpx;
		margin-right: 20rpx;
		
		&.active{
			color: #FFFFFF;
			background-color: #1097CD;
		}
	}
}
</style>
