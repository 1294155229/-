<template>
	<view class="no-data-box flex-row-col-center">
		<view class="cont">
			<image src="/static/image/common/no_video.png" mode="widthFix"></image>
			<view class="info">{{ info }}</view>
		</view>
	</view>
</template>

<script>
const tipObj = {
	0: '暂无相关数据~'
}
export default {
	props: {
		type: {
			type: [Number, String],
			default: 0
		}
	},
	computed: {
		info() {
			return tipObj[this.type];
		}
	}
};
</script>

<style scoped lang="scss">
.no-data-box {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;

	.cont {
		text-align: center;
		image {
			width: 248rpx;
			height: 200rpx;
		}
		.info {
			margin-top: 44rpx;
			color: #999999;
			font-size: 28rpx;
		}
	}
}
</style>
