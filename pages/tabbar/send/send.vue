<template>
	<view>
		<view class="bg_box">
			<image class="send_bg" src="/static/image/common/send_bg.png" mode=""></image>
		</view>
		<view v-show="isListItemShow" class="send-container" :style="{minHeight: WindowHeight - CustomBar + 'px'}" :class="isListItemShow ? 'doanimate' : ''">
			<image class="send_bg" src="/static/image/common/send_bg.png" mode=""></image>
			<view :style="{height: CustomBar + 'px'}"></view>
			<view class="close_box">
				<image class="down_img" @tap="close" src="/static/image/common/close_btn.png" mode=""></image>
			</view>
			<view class="nav-list">
				<view @tap="handleNav(item)" class="nav-list-item" v-for="(item, index) in list" :key="index">
					<u-image class="uimg" width="96" height="96" :src="imgBaseUrl + item.iconUrl"></u-image>
					<view class="name u-line-1">{{ item.issueName }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
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
export default {
	data() {
		return {
						imgBaseUrl: this.$http.IMG_BASE_URL,
			isListItemShow: false,
			list: [
				{
					imgUrl: '/static/image/tempimg/1.png',
					name: '发布工人',
					sort: 1
				},
				{
					imgUrl: '/static/image/tempimg/2.png',
					name: '发布施工队',
					sort: 2
				},
				{
					imgUrl: '/static/image/tempimg/3.png',
					name: '发布材料',
					sort: 3
				},
				{
					imgUrl: '/static/image/tempimg/4.png',
					name: '发布设备',
					sort: 4
				},
				{
					imgUrl: '/static/image/tempimg/5.png',
					name: '专业市场',
					sort: 5
				},
				{
					imgUrl: '/static/image/tempimg/6.png',
					name: '发布求购',
					sort: 6
				},
				{
					imgUrl: '/static/image/tempimg/7.png',
					name: '工人招聘',
					sort: 7
				},
				{
					imgUrl: '/static/image/tempimg/8.png',
					name: '更多',
					sort: 8
				}
			]
		};
	},
	onShow() {
		this.getIndexList()
		this.isListItemShow = true;
	},
	onHide() {
		this.isListItemShow = false;
	},
	onLoad() {
		
	},
	methods: {
		//请求列表
		getIndexList(){
			this.$http.getIconList().then(res => {
				if( res.code == 1 ){
					this.list = res.data;
				} 
			});
		},
		// 列表跳转
		handleNav(index) {
			let that=this
			let dada= uni.getStorageSync("user_token")
			if(dada){
				this.$helper.to(navUrlObj[index.sort]+'?item='+ JSON.stringify(index));
			}else{
				 that.$helper.to('/pages/views/login/login');
			}
			// this.$helper.to(navUrlObj[index.sort]+'?item='+ JSON.stringify(index));
		},
		// 关闭
		close(){
			let status = getApp().globalData.status;
			if( status === 0 ){
				this.$helper.tap('/pages/tabbar/index/index');
			}else if( status == 1 ){
				this.$helper.tap('/pages/tabbar/mine/mine');
			}
		}
	}
};
</script>

<style lang="scss">
page {
	width: 100%;
	height: 100%;
	background-color: transparent;
}

.bg_box{
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: -3;
	.send_bg {
		position: absolute;
		min-width: 100%;
		min-height: 100%;
		left: 0;
		top: 0;
		z-index: -2;
	}
}

.send-container {
	min-width: 100%;
	min-height: 100%;
	border-top: 1rpx solid transparent;
	// transform: translateY(100%);
	.send_bg {
		position: absolute;
		min-width: 100%;
		min-height: 100%;
		left: 0;
		top: 0;
		z-index: -1;
	}
	
	.close_box{
		display: flex;
		justify-content: center;
		padding: 32rpx;
		.down_img{
			width: 64rpx;
			height: 24rpx;
		}
	}
	
	&.doanimate{
		animation: bottomToTop 0.5s;
	}
}
@keyframes bottomToTop{
	0% {
		transform: translateY(100%);
	}
	100%{
		transform: translateY(0);
	}
}
@-webkit-keyframes bottomToTop {
	0% {
		transform: translateY(100%);
	}
	100%{
		transform: translateY(0);
	}
}
</style>
