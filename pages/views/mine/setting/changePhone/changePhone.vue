<template>
	<view class="change-page">
		<view class="change-list">
			<view class="change-item line">
				<input v-model="mobile" disabled=true type="number" maxlength="11" class="ipt" placeholder="请输入原手机号">
			</view>
			<view class="change-item line">
				<input v-model="newMobile" type="number" maxlength="11" class="ipt" placeholder="请输入新手机号">
			</view>
			<view class="change-item">
				<input v-model="captcha" type="number" maxlength="6" class="ipt" placeholder="请输入验证码">
				<view v-show="show"  class="get-code" @tap="testSend()">获取验证码</view>
				<!-- <text class="phone-get-code" >获取验证码</text> -->
				<view v-show="!show" class="get-code">{{count}}S</view>
			</view>
		</view>
		<view class="save bottom-btn" @tap='changeMobile'>
			保存
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				mobile:'',
				captcha:'',
				newMobile:'',
				count: '', // 验证码秒数
				show: true, // 秒数是否显示
				timer: null, //验证码定时器
			};
		},
		computed: {
			...mapState({
				userInfo: 'userInfo',
			})
		},
		onLoad() {
			// 初始化
			this.mobile = this.userInfo.mobile;
		},
		methods:{
			checkForm(){
				if(!this.phoneCheck(this.mobile)){
					uni.showToast({
						icon: 'none',
						title: '请输入正确的原手机号',
						duration: 2000
					});
					return false
				}
				if(!this.captcha){
					uni.showToast({
						icon:'none',
						title:'请输入验证码'
					})
					return false
				}
				if(!this.phoneCheck(this.newMobile)){
					uni.showToast({
						icon: 'none',
						title: '请输入正确的新手机号',
						duration: 2000
					});
					return false
				}else{
					return true
				}
			},
			changeMobile(){
				let data = {
					'event': 'changePhone',
					'mobile': this.mobile, //手机号
					'captcha': this.captcha,//验证码
					'newMobile': this.newMobile//新手机号
				}
				if(this.checkForm()){
				this.$http.changePhone(data).then(res => {
					if (res.code == 1) {
						this.$store.dispatch('queryUserInfo'); //重新刷新用户信息
						let _this = this;
						uni.showModal({
						    title: '温馨提示',
						    content: '修改成功,请重新登录',
							showCancel:false,
							success: function (res) {
							    if (res.confirm) {
							        // 本地存储token
							        uni.setStorage({
							        	key: "user_token",
							        	data: ''
							        })
							        // 更新用户信息
							        _this.$store.dispatch("initUser", null).then(r => {
							        	if(r.code == 0) {
							        		// 清空页面栈后跳转
							        		_this.$helper.reTo('/pages/views/login/login');
							        	}
							        })
							    }
							}
						});
					}
				});
				}
			},
			testSend(){
				if(this.phoneCheck(this.newMobile)){
					let data = {
						mobile:this.newMobile,
						event:'changePhone'
					}
					this.$http.sendSms(data).then(res => {
						console.log(res);
						if (res.code == 1) {
							this.setCodeTime();
						}
					});
				}
			},
			// 验证手机号校验
			phoneCheck(phone) {
				if(!phone){
					this.$helper.showN('请输入您的新手机号码');
					return false;
				}
				const telphone = /^1[23456789]\d{9}$/; // 手机号
				if (!telphone.test(phone)) {
					this.$helper.showN('请检查您的新手机号码格式');
					return false
				} else {
					return true
				}
			},
			// 获取验证码的倒计时
			setCodeTime() {
				const TIME_COUNT = 60;
				if (!this.timer) {
					this.count = TIME_COUNT;
					this.show = false;
					this.timer = setInterval(() => {
						if (this.count > 0 && this.count <= TIME_COUNT) {
							this.count--;
						} else {
							this.show = true;
							clearInterval(this.timer);
							this.timer = null;
						}
					}, 1000)
				}
			},
		}
	}
</script>

<style lang="scss">
	page{
		overflow: hidden;
		height: 100%;
		background-color: #F6F6F6;
	}
.change-page{
	.change-list{
		padding: 0 32rpx;
		background-color: #FFFFFF;
		.change-item{
			padding: 32rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.ipt{
				font-size:28rpx;
				font-family:PingFang SC;
				font-weight:400;
				// line-height:40px;
				color:rgba(191,191,191,1);
			}
			.get-code{
				font-size:28rpx;
				font-family:PingFang SC;
				font-weight:400;
				line-height:40rpx;
				color:rgba(50,150,250,1);
			}
			
		}
		.line{
			position: relative;
			// &:after {
			// 	@include bottom-line(#EEEEEE);
			// }
		}
	}
	.save{
		position: absolute;
		left: 50%;
		transform: translate(-50%);
		bottom: env(safe-area-inset-bottom);
		border-radius: 0;
		width: 100%;
	}
}

</style>
