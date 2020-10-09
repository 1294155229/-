<template>
	<view class="">
		<view class="container">
			<view class="item">
				<view class="text">账号</view>
				<input type="number" v-model="phone" maxlength="11" class="ipt" placeholder="请输入手机号">
			</view>
			<view class="item">
				<view class="text">验证码</view>
				<input type="number" v-model="captcha" maxlength="6" class="ipt" placeholder="请输入验证码">
				<view class="get-code" v-if="codeTime==60" @click="getCode">获取验证码</view>
				<view class="get-code" v-else>{{codeTime}}s后重新发送</view>
			</view>
		</view>
		<view class="btn" @tap="userBindMobile">绑定手机</view>
	</view>
		
</template>

<script>
	import { mapActions } from 'vuex';
	export default {
		data() {
			return {
				codeTime: 60, //倒计时时间
				unionId: '',  // 当前用户的unionId
				phone: '', //账号
				captcha: '' //验证码
			};
		},
		onLoad({unionId}) {
			this.unionId = unionId;
		},
		methods: {
			...mapActions(['initUser']),
			
			/**
			 * 登录
			 */
			userBindMobile() {
				if(this.phone.length!=11) return this.$helper.showN('请输入合法手机号')
				if(this.captcha.length != 6) return this.$helper.showN('验证码错误')
				
				let param = {
					mobile: this.phone,
					event: 'bindPhone',
					captcha: this.captcha,
					unionId: this.unionId
				}
				this.$http.userThirdLoginBindPhone(param).then(res => {
					if (res.code == 1) {
						this.$helper.showN('绑定成功');
						uni.setStorage({
							key: 'user_token',
							data: res.data.token
						});
						console.log(typeof res.data);
						this.initUser(res.data).then(storeRes => {
							if(storeRes.code == 1){
								setTimeout(() => {
									this.$helper.tap('/pages/tabbar/index/index');
								}, 800)
							}
						})
					}
					
					if(res.code == 1) {
						// this.$store.dispatch("initUser", res).then(r => {
						// 	if(r.code == 1) {
						// 		// 账户权限0:普通仓库,1:仓库管理员，2:业务管理员，3:项目经理，4:管理员
						// 		if(userInfo.userType == '0') {
						// 			console.log(userInfo.wareHouseId);
						// 			// #ifdef APP-PLUS
						// 			this.cleanJYJPushTags(userInfo.wareHouseId);
						// 			// if(this.$systemType == 'android'){
						// 			// 	// android判断是否打开通知
						// 			// 	this.android_isNotificationEnabled();
						// 			// } 
						// 			// if(this.$systemType == 'ios'){
						// 			// 	// ios判断是否打开通知
						// 			// 	this.ios_requestNotificationAuthorization();
						// 			// }
						// 			// #endif
						// 			this.$helper.redirectL('/pages/views/index/storage/storage-index/storage-index')
						// 		}
						// 		if(userInfo.userType == '1') {
						// 			// #ifdef APP-PLUS
						// 			this.cleanJYJPushTags(userInfo.wareHouseId);
						// 			// #endif
						// 			this.$helper.redirectL('/pages/views/index/storage/storage-index/storage-index')
						// 		}
								
						// 		if(userInfo.userType == '2') {
						// 			this.cleanJYJPushTags1()
						// 			this.$helper.redirectL('/pages/views/index/business/business')
						// 		}
								
						// 		if(userInfo.userType == '3') {
						// 			this.$helper.redirectL('/pages/tabBar/index/index')
						// 			// #ifdef APP-PLUS
						// 				// this.cleanJYJPushTags('businessAdmin');
						// 				let arr= ["businessAdmin"]
						// 				arr.push(userInfo.wareHouseId)
						// 				this.cleanJYJPushTagsArr(arr);
						// 			// #endif
						// 		}
								
						// 		if(userInfo.userType == '4') {
						// 			this.$helper.redirectL('/pages/tabBar/index/index')
						// 			// #ifdef APP-PLUS
						// 				this.cleanJYJPushTags('admin');
						// 			// #endif
						// 		}
						// 		if(userInfo.userType == '') {
						// 			this.$helper.showN('您还没有权限')
						// 		}
								
						// 	}
						// })
					}
				});
			},
			/**
			 * 获取验证码
			 */
			getCode() {
				
				let data = {
					mobile: this.phone,
					event: 'bindPhone'
				}
				if(data.mobile.length != 11) return this.$helper.showN('请输入正确的手机号')
				
				this.downTime();
				this.$http.sendSms(data).then(res => {
					if(res.code == 1) {
						this.$helper.showS('发送成功')
					}
				})
				
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
			cleanJYJPushTags(tagName) {
				let _this = this;
				const jyJPush = uni.requireNativePlugin('JY-JPush');
				jyJPush.cleanJYJPushTags(
					result => {
						console.log(JSON.stringify(result));
						_this.setJYJPushTags(tagName);
					});
			},
			// 给不同仓库的人设置标签 标签为仓库id
			setJYJPushTags(tagName) {
				console.log(tagName);
				const jyJPush = uni.requireNativePlugin('JY-JPush');
				jyJPush.setJYJPushTags({
					userTag: tagName
				}, result => {
					console.log(JSON.stringify(result));
				});
			},
			// 清除tags
			cleanJYJPushTags1(){
				const jyJPush = uni.requireNativePlugin('JY-JPush');
				jyJPush.cleanJYJPushTags(
					result => {
						uni.showToast({
							icon: 'none',
							title: JSON.stringify(result)
						})
					});
			},
			// 清除tags后以数组方式设置Tags
			cleanJYJPushTagsArr(arr) {
				let _this = this;
				const jyJPush = uni.requireNativePlugin('JY-JPush');
				jyJPush.cleanJYJPushTags(
					result => {
						console.log(JSON.stringify(result));
						_this.jy_setTags(arr);
					});
			},
			// 清除tags后以数组方式设置Tags
			jy_setTags(arr){
				const jyJPush = uni.requireNativePlugin('JY-JPush');
				jyJPush.addJYJPushTagsWithArr({
					userTags: arr
				},result=> {
					// uni.showToast({
					// 	icon: 'none',
					// 	title: JSON.stringify(result)
					// })
					console.log(JSON.stringify(result));
				});
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F7F7F7;
	}
	.container {
		position: relative;
		overflow: hidden;
		padding: 0 32rpx;
		background-color: #FFFFFF;
	}
	.login-bg {
		width: 750rpx;
		height: 441rpx;
		position: absolute;
		top: 0;
		left: 0;
		overflow: hidden;
	}
	.item {
 		border-bottom: 1px solid rgba(238,238,238,1);
		display: flex;
		height: 119rpx;
		flex-direction: row;
		align-items: center;
		position: relative;
		overflow: hidden;
		background-color: #fff;
		
		.text {
			width: 150rpx;
			font-size:32rpx;
			font-weight:bold;
			color:rgba(51,51,51,1);
			opacity:1;
		}
		.ipt {
			margin-top: 24rpx;
			margin-bottom: 20rpx;
			border: none;
			font-size:32rpx;
			font-family:PingFang SC;
			font-weight:400;
			color:#333333;
			opacity:1;
			overflow: hidden;
			background-color: #fff;
			-webkit-box-shadow: none;
			
			
			&::-webkit-input-placeholder {
				color:rgba(191,191,191,1);
				background-color: #fff;
			}
			&::-moz-placeholder {
				color:rgba(191,191,191,1);
				background-color: #fff;
			}
			&::-ms-input-placeholder {
				color:rgba(191,191,191,1);
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
			font-size:24rpx;
			font-family:PingFang SC;
			font-weight:400;
			line-height: 50rpx;
			color:rgba(41,153,248,1);
			opacity:1;
		}
	}
	.btn {
		position: absolute;
		left: 50%;
		transform: translate(-50%);
		bottom: 160rpx;
		width: 686rpx;
		height: 88rpx;
		background: #02B5FC;
		opacity: 1;
		border-radius: 50px;
		text-align: center;
		line-height: 88rpx;
		color: #ffffff;
		font-size: 32rpx;
	}
	.bottom-text {
		display: flex;
		justify-content: center;
		margin-top: 40rpx;
		.bottom-item {
			margin-left: 40rpx;
			
			font-size:28rpx;
			font-family:PingFang SC;
			font-weight:400;
			color:rgba(153,153,153,1);
			opacity:1;
			&:nth-of-type(1) {
				margin-left: 0;
			}
		}
	}
	
	// input::-webkit-autofill {
	// 	-webkit-box-shadow: 0 0 0px 1000px white inset;
	// }
</style>
