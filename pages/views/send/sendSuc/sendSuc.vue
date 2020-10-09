<template>
	<view class="page-cont">
		<view class="">
			<view class="">
				<image class="more_img" src="/static/image/common/sendSuc.png" mode=""></image>
				<view class="tip_info">发布成功</view>
			</view>
			<view class="more_text" @tap="$helper.tap('/pages/tabbar/index/index')">返回首页</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	}
};
</script>

<style lang="scss">
page {
	width: 100%;
	height: 100%;
	background-color: #ffffff;
}
.page-cont {
	height: 70%;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;

	.more_img {
		width: 295rpx;
		height: 234rpx;
	}

	.tip_info {
		margin-top: -30rpx;
		font-size: 32rpx;
		color: #333333;
		text-align: center;
		font-weight: 600;
	}

	.more_text {
		margin-top: 220rpx;
		font-size: 28rpx;
		color: #ffffff;
		font-weight: bold;
		text-align: center;
		width: 280rpx;
		height: 72rpx;
		line-height: 72rpx;
		background: #02b5fc;
		opacity: 1;
		border-radius: 36px;
	}
}
</style>
