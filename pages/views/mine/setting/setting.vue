<template>
	<view class="set-content">
		<view class="set-list">
			<view class="set-item u-border-bottom" @tap="judgeLoginAndNav('/pages/views/mine/setting/changePwd/changePwd')">
				<view class="set-title">
					修改密码
				</view>
				<image src="/static/image/mine/rightArrow.png" mode=""></image>
			</view>
			<view class="set-item u-border-bottom" @tap="judgeLoginAndNav('/pages/views/mine/setting/changePhone/changePhone')">
				<view class="set-title">
					修改手机号
				</view>
				<image src="/static/image/mine/rightArrow.png" mode=""></image>
			</view>
			<view class="set-item u-border-bottom" @tap="judgeLoginAndNav('/pages/views/mine/setting/feedback/feedback')">
				<view class="set-title">
					意见反馈
				</view>
				<image src="/static/image/mine/rightArrow.png" mode=""></image>
			</view>
			<view class="set-item u-border-bottom" @tap="$helper.to('/pages/views/mine/setting/aboutus/aboutus')">
				<view class="set-title">
					关于我们
				</view>
				<image src="/static/image/mine/rightArrow.png" mode=""></image>
			</view>
			<view class="set-item u-border-bottom" @tap="$helper.to('/pages/views/mine/setting/updateVersion/updateVersion')">
				<view class="set-title">
					版本更新
				</view>
				<image src="/static/image/mine/rightArrow.png" mode=""></image>
			</view>
			<view class="set-item u-border-bottom" @tap="$helper.to('/pages/views/login/xieyi?type=1')">
				<view class="set-title">
					隐私政策
				</view>
				<image src="/static/image/mine/rightArrow.png" mode=""></image>
			</view>
			<view class="set-item u-border-bottom" @tap="$helper.to('/pages/views/login/xieyi?type=2')">
				<view class="set-title">
					使用条款
				</view>
				<image src="/static/image/mine/rightArrow.png" mode=""></image>
			</view>
		</view>
		<view class="loginout-btn bottom-btn" @tap="loginOutBtn()" v-if="IS_LOGIN">
			退出当前账号
		</view>
	</view>
</template>

<script>
	import { IS_LOGIN } from '@/store/mutations.js';
	import { mapGetters } from 'vuex';
	import judgeLoginAndNavMixin from '@/utils/judge-login-and-nav-mixin.js';
	export default {
		mixins: [judgeLoginAndNavMixin],
		data() {
			return {
				
			};
		},
		computed:{
			...mapGetters([IS_LOGIN]),
		},
		methods:{
			loginOutBtn(){
				let _this = this;
				uni.showModal({
					title: '温馨提示',
					content: '确定要退出登录吗？',
					success: res => {
						if (res.confirm) {
							console.log('tuichu');
							uni.setStorage({
							    key: 'user_token',
							    data: '',
							    success: function () {
							        console.log('success');
									// 更新用户信息
									_this.$store.dispatch("initUser", null).then(r => {
										if(r.code == 0) {
											// 清空页面栈后跳转
											// _this.$helper.reTo('/pages/views/login/login');
											_this.$helper.showN('退出成功');
											setTimeout(() => {
												_this.$helper.to('/pages/views/login/login');
											}, 800);
										}
									})
							    }
							});
							// try {
							//     uni.setStorageSync('user_token', '');
							// } catch (e) {
							//     // error
							// 	// 更新用户信息
							// 	_this.$store.dispatch("initUser", null).then(r => {
							// 		if(r.code == 0) {
							// 			// 清空页面栈后跳转
							// 			_this.$helper.reTo('/pages/views/login/login');
										
							// 		}
							// 	})
							// }
							// 本地存储token
							// uni.setStorage({
							// 	key: "user_token",
							// 	data: ''
							// })
							
						} else if (res.cancel) {
							// console.log('用户点击取消');
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #FFFFFF;
	}
.set-content{
	padding: 0 32rpx;
	.set-list{
		.set-item{
			display: flex;
			justify-content: space-between;
			align-items: center;
			position: relative;
			.set-title{
				height:110rpx;
				font-size:28rpx;
				font-family:PingFang SC;
				font-weight:400;
				line-height: 110rpx;
				color:rgba(51,51,51,1);
			}
			image{
				width: 12rpx;
				height: 24rpx;
			}
			// &:after {
			// 	@include bottom-line(#EEEEEE);
			// }
		}
	}
	.loginout-btn{
		position: absolute;
		bottom: 40rpx;
		left: 50%;
		transform: translate(-50%);
	}
}
</style>
