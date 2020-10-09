<template>
	<view class="sub-content">
		<image class="img-success" src="/static/image/mine/success.png" mode=""></image>
		<view class="text-title">
			提交成功
		</view>
		<view class="text-content">
			感谢您的反馈，我们将尽快核实处理
		</view>
		<view class="back-btn" @tap="$helper.back()">
			返回
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #FFFFFF;
	}
.sub-content{
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	.img-success{
		margin-top: 120rpx;
		width: 120rpx;
		height: 120rpx;
	}
	.text-title{
		margin-top: 32rpx;
		height:56rpx;
		font-size:40rpx;
		font-family:PingFang SC;
		font-weight:bold;
		line-height:56rpx;
		color:rgba(51,51,51,1);
	}
	.text-content{
		margin-top: 32rpx;
		height:37rpx;
		font-size:26rpx;
		font-family:PingFang SC;
		font-weight:bold;
		line-height:37rpx;
		color:rgba(51,51,51,1);
	}
	.back-btn{
		width:294rpx;
		height:88rpx;
		margin-top: 213rpx;
		background:rgba(50,150,250,0.08);
		border:1rpx solid rgba(50,150,250,1);
		border-radius:50rpx;
		font-size:30rpx;
		font-family:PingFang SC;
		font-weight:500;
		line-height:88rpx;
		color:rgba(50,150,250,1);
		text-align: center;
	}
}
</style>
