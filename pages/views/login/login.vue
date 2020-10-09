<template>
	<view class="container">
		<image class="login-bg" src="/static/image/login/login-bg.png" mode=""></image>
		<view class="name">欢迎来到幕墙宝</view>

		<view class="item">
			<view class="text">账号</view>
			<input type="text" v-model="phone" maxlength="11" placeholder-style="color:#BFBFBF" class="ipt" placeholder="请输入手机号" />
		</view>
		<view class="item">
			<view class="text">密码</view>
			<input class="ipt" v-if="isHidePwd" cursor-spacing="20" placeholder-style="color:#BFBFBF" type="password" v-model="password" placeholder="请输入密码(6-12位)" />
			<input class="ipt" v-else cursor-spacing="20" placeholder-style="color:#BFBFBF" type="text" v-model="password" placeholder="请输入密码(6-12位)" />
			<!-- <image class="icon" @tap="changeIsHidePwd" src="/static/image/login/see_close.png"></image> -->
			<view class="icon myiconfont" @tap="changeIsHidePwd">{{isHidePwd ? '&#xe7e6;' : '&#xe7e9;'}} </view>
		</view>

		<view class="register-box"><view class="register-btn" @tap="$helper.to('/pages/views/login/register')">注册</view></view>

		<view class="btn" @tap="userLogin">登录</view>

		<view class="bottom-text">
			<view class="bottom-item" @tap="$helper.to('/pages/views/login/forgetPwd')">忘记密码</view>
			<view class="bottom-item">l</view>
			<view class="bottom-item" @tap="$helper.to('/pages/views/login/codeLogin')">验证码登录</view>
		</view>
		<!-- quickLogin start-->
		<!-- <view class="quickLogin">
			<view class="leftLine"></view>
			<view class="quickLoginText">快捷登录</view>
			<view class="rightLine"></view>
		</view> -->
		<!-- quickLogin end -->
		<!-- <view class="wx-btn"><image @tap="oauth" class="img" src="/static/image/login/wechatLogin.png" mode=""></image></view> -->
	</view>
</template>

<script>
import { mapActions } from 'vuex';
export default {
	data() {
		return {
			isHidePwd: true,
			phone: '', //账号
			password: '' ,//密码
		};
	},
	onLoad() {},
	methods: {
		...mapActions(['initUser']),
		
		changeIsHidePwd(){
			this.isHidePwd = !this.isHidePwd;
		},
		
		/**
		 * 登录
		 */
		userLogin() {
			this.$u.debounce(() => {
				let errMsg = this.doValidate();
				if (errMsg) {
					this.$helper.showN(errMsg);
					return;
				}
				let data = {
					mobile: this.phone,
					password: this.password
				};
				this.$http.userLogin(data).then(res => {
					if (res.code == 1) {
						this.$helper.showN('登录成功');
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
			});
		},

		// 登录之前对账号和密码格式进行验证
		doValidate() {
			let errMsg = '';
			let mobile = this.phone;
			let regPwd = /^[0-9a-zA-Z]{6,12}$/;
			let password = this.password;
			if (!mobile) {
				errMsg = '请输入手机号码';
				return errMsg;
			}
			if (!password) {
				errMsg = '请输入密码';
				return errMsg;
			}
			if (!this.$u.test.mobile(mobile)) {
				errMsg = '请检查您的手机格式';
				return errMsg;
			}
			if (!regPwd.test(password)) {
				errMsg = '请检查您的密码';
				return errMsg;
			}
			return errMsg;
		},

		// 微信授权登录
		oauth(index) {
			uni.login({
				provider: 'weixin',
				success: res => {
					let unionId = res.authResult.unionid;
					uni.getUserInfo({
						provider: 'weixin',
						success: infoRes => {
							this.$http.userThirdLogin({unionId}).then(result => {
								if(result.code == 3 && result.msg === '未绑定账号'){
									this.$helper.to('/pages/views/login/bindPhone?unionId=' + unionId);
								}else if(result.code == 1){
									this.$helper.showN('登录成功');
									uni.setStorage({
										key: 'user_token',
										data: result.data.token
									});
									this.initUser(result.data).then(storeRes => {
										if(storeRes.code == 1){
											setTimeout(() => {
												this.$helper.tap('/pages/tabbar/index/index');
											}, 800)
										}
									})
								}
							})
						}
					})
					
					// 获取用户信息
		// 			uni.getUserInfo({
		// 				provider: provider,
		// 				success: infoRes => {
		// 					let { nickName, avatarUrl, gender } = infoRes.userInfo;
		// 					avatarUrl = avatarUrl.split('?')[0];
		// 					// 第三方授权成功时的处理函数
		// 					this.$flyApi.userThirdLogin(openid).then(result => {
		// 						console.log(result);
		// 						if (result.code == 1) {
		// 							gender = gender ? gender : 'm';
		// 							if (result.msg == '未绑定账号') {
		// 								uni.navigateTo({
		// 									url: `/pages/login/bindPhone/bindPhone?openId=${openid}&nickName=${nickName}&avatarUrl=${avatarUrl}&sex=${gender}&type=${index}`
		// 								});
		// 							} else {
		// 								this.myHXId = result.data.user.hxId;
		// 								this.myHXPsw = result.data.user.hxPassword;
		// 								uni.setStorageSync('myHXId', result.data.user.hxId);
		// 								uni.setStorageSync('myUsername', result.data.user.hxId);
		
		// 								uni.showToast({
		// 									title: '登录成功',
		// 									icon: 'none'
		// 								});
		// 								// 把用户token存储到本地缓存中
		// 								uni.setStorage({
		// 									key: 'user_token',
		// 									data: result.data.token
		// 								});
		// 								// 更新Vuex中当前的用户数据
		// 								this.$store.dispatch('initUser', result.data).then(storeRes => {
		// 									if (storeRes.code == 1) {
		// 										// 自动登录环信账号
		// 										// this.doLoginIM();
		// 										setTimeout(() => {
		// 											uni.switchTab({
		// 												url: '../home/home'
		// 											});
		// 										}, 1000);
		// 									}
		// 								});
		// 							}
		// 						}
		// 					});
		// 				}
		// 			});
				},
				fail: () => {
					console.log('用户取消了授权');
					uni.hideLoading();
				},
				complete() {
					uni.hideLoading();
				}
			});
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
	// text-align: center;

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
		margin-top: 420rpx;
		overflow: hidden;
	}

	.text {
		font-size: 30rpx;
		font-weight: bold;
		opacity: 1;
	}
	.ipt {
		margin-top: 24rpx;
		margin-bottom: 20rpx;
		border: none;
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 400;
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
}
// 注册按钮
.register-box {
	display: flex;
	justify-content: flex-end;
	width: 600rpx;
	height: 80rpx;
	line-height: 80rpx;
	margin: 0 auto;
	.register-btn {
		height: 100%;
		color: #2999f8;
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
// quickLogin start
.quickLogin {
	margin-top: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	.leftLine {
		width: 160rpx;
		height: 1rpx;
		background: rgba(238, 238, 238, 1);
	}

	.quickLoginText {
		margin-left: 10rpx;
		margin-right: 10rpx;
		// width: 104rpx;
		height: 37rpx;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 32rpx;
		color: rgba(153, 153, 153, 1);
	}

	.rightLine {
		width: 160rpx;
		height: 1px;
		background: rgba(238, 238, 238, 1);
	}
}

// quickLogin end
.wx-btn {
	margin-top: 30rpx;
	display: flex;
	justify-content: center;
	.img {
		width: 80rpx;
		height: 80rpx;
	}
}
.bottom-text {
	display: flex;
	justify-content: center;
	margin-top: 40rpx;
	.bottom-item {
		margin-left: 40rpx;

		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
		opacity: 1;
		&:nth-of-type(1) {
			margin-left: 0;
		}
	}
}

// input::-webkit-autofill {
// 	-webkit-box-shadow: 0 0 0px 1000px white inset;
// }
</style>
