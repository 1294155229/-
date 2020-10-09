<template>
	<view class="aboutus-page">
		<image :src="IMG_BASE_URL + logo" mode=""></image>
		<view class="com-name">当前版本: {{version}}</view>
		<view class="info-bottom">
			<view class="info-text">Copyright©2020</view>
			<view class="info-text">All Rights Reserved</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			version: '',// 当前版本
			logo: '',   
			IMG_BASE_URL: this.$http.IMG_BASE_URL,
		};
	},
	onLoad() {
		this.queryAboutUs();
		// #ifdef APP-PLUS
		plus.runtime.getProperty(plus.runtime.appid, inf => {
			this.version = inf.versionCode;
		})	
		// #endif
	},
	methods: {
		// 关于我们
		queryAboutUs() {
			this.$http.getAboutUs().then(res => {
				if (res.code == 1) {
					this.logo = res.data.logoUrl;
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #ffffff;
	height: 100%;
	overflow: hidden;
}

.aboutus-page {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 101rpx;
	image {
		width: 233rpx;
		height: 233rpx;
	}

	.com-name {
		height: 33rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 33rpx;
		color: rgba(51, 51, 51, 1);
	}
	.info-bottom {
		position: absolute;
		bottom: 68rpx;
		z-index: 2;
		left: 0;
		display: flex;
		flex-direction: column;
		width: 100%;
		.info-text {
			width: 100%;
			text-align: center;
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 400;
			line-height: 50rpx;
			color: rgba(153, 153, 153, 1);
		}
	}
}
</style>
