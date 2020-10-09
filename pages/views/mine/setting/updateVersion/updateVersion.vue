<template>
	<view class="aboutus-page">
		<image :src="IMG_BASE_URL + logo" mode=""></image>
		<view class="com-name">当前版本: {{version}}</view>
		<view class="info-bottom">
			<u-button type="primary" @tap="checkVersion" plain shape="circle">检查更新</u-button>
			<!-- <view class="info-text">Copyright©2020</view>
			<view class="info-text">All Rights Reserved</view> -->
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
	},
	onShow() {
		// #ifdef APP-PLUS
		plus.runtime.getProperty(plus.runtime.appid, inf => {
			this.version = inf.version;
		})	
		// #endif
	},
	methods: {
		// 获取版本号
		checkVersion() {
			// if (this.$systemType == 'ios') {
			// 	this.queryLastVersion(2);
			// } else {
			// 	this.queryLastVersion(1);
			// }
			let param = {
				type: this.$systemType == 'ios' ? 2 : 1,
				version: this.version
			}
			console.log(param);
			this.$http.doUpdateAPI(param).then(res => {
				if(res.code == 1){
					// 版本过低，应该进行更新
					uni.showModal({
						cancelText:"取消",
						confirmText:"确定",
						title:"提示",
						content: res.msg,
						success: (result) => {
							if(result.confirm){
								this.$upDateApp();
							}
						}
					})
				}else{
					this.$helper.showN('已是最新版本');
				}
			});
		},

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
		padding: 0 32rpx;
		// display: flex;
		// flex-direction: column;
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
