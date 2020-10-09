<template>
	<view class="change-page">
		<view class="change-list">
			<view class="change-item u-border-bottom line">
				<input v-model="form.oldPwd" type="password" maxlength="12" class="ipt" placeholder="请输入旧密码" placeholder-style="color:#BFBFBF">
			</view>
			<view class="change-item u-border-bottom line">
				<input v-model="form.newPwd" type="password" maxlength="12" class="ipt" placeholder="请输入新密码(6-12位)"  placeholder-style="color:#BFBFBF">
			</view>
			<view class="change-item u-border-bottom">
				<input v-model="form.newPwd2" v-if="isHidePwd" type="password" maxlength="12" class="ipt" placeholder="请确认新密码(6-12位)"  placeholder-style="color:#BFBFBF">
				<input v-model="form.newPwd2" v-else type="text" maxlength="12" class="ipt" placeholder="请确认新密码(6-12位)">
				<image class="icon" @tap="changeIsHidePwd" src="/static/image/login/see_close.png"></image>
			</view>
		</view>
		<view @tap="changePwd" class="save bottom-btn">
			保存
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isHidePwd: true,
				form:{
					oldPwd:'' , //老密码 
					newPwd:'', //新密码 
					newPwd2:'' //第二遍输入的新密码
				}
				
			};
		},
		methods:{
			changeIsHidePwd(){
				this.isHidePwd = !this.isHidePwd;
			},
			
			checkForm(form){
				const pswTest = /^[0-9a-zA-Z]{6,12}$/; // 6-12 位数字字母
				// 老密码 
				if (!pswTest.test(form.oldPwd)) {
					this.$helper.showN('请输入6-12位数字字母的旧密码')
					return false
				}
				if (!pswTest.test(form.newPwd)) {
					this.$helper.showN('请输入6-12位数字字母的新密码')
					return false
				}
				// 新密码 
				if (!pswTest.test(form.newPwd2)) {
					this.$helper.showN('请输入6-12位数字字母的确认密码')
					return false
				}
				// 密码两次一致 
				if (form.newPwd != form.newPwd2) {
					this.$helper.showN('请确认两次新密码输入一致')
					return false
				} else{
					return true
				}
			},
			changePwd(){
				/**
				 * author: lwj
				 * description: 修改密码
				 * @param oldPwd 老密码 newPwd	新密码 newPwd2	第二遍输入的新密码
				 * @return 
				 * @createTime: 2020-7-7 09:09:37
				 */
				this.$u.debounce(() => {
					if(this.checkForm(this.form)){
						this.$http.changePwd(this.form).then(res=>{
							if(res.code==1){
								this.$helper.showS('修改成功');
								this.$helper.backL(1, 800);
							}
						})
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	page{
		overflow: hidden;
		height: 100%;
	}
.change-page{
	.change-list{
		padding: 0 32rpx;
		background-color: #FFFFFF;
		.change-item{
			position: relative;
			padding: 32rpx 0;
			.ipt{
				font-size:28rpx;
				font-family:PingFang SC;
				font-weight:400;
			}
			.icon {
				position: absolute;
				right: 0;
				bottom: 33rpx;
				width: 38rpx;
				height: 18rpx;
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
		bottom: 88rpx;
	}
}
</style>
