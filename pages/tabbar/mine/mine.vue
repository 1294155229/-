<template>
	<view :animation="animationData" class="mine-content b-opacity">
		<view class="top-wrap">
			<view :style="{ height: StatusBar + 'px' }"></view>
			<view class="mine-top">
				<view></view>
				<view></view>
				<!-- <image src="/static/image/mine/message.png" @tap="$helper.to('/pages/views/mine/news/news')"></image> -->
			</view>
			<view class="user-wrap" @tap="judgeLoginAndNav('/pages/views/mine/userinfo/userinfo')">
				<image v-if="IS_LOGIN" :src="IMG_BASE_URL + userInfo.avatar | formatAvatar" mode=""></image>
				<image v-else :src="userInfo.avatar"></image>
				<view class="user-name b-oneline">{{ userInfo.nickname }}</view>
			</view>
		</view>
		<view class="poa">
			<view class="setting-wrap u-border-bottom" @tap="judgeLoginAndNav('/pages/views/mine/mysend/mysend')">
				<view class="left-part">
					<image src="/static/image/mine/fabu.png" mode=""></image>
					<view class="center-part">我的发布</view>
				</view>
				<image class="right-part" src="/static/image/mine/rightArrow.png" mode=""></image>
			</view>
			<view class="setting-wrap" @tap="judgeLoginAndNav('/pages/views/mine/my-comment/my-comment')">
				<view class="left-part">
					<image src="/static/image/mine/fabu.png" mode=""></image>
					<view class="center-part">我的评论</view>
				</view>
				<image class="right-part" src="/static/image/mine/rightArrow.png" mode=""></image>
			</view>
		</view>

		<view class="setting-list">
			<view class="setting-wrap line-wrap" @tap="$helper.to('/pages/views/mine/setting/setting')">
				<view class="left-part">
					<image src="/static/image/mine/settings.png" mode=""></image>
					<view class="center-part">设置</view>
				</view>
				<image class="right-part" src="/static/image/mine/rightArrow.png" mode=""></image>
			</view>
			<view class="setting-wrap line-wrap" @tap="judgeLoginAndNav('/pages/views/mine/setting/feedback/feedback')">
				<view class="left-part">
					<image src="/static/image/mine/feedBack.png" mode=""></image>
					<view class="center-part">意见反馈</view>
				</view>
				<image class="right-part" src="/static/image/mine/rightArrow.png" mode=""></image>
			</view>
			<view class="setting-wrap line-wrap" @tap="$helper.to('/pages/views/mine/setting/aboutus/aboutus')">
				<view class="left-part">
					<image src="/static/image/mine/aboutUs.png" mode=""></image>
					<view class="center-part">关于我们</view>
				</view>
				<image class="right-part" src="/static/image/mine/rightArrow.png" mode=""></image>
			</view>
			<!--  -->
			<view class="setting-wrap" @tap="doContactUs">
				<view class="left-part">
					<image src="/static/image/mine/kefu.png" mode=""></image>
					<view class="center-part">联系客服</view>
				</view>
				<image class="right-part" src="/static/image/mine/rightArrow.png" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { IS_LOGIN } from '@/store/mutations.js';

import animation from '@/utils/animation.js';
import judgeLoginAndNavMixin from '@/utils/judge-login-and-nav-mixin.js';
export default {
	mixins: [animation, judgeLoginAndNavMixin],
	data() {
		return {
			isShow: true,  //如果是总管理员从首页点击的个人中心底部导航不展示
			IMG_BASE_URL: this.$http.IMG_BASE_URL
		};
	},
	computed: {
		...mapState(['userInfo']),
		...mapGetters([IS_LOGIN]),
	},
	filters:{
		formatAvatar(avatar){
			return avatar ? avatar : '/static/image/mine/headerUrl.png';
		}
	},
	onShow() {
		getApp().globalData.status = 1;
		this.$store.dispatch('queryUserInfo'); //重新刷新用户信息
	},
	methods: {
		// 联系我们
		doContactUs(){
			this.$http.getContactUsInfo().then(res => {
				if(res.code == 1){
					this.$helper.callPerson(res.data.configValue);
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
.mine-content {
	// top-wrap start
	.top-wrap {
		width: 750rpx;
		height: 380rpx;
		/* #ifdef APP-PLUS */
		height: 450rpx;
		/* #endif */
		background-image: url(/static/image/mine/mineBg.png);
		background-size: 100% 100%;
		padding-left: 24rpx;
		// mine-top start
		.mine-top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 25rpx 24rpx;

			image {
				width: 40rpx;
				height: 40rpx;
			}
		}

		// mine-top end
		// user-wrap start
		.user-wrap {
			display: flex;
			align-items: center;
			margin-top: 32rpx;
			image {
				width: 120rpx;
				height: 120rpx;
				border-radius: 50%;
			}
			.user-name {
				width: 450rpx;
				height: 50rpx;
				font-size: 36rpx;
				font-family: PingFang SC;
				font-weight: 500;
				line-height: 52rpx;
				color: rgba(255, 255, 255, 1);
				margin-left: 24rpx;
			}
		}
		// user-wrap end
	}
	// top-wrap end
	.poa {
		position: absolute;
		top: 276rpx;
		/* #ifdef APP-PLUS */
		top: 346rpx;
		/* #endif */
		left: 24rpx;
		border-radius: 16rpx;
		overflow: hidden;
		background-color: #FFFFFF;
	}
	// setting-wrap start
	.setting-wrap {
		width: 702rpx;
		height: 104rpx;
		background: rgba(255, 255, 255, 1);
		padding: 32rpx 24rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.left-part {
			display: flex;
			image {
				width: 40rpx;
				height: 40rpx;
			}
			.center-part {
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 400;
				line-height: 38rpx;
				color: rgba(51, 51, 51, 1);
				margin-left: 20rpx;
			}
		}
		.right-part {
			width: 11rpx;
			height: 24rpx;
		}
	}
	// setting-wrap end
	.setting-list {
		padding: 0 24rpx;
		border-radius: 16rpx;
		margin-top: 130rpx;
		overflow: hidden;
		.line-wrap {
			position: relative;
		}
		.line-wrap:after {
			content: '';
			position: absolute;
			z-index: 1;
			bottom: 0rpx;
			left: 24rpx;
			width: 654rpx;
			border-bottom: 1rpx solid rgba(238, 238, 238, 1);
			-webkit-transform: scaleY(0.5);
			transform: scaleY(0.5);
			-webkit-transform-origin: 0 0;
			transform-origin: 0 0;
		}
	}
}
</style>
