<template>
	<view>
		<!-- 顶部类型选择 -->
		<view class="handel-type-box"><view class="handel-type"></view></view>
		<!-- #ifdef H5 -->
		<view class="handel-type-box" style="position: fixed; left: 0; z-index: 10; background-color: #F6F6F6;" :style="{ top: CustomBar + 'px' }">
		<!-- #endif -->
		<!-- #ifdef APP-PLUS -->
		<view class="handel-type-box" style="position: fixed; left: 0; z-index: 10; background-color: #F6F6F6;" :style="{ top: 0 + 'px' }">
		<!-- #endif -->
			<view class="handel-type">
				<view class="picker-wrapper u-m-r-50 u-row-center" @tap="$helper.to('/pages/city_list/city_list?origin=2')">
					<view class="uni-input u-line-1">{{cityName}}</view>
					<u-icon class="u-m-l-10 u-m-t-6" size="20" name="arrow-down" color="#666666"></u-icon>
					<!-- <image src="/static/image/common/select.png"></image> -->
				</view>
				<view class="u-flex">
					<view class="picker-wrapper picker-margin-left u-m-r-24" @tap="openPopup">
						<view class="uni-input u-line-1">{{workTypeText}}</view>
						<image src="/static/image/common/select.png" style="flex-shrink: 0;"></image>
					</view>
					<view class="picker-wrapper picker-margin-left" @tap="chooseStatus">
						<view class="uni-input">{{statusText}}</view>
						<image src="/static/image/common/select.png"></image>
					</view>
				</view>
			</view>
		</view>

		<view class="section-list">
			<!-- 空数据提示 -->
			<view class="no_data" v-if="!len && loadStatus != 'loading'">
				<noData></noData>
			</view>
			<view v-for="(item, index) in lists" :key="index" @tap="$helper.to('/pages/views/index/allDetail/allDetail?type=1&id=' + item.id)">
				<listItem type="1" :item="item"></listItem>
			</view>
			<uniLoadMore :status="loadStatus" :contentText="loadTextObj"></uniLoadMore>
		</view>
		<typeofworkPopup ref="typePopup" :list="typeList" @doConfirm="doConfirm"></typeofworkPopup>
	</view>
</template>

<script>
import typeofworkPopup from '@/components/mqb-components/typeofwork-popup.vue';
import listItem from '@/components/mqb-components/list-item.vue';
import loadMoreMixin from '@/utils/load-more-mixin.js';
import infoListMixin from '@/utils/info-list-mixin.js';
let statusObj = {
	"-1": '状态',
	0: '闲',
	1: '忙'
}
export default {
	mixins:[loadMoreMixin, infoListMixin],
	components:{
		listItem, typeofworkPopup
	},
	data() {
		return {
			id: '',  // 一级分类ID
			workTypeText: '工种',  // 工种类型文本
			cityName: '',  // 当前的城市名字
		};
	},
	computed:{
		statusText(){
			return statusObj[this.statusNum]
		},
	},
	onLoad() {
		this.cityName = this.$store.state.userPosition.city;
		uni.$on('address_find', data => {
			this.cityName = data.city;
			this.reqParam.cityName = data.city;
			this.reqParam.longitude = data.longitude;
			this.reqParam.latitude = data.latitude;
			this.init();
			this.getList();
		});
	},
	onUnload() {
		uni.$off("address_find");
	},
	onNavigationBarButtonTap() {
		this.$helper.to('/pages/views/search/search?type=' + this.id);
	},
	methods:{
		
		// 工种弹窗
		openPopup(){
			this.$refs.typePopup.open();
		},
		// 确定
		doConfirm(item){
			if(!item) {
				this.reqParam.classifyIds = '';
				this.workTypeText = '工种';
			}else{
				this.workTypeText = item.classifyName;
				this.reqParam.classifyIds = item.id;
			}
			this.init();
			this.getList();
		},
		
		// 选择忙闲状态
		chooseStatus() {
			uni.showActionSheet({
				itemList: ['闲', '忙'],
				success: ({tapIndex}) => {
					this.reqParam.state = tapIndex;
					this.statusNum = tapIndex;
					this.init();
					this.getList();
				}
			});
		},
	}
};
</script>

<style lang="scss">
page {
	background-color: #f6f6f6;
}
.handel-type-box {
	padding-top: 24rpx;
	padding-bottom: 32rpx;
}
.handel-type {
	width: 750rpx;
	height: 88rpx;
	display: flex;
	padding: 0 32rpx;
	justify-content: space-between;
	align-items: center;
	.picker-wrapper {
		width: 210rpx;
		height: 64rpx;
		background: #ffffff;
		border-radius: 8rpx;
		padding: 0 24rpx 0 24rpx;
		font-size: 28rpx;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
		display: flex;
		align-items: center;
		justify-content: space-between;
		border: 1px solid #bfbfbf;
		image {
			width: 20rpx;
			height: 36rpx;
			margin-left: 44rpx;
		}
		&.u-row-center{
			justify-content: center;
		}
	}
}
</style>
