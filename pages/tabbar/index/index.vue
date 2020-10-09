<template>
	<view class="">
		<view class="page-top">
			<!-- 搜索框 -->
			<u-navbar
				:isBack="false"
				:border-bottom="false"
				immersive
				:background="{ background: 'url(/static/image/common/bg1.png) no-repeat center center', backgroundSize: '750rpx 424rpx' }"
			>
				<!--  @tap="$helper.to('/pages/city_list/city_list')" -->
				<view class="city-box" @tap="$helper.to('/pages/city_list/city_list?origin=1')">
					<text class="city">{{userCity}}</text>
					<u-icon class="u-m-l-10" size="20" name="arrow-down" color="#ffffff"></u-icon>
				</view>
				<view class="search-wrap" @tap="$helper.to('/pages/views/search/search')">
					<u-search disabled placeholder="请输入搜索关键字" :show-action="false" height="56" :action-style="{ color: '#fff' }"></u-search>
				</view>
				<view class="navbar-right" @tap="judgeLoginAndNav('/pages/tabbar/sysmsg/sysmsg')">
					<view class="message-box right-item">
						<u-icon name="chat" size="40" color="#ffffff"></u-icon>
						<u-badge :count="userUnReadMsg" size="mini" is-center></u-badge>
					</view>
				</view>
			</u-navbar>

			<image class="page-top-bg" src="/static/image/common/bg1.png" mode=""></image>

			<view class="swiper-box"><u-swiper :list="swiperList" name="imgUrl" height="320"></u-swiper></view>
		</view>
		<view class="container">
			<view class="nav-list">
				<view
					v-if="item.showFlag == '1'"
					@tap="handleNav(item.id)"
					:style="[{ animation: isListItemShow ? 'show ' + ((index + 1) * 0.2 + 1) + 's 1' : '' }]"
					class="nav-list-item"
					v-for="(item, index) in list"
					:key="index"
				>
					<u-image class="uimg" width="96" height="96" :src="imgBaseUrl + item.iconUrl"></u-image>
					<view class="name u-line-1">{{ item.iconName }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
let navUrlObj = {
	1: '/pages/views/index/findPerson/findPerson',
	2: '/pages/views/index/findTeam/findTeam',
	3: '/pages/views/index/findMaterial/findMaterial',
	4: '/pages/views/index/findDevice/findDevice',
	5: '/pages/views/index/findMarket/findMarket',
	6: '/pages/views/index/findPurchase/findPurchase',
	7: '/pages/views/index/findRecruit/findRecruit',
	8: '/pages/views/index/more/more'
};
import { mapGetters } from 'vuex';
import judgeLoginAndNavMixin from '@/utils/judge-login-and-nav-mixin.js';
export default {
	mixins:[judgeLoginAndNavMixin],
	data() {
		return {
			imgBaseUrl: this.$http.IMG_BASE_URL,
			isListItemShow: true,
			userUnReadMsg: '',   // 未读消息数量
			list: [
				// {
				// 	imgUrl: '/static/image/tempimg/1.png',
				// 	name: '找工人',
				// 	sort: 1
				// },
				// {
				// 	imgUrl: '/static/image/tempimg/2.png',
				// 	name: '找施工队',
				// 	sort: 2
				// },
				// {
				// 	imgUrl: '/static/image/tempimg/3.png',
				// 	name: '找材料',
				// 	sort: 3,
				// },
				// {
				// 	imgUrl: '/static/image/tempimg/4.png',
				// 	name: '找设备',
				// 	sort: 4,
				// },
				// {
				// 	imgUrl: '/static/image/tempimg/5.png',
				// 	name: '专业市场',
				// 	sort: 5,
				// },
				// {
				// 	imgUrl: '/static/image/tempimg/6.png',
				// 	name: '求购',
				// 	sort: 6,
				// },
				// {
				// 	imgUrl: '/static/image/tempimg/7.png',
				// 	name: '工人招聘',
				// 	sort: 7,
				// },
				// {
				// 	imgUrl: '/static/image/tempimg/8.png',
				// 	name: '更多',
				// 	sort: 8,
				// }
			],
			swiperList: [
				// {
				// 	image: 'https://cdn.uviewui.com/uview/swiper/1.jpg',
				// 	title: '昨夜星辰昨夜风，画楼西畔桂堂东'
				// },
				// {
				// 	image: 'https://cdn.uviewui.com/uview/swiper/2.jpg',
				// 	title: '身无彩凤双飞翼，心有灵犀一点通'
				// },
				// {
				// 	image: 'https://cdn.uviewui.com/uview/swiper/3.jpg',
				// 	title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳'
				// }
			]
		};
	},
	computed:{
		...mapGetters(['userCity'])
	},
	onShow() {
		getApp().globalData.status = 0;
		this.isListItemShow = true;
		this.getUnReadMsg();
	},
	onHide() {
		this.isListItemShow = false;
	},
	onLoad() {
		this.getBannerList();
		this.getIndexList();
		
		uni.$on('address_index', data => {
			console.log("index.vue中的打印信息");
			console.log(data);
			if(data){
				this.$store.commit("SET_USER_POSITION", data)
			}
		});
	},
	onUnload() {
		uni.$off('address_index');
	},
	methods: {
		// 获取首页轮播图
		getBannerList(){
			this.$http.getBanner().then(res => {
				if(res.code == 1){
					let swiperList = res.data;
					swiperList.map(item => {
					// console.log(item);
						item.imgUrl = this.imgBaseUrl + item.imgUrl;
					})
					// console.log(swiperList);
					this.swiperList = swiperList;
				}
			});
		},
		
		// 获取首页导航列表
		getIndexList(){
			this.$http.getIconList().then(res => {
				if( res.code == 1 ){
					this.list = res.data;
				} 
			});
		},
		
		// 列表跳转
		handleNav(id) {
			this.$helper.to(navUrlObj[id] + '?id=' + id);
		},
		
		// 获取用户的未读消息数量
		getUnReadMsg(){
			this.$http.getUnReadMsgCount().then(res => {
				if(res.code == 1){
					this.userUnReadMsg = res.data;
				}
			})
		}
	}
};
</script>

<style lang="scss">
.page-top {
	position: relative;
	// 导航
	.city-box {
		margin-right: 30rpx;
		padding-left: 32rpx;
		.city {
			color: #ffffff;
		}
	}
	.search-wrap {
		margin: 0 20rpx;
		flex: 1;
	}
	.navbar-right {
		margin-right: 24rpx;
		display: flex;

		.message-box {
			position: relative;
		}
	}
	// 导航end

	// 背景图
	.page-top-bg {
		width: 750rpx;
		height: 424rpx;
	}

	// 轮播图
	.swiper-box {
		position: absolute;
		padding: 32rpx;
		z-index: 1;
		left: 0;
		bottom: -100rpx;
		width: 750rpx;
	}
}


</style>
