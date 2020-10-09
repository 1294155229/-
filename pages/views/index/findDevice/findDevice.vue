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
			<scroll-view class="handel-type" scroll-x>
				<view class="u-flex u-col-center u-p-l-32 u-m-r-32" style="height: 100%;">
					<block v-for="(item, index) in typeList" :key="index">
						<view class="type-item" :class="{'active': activeTab === index}" @tap="typeItemTap(index, item.id)">{{item.classifyName}}</view>
					</block>
				</view>
			</scroll-view>
		</view>

		
		<!-- 列表模块 -->
		<view class="section-list">
			<!-- 空数据提示 -->
			<view class="no_data" v-if="!len && loadStatus != 'loading'">
				<noData></noData>
			</view>
			<view v-for="(item, index) in lists" :key="index" @tap="$helper.to('/pages/views/index/allDetail/allDetail?type=4&id=' + item.id)">
				<listItem type="4" :item="item"></listItem>
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
		}
	},
};
</script>

<style lang="scss">
page {
	background-color: #f6f6f6;
}
.handel-type-box {
	height: 88rpx;
	overflow: hidden;
	margin-bottom: 24rpx;
}
.handel-type {
	width: 750rpx;
	height: 88rpx;
	display: flex;
	align-items: center;
	
	.type-item{
		flex-shrink: 0;
		height: 56rpx;
		line-height: 56rpx;
		color: #999999;
		margin-right: 48rpx;
		font-weight: 500;
		&:last-child{
			padding-right: 32rpx;
		}
		&.active{
			font-weight: bold;
			color: #02B5FC;
		}
	}
}
</style>
