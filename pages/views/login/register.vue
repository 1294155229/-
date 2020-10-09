<template>
	<view class="">
		<u-navbar title="注册" :borderBottom="false" immersive isFixed :background="{ background: 'rgba(0, 0, 0, 0)' }"></u-navbar>

		<view class="container">
			<image class="login-bg" src="/static/image/login/login-bg.png" mode=""></image>
			<view class="name">欢迎来到幕墙宝</view>

			<view class="item">
				<view class="text">账号</view>
				<input type="number" v-model="phone" placeholder-style="color:#BFBFBF" maxlength="11" class="ipt" placeholder="请输入手机号" />
			</view>
			<view class="item">
				<view class="text">验证码</view>
				<input type="number" v-model="captcha" placeholder-style="color:#BFBFBF" maxlength="6" class="ipt" placeholder="请输入验证码" />
				<view class="get-code" v-if="codeTime == 60" @click="getCode">获取验证码</view>
				<view class="get-code" v-else>{{ codeTime }}s后重新发送</view>
			</view>
			<view class="item">
				<view class="text">密码</view>
				<input type="password" v-if="isLookPwd[0]" v-model="password" placeholder-style="color:#BFBFBF" class="ipt" placeholder="请输入密码(6-12位)" />
				<input type="text" v-else v-model="password" placeholder-style="color:#BFBFBF" class="ipt" placeholder="请输入密码(6-12位)" />
				<!-- <image class="icon" @tap="changeLookPwdState(0)" src="/static/image/login/see_close.png"></image> -->
				<view class="icon myiconfont" @tap="changeLookPwdState(0)">{{isLookPwd[0] ? '&#xe7e6;' : '&#xe7e9;'}} </view>
			</view>
			<view class="item">
				<view class="text">确认密码</view>
				<input type="password" v-if="isLookPwd[1]" v-model="repassword" placeholder-style="color:#BFBFBF" class="ipt" placeholder="请输入密码(6-12位)" />
				<input type="text" v-else v-model="repassword" placeholder-style="color:#BFBFBF" class="ipt" placeholder="请输入密码(6-12位)" />
				<!-- <image class="icon" @tap="changeLookPwdState(1)" src="/static/image/login/see_close.png"></image> -->
				<view class="icon myiconfont" @tap="changeLookPwdState(1)">{{isLookPwd[1] ? '&#xe7e6;' : '&#xe7e9;'}} </view>
			</view>

			<view class="btn" @tap="userBindMobile">注册</view>

			<view class="bottom-text">
				<view class="bottom-item">点击注册即默认同意</view>
				<view class="bottom-item xieyi" @tap="$helper.to('/pages/views/login/xieyi?type=3')">《用户注册协议》</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapActions } from 'vuex'; 
export default {
	data() {
		return {
			codeTime: 60, //倒计时时间
			phone: '', //账号
			password: '', //密码
			repassword: '', //重复密码
			captcha: '' ,//验证码
			isLookPwd: {
				0: true,   // 密码
				1: true   // 确认密码
			}
		};
	},
	methods: {
		...mapActions(['initUser']),
		/**
		 * 登录
		 */
		userBindMobile() {
			if (this.phone.length != 11) return this.$helper.showN('请输入合法手机号');
			if (this.captcha.length != 6) return this.$helper.showN('验证码错误');
			if (this.password.length < 6 || this.password.length > 21) return this.$helper.showN('请输入与6-20位合法密码');
			if (this.password != this.repassword) return this.$helper.showN('两次输入密码不一致');
			let data = {
				mobile: this.phone,
				password: this.password,
				capture: this.captcha
			};
			this.$http.userRegister(data).then(res => {
				if (res.code == 1) {
					this.$helper.showN('注册成功');
					uni.setStorage({
						key: 'user_token',
						data: res.data.token
					});
					this.initUser(res.data).then(storeRes => {
						if(storeRes.code == 1){
							setTimeout(() => {
								this.$helper.tap('/pages/tabbar/index/index');
							}, 800)
						}
					})
				}
			});
		},
		/**
		 * 获取验证码
		 */
		getCode() {
			let data = {
				mobile: this.phone,
				event: 'register'
			};
			if (data.mobile.length != 11) return this.$helper.showN('请输入正确的手机号');
			this.downTime();
			this.$http.sendSms(data).then(res => {
				if (res.code == 1) {
					this.$helper.showS(res.data);
				}
			});
		},

		/**
		 * 发送验证码倒计时
		 */
		downTime() {
			if (this.codeTime == 0) {
				this.codeTime = 60;
				return;
			} else {
				this.codeTime--;
				setTimeout(() => {
					this.downTime();
				}, 1000);
			}
		},

		// 是否查看密码状态修改
		changeLookPwdState(type){
			this.$set(this.isLookPwd, type, !this.isLookPwd[type]);
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #fff;
}
.container {
	position: relative;
	overflow: hidden;
}
.login-bg {
	width: 750rpx;
	height: 441rpx;
	position: absolute;
	top: 0;
	left: 0;
	overflow: hidden;
}
.name {
	position: absolute;
	top: 246rpx;
	left: 50%;
	width: 600rpx;
	transform: translate(-50%);

	font-size: 50rpx;
	font-family: PingFang SC;
	font-weight: bold;
	color: rgba(51, 51, 51, 1);
	opacity: 1;
}
.item {
	margin: 40rpx auto 0;
	width: 600rpx;
	border-bottom: 1px solid rgba(238, 238, 238, 1);
	display: flex;
	flex-direction: column;
	position: relative;
	overflow: hidden;
	background-color: #fff;
	&:nth-of-type(2) {
		margin-top: 370rpx;
		overflow: hidden;
	}

	.text {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		opacity: 1;
	}
	.ipt {
		margin-top: 24rpx;
		margin-bottom: 20rpx;
		border: none;
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #333333;
		opacity: 1;
		overflow: hidden;
		background-color: #fff;
		-webkit-box-shadow: none;

		&::-webkit-input-placeholder {
			color: rgba(191, 191, 191, 1);
			background-color: #fff;
		}
		&::-moz-placeholder {
			color: rgba(191, 191, 191, 1);
			background-color: #fff;
		}
		&::-ms-input-placeholder {
			color: rgba(191, 191, 191, 1);
			background-color: #fff;
		}
	}
	.icon {
		position: absolute;
		right: 0;
		bottom: 33rpx;
		width: 38rpx;
		height: 18rpx;
	}
	.get-code {
		position: absolute;
		right: 0;
		bottom: 20rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 50rpx;
		color: rgba(41, 153, 248, 1);
		opacity: 1;
	}
}
.btn {
	margin: 50rpx auto 0;
	width: 600rpx;
	height: 88rpx;
	background: #02b5fc;
	opacity: 1;
	border-radius: 50rpx;
	font-size: 32rpx;
	text-align: center;
	line-height: 88rpx;
	color: #ffffff;
}
.bottom-text {
	display: flex;
	justify-content: center;
	margin-top: 40rpx;
	.bottom-item {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
		opacity: 1;
		&:nth-of-type(1) {
			margin-left: 0;
		}
		&.xieyi {
			color: #02b5fc;
		}
	}
}

// input::-webkit-autofill {
// 	-webkit-box-shadow: 0 0 0px 1000px white inset;
// }
</style>
