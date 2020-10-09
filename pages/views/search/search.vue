<template>
	<view>
		<!-- 搜索框 -->
		<u-navbar :background="{ background: '#ffffff' }" :border-bottom="false">
			<view class="search-wrap"><u-search v-model="searchStr" placeholder="请输入搜索关键字" height="56" @custom="adddata"></u-search></view>
		</u-navbar>

		<view class="history-box">
			<view class="head u-flex u-row-between">
				<view class="title" @tap="search">历史记录</view>
				<view class="del-icon" @tap="delHistory"><image src="/static/image/common/laji.png" lazy-load></image></view>
			</view>
			<view class="list">
				<!-- <empty-info v-if="!searchHistory.length"></empty-info> -->
				<block v-for="(item, index) in searchHistory" :key="index">
					<view class="list-item" @tap="itemClick(item)">{{ item.substring(0,6) }}</view>
				</block>
			</view>
		</view>
		<!-- <show-modal></show-modal> -->
	</view>
</template>

<script>
// import EmptyInfo from '@/components/common/EmptyInfo/EmptyInfo.vue';
// import Labour from '@/pages/search/labour/labour.vue';
export default {
	data() {
		return {
			/* 
			 0: 首页
			 1: 首页 -> 平台推荐
			 2: 商城首页
			 3: 商城首页 -> 分类
			 4: 课程首页
			 5: 课程首页 -> 分类
			 6: 店铺详情
			 7: 开通会员 -> 专属课程
			 8: 积分商城
			 */
			type: 0, // 搜索类型 0-混合搜索   1-仅商品  2-仅课程
			searchStr: '', // 输入的搜索内容
			searchHistory: [], // 历史记录
			shopId: '', // 店铺ID
			searchWord: '' // 关键字
		};
	},
	onLoad(params) {
		this.type = params.type;
		this.shopId = params.shopId || '';
		let temp = uni.getStorageSync('search-history');
		if (temp) {
			this.searchHistory = JSON.parse(uni.getStorageSync('search-history'));
		} else {
			this.searchHistory = [];
		}

		uni.$on('updateHistory', item => {
			this.saveHistory(item);
		});
	},
	onUnload() {
		uni.$off('updateHistory');
	},
	onNavigationBarSearchInputChanged(ev) {
		this.searchStr = ev.text;
	},
	onNavigationBarButtonTap() {
		this.handleSearch();
	},
	methods: {
		adddata(){
			if(this.searchStr){
				let data=[]
				if(uni.getStorageSync('search-history')){
					data=JSON.parse(uni.getStorageSync('search-history'));
				}
				data=[...data,this.searchStr]
				data=[...new Set(data)]
				this.searchHistory=data
				uni.setStorageSync('search-history', JSON.stringify(data));
				
				uni.navigateTo({
					url: `/pages/views/search/labour/labour?type=1&searchStr=${this.searchStr}`
				});
			}else{
				this.$helper.showN("请输入公司名称" );
			}
		},
		search() {},
		// 单击搜索的处理函数
		handleSearch() {
			this.saveHistory(this.searchStr);
			uni.navigateTo({
				url: `/pages/views/search/labour/labour?type=1&searchStr=${this.searchStr}`
			});
			this.searchStr = '';
		},

		// 存储历史记录的操作
		saveHistory(itemStr) {
			if (itemStr == '') {
				uni.navigateTo({
					url: `/pages/views/search/labour/labour?type=1&searchStr=${this.searchStr}`
				});
				return;
			}
			let res = this.searchHistory.find(item => {
				return item == itemStr;
			});
			if (!res) {
				if (this.searchHistory.length > 10) {
					this.searchHistory.pop();
				}
				this.searchHistory.unshift(itemStr);
			}
			uni.setStorageSync('search-history', JSON.stringify(this.searchHistory));
		},

		// 历史记录选项单击的处理函数
		itemClick(item) {
			this.searchStr = item;
			this.handleSearch();
		},

		// 清空历史记录
		delHistory() {
			let __this = this;
			if (!this.searchHistory.length) {
				uni.showToast({
					title: '暂无可删除数据',
					icon: 'none'
				});
				return;
			}
			// #ifdef APP-PLUS
			uni.showModal({
				title: '提示',
				confirmText: '确定',
				cancelText: '取消',
				content: '确定要清空历史记录吗？',
				success: event => {
					if (event.confirm) {
						uni.showLoading({
							title: '正在删除'
						});
						uni.setStorageSync('search-history', JSON.stringify([]));
						setTimeout(() => {
							this.searchStr = '';
							uni.hideLoading();
							let temp = uni.getStorageSync('search-history');
							if (temp) {
								this.searchHistory = JSON.parse(uni.getStorageSync('search-history'));
							} else {
								this.searchHistory = [];
							}
						}, 700);
					}
				}
			});
			// #endif
			// #ifdef H5
			uni.showModal({
				// title: '提示',
				content: '确定要清空历史记录吗？',
				success: event => {
					if (event.confirm) {
						uni.showLoading({
							title: '正在删除'
						});
						uni.setStorageSync('search-history', JSON.stringify([]));
						setTimeout(() => {
							this.searchStr = '';
							uni.hideLoading();
							let temp = uni.getStorageSync('search-history');
							if (temp) {
								this.searchHistory = JSON.parse(uni.getStorageSync('search-history'));
							} else {
								this.searchHistory = [];
							}
						}, 700);
					}
				}
			});
			// #endif
		}
	}
};
</script>

<style lang="scss">
.search-wrap {
	margin: 0 20rpx;
	flex: 1;
}
page,html{
	background: #fff;
}
.history-box {
	padding: 0 32rpx;
	
	.head {
		height: 40px;
		.title {
			font-size: 28upx;
			font-weight: bold;
			color: #333333;
		}

		image {
			width: 30upx;
			height: 30upx;
		}
	}
}
.list {
	padding: 0 10upx;
	display: flex;
	flex-wrap: wrap;
}
.list-item {
	height: 50upx;
	padding: 10upx 20upx;
	margin-right: 20upx;
	margin-bottom: 20upx;
	background: #f7f7f7;
	border-radius: 17upx;
	font-size: 24upx;
	color: #666666;
}
</style>
