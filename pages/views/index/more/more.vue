<template>
	<view class="page-cont">
		<view class="">
			<image class="more_img" src="/static/image/common/more.png" mode=""></image>
			<view class="more_text">敬请期待</view>
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
}
.page-cont {
	height: 70%;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	
	.more_img{
		width: 554rpx;
		height: 296rpx;
	}
	
	.more_text{
		margin-top: 110rpx;
		font-size: 36rpx;
		font-weight: bold;
		text-align: center;
	}
}
</style>
