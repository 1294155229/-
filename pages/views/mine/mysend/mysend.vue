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
				<listItem :curIndex="index" :type="iconId" mySend :item="item" @doChangeStatus="doChangeStatus" @doDelItem="doDelItem" @doEditItem="doEditItem"></listItem>
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
			activeTab: 0, 
			typeList: [], // 分类列表
			iconId: '', // 图标ID
			lists: [],
		};
	},
	
	onLoad() {
		this.getIndexList();
	},
	onShow() {
		if(this.iconId){
			this.init();
			this.getList();
		}
	},
	methods:{
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
		
		// 分类改变
		typeItemChange(index, id){
			if(index == this.activeTab) return;
			this.activeTab = index;
			this.iconId = id;
			this.init();
			this.getList();
		},
		
		// 查询列表
		getList() {
			this.loadStatus = 'loading';
			let param = {
				iconId: this.iconId,
				pageNo: this.pageNo,
				pageSize: this.pageSize
			}
			this.$http.getUserInfoList(param).then(res => {
				if(res.code == 1){
					this.lists = this.lists.concat(res.data.records);
					this.total = res.data.total;
				}
			})
		},
		
		// 删除操作
		doDelItem({item, index}){
			uni.showModal({
				cancelText:"取消",
				confirmText:"确定",
				content: "确定要删除吗？",
				title:"提示",
				success: result => {
					if(result.confirm){
						let param = {
							id: item.id
						}
						this.$http.delInfoById(param).then(res => {
							if(res.code == 1){
								this.$helper.showN("删除成功");
								setTimeout(() => {
									this.init();
									this.getList();
								}, 500);
							}
						});
					}
				}
			})
		},
		
		
		// 编辑按钮点击
		doEditItem({item, index}){
			let navUrlObj = {
				1: '/pages/views/send/sendPerson/sendPerson',
				2: '/pages/views/send/sendTeam/sendTeam',
				3: '/pages/views/send/sendMaterial/sendMaterial',
				4: '/pages/views/send/sendDevice/sendDevice',
				5: '/pages/views/send/sendDevice/sendDevice',
				6: '/pages/views/send/sendPurchase/sendPurchase',
				7: '/pages/views/send/sendRecruit/sendRecruit',
				8: '/pages/views/index/more/more'
			};
						this.$helper.to(navUrlObj[item.iconId]+'?item='+ JSON.stringify(item));
			// item为当前点击要修改的对象
			// index为当前项在数组中的索引
			console.log("点击了编辑按钮");
			console.log(item);
			console.log(index);
		},
		
		// 切换当前的忙闲状态
		doChangeStatus({item, index}){
			let param = {
				id: item.id,
				state: item.workStatus == 0 ? 1 : 0
			}
			this.$http.changeState(param).then(res => {
				if(res.code == 1){
					item.workStatus = item.workStatus == 0 ? 1 : 0;
					this.$set(this.lists, index, item);
				}
			})
		}
	}
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
