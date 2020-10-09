<template>
	<view>
		<!-- 搜索框 -->
		<u-navbar :background="{ background: '#ffffff' }" :border-bottom="false">
			<view class="search-wrap"><u-search v-model="searchStr" placeholder="请输入商家搜索关键字" height="56"  @custom="doSearch"></u-search></view>
		</u-navbar>
		
		<!-- 顶部类型选择 -->
		<view class="handel-type-box"><view class="handel-type"></view></view>
		<!-- #ifdef H5 -->
		<view class="handel-type-box" style="position: fixed; left: 0; z-index: 10; background-color: #FFFFFF;" :style="{ top: CustomBar + 'px' }">
		<!-- #endif -->
		<!-- #ifdef APP-PLUS -->
		<view class="handel-type-box" style="position: fixed; left: 0; z-index: 10; background-color: #FFFFFF;" :style="{ top: CustomBar + 'px' }">
		<!-- #endif -->
			<scroll-view class="handel-type" scroll-x>
				<view class="u-flex u-col-center u-p-l-32 u-m-r-32" style="height: 100%;">
					<block v-for="(item, index) in typeList" :key="index">
						<view @tap="typeItemChange(index, item.id)" class="type-item" :class="{active: index == activeTab}">{{item.iconName}}</view>
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
			<view v-for="(item, index) in lists" :key="index" @tap="$helper.to('/pages/views/index/allDetail/allDetail?id=' + item.id + '&type=' + item.iconId)">
				<listItem :curIndex="index" :type="iconId" :item="item"></listItem>
			</view>
			<uniLoadMore :status="loadStatus" :contentText="loadTextObj"></uniLoadMore>
		</view>
	</view>
</template>

<script>
	import listItem from '@/components/mqb-components/list-item.vue';
	import loadMoreMixin from '@/utils/load-more-mixin.js';
	export default {
		mixins:[loadMoreMixin],
		components:{
			listItem
		},
		data() {
			return {
				searchStr: '',
				typeList: [], // 分类列表
				lists: [],  // 列表
				activeTab: 0, 
			};
		},
		onLoad(params) {
			console.log(params)
			let that = this
			this.getIndexList();
		},


		methods: {
			// 获取首页导航列表
			getIndexList(){
				this.$http.getIconList().then(res => {
					if( res.code == 1 ){
						this.typeList = res.data.filter(item => item.id != 8);
						this.iconId = this.typeList[0].id;
						this.getList();
					} 
				});
			},
			
			// 查询列表
			getList() {
				this.loadStatus = 'loading';
				let param = {
					title: this.searchStr,
					iconId: this.iconId,
					cityName: this.$store.state.userPosition.city,
					longitude: this.$store.state.userPosition.longitude,
					latitude: this.$store.state.userPosition.latitude,
					pageNo: this.pageNo,
					pageSize: this.pageSize
				}
				this.$http.getInfoList(param).then(res => {
					if(res.code == 1){
						this.lists = this.lists.concat(res.data.records);
						this.total = res.data.total;
					}
				})
			},
			
			// 分类改变
			typeItemChange(index, id){
				if(index == this.activeTab) return;
				this.activeTab = index;
				this.iconId = id;
				this.init();
				this.getList();
			},
			
			// 执行搜索操作
			doSearch(){
				this.init();
				this.getList();
			}
		}
	};
</script>

<style scoped lang="scss">
page {
	background-color: #f6f6f6;
}
.search-wrap {
	margin: 0 20rpx;
	flex: 1;
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
