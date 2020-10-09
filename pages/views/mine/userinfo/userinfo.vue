<template>
	<view class="warp">
		<view class="common u-border-bottom header">
			<view class="common_one">头像</view>
			<view @tap="ChooseImage" class="common_two">
				<!-- <image :src="form.avatar ? form.avatar :'/static/image/mine/noLogin.png'" mode=""></image> -->
				<!-- <image v-if="!avatar" src='/static/image/mine/headerUrl.png' mode="aspectFill"></image>
				<image v-if="isAddShow" :src="avatar | imgUrl" mode="aspectFill"></image>
				<image v-if="!isAddShow" :src="imgLists[0]" mode="aspectFill"></image> -->
				<image v-if="IS_LOGIN" :src="imgBaseUrl + form.avatar" mode="aspectFill"></image>
				<image v-else :src="form.avatar" mode="aspectFill"></image>
			</view>
		</view>
		<!-- <view class="common u-border-bottom">
			<view class="common_one">部门</view>
			<view class="common_two">
				<text>{{department | getDepartmentName}}</text>
				<text class="iconfont iconqianwang"></text>
			</view>
		</view> -->
		<view class="common u-border-bottom">
			<view class="common_one">昵称</view>
			<view class="common_two"><input type="text" maxlength="8" v-model="form.nickname" placeholder="输入昵称" /></view>
		</view>
		<view class="common u-border-bottom">
			<view class="common_one">性别</view>
			<view class="common_two">
				<picker mode="selector" :range="sexArr" :value="sexIndex" @change="bindPickerChange">
					<view>{{sexName}}</view>
				</picker>
				<!-- <picker :range="sex" :value="0" @change="bindPickerChange" mode="selector">
					<view class="uni-input">{{ sex[sexIndex] }}</view>
				</picker> -->
			</view>
		</view>
		<view class="common u-border-bottom">
			<view class="common_one">生日</view>
			<view class="common_two">
				<picker class="date-picker" mode="date" :value="form.birthday" :start="startDate" :end="endDate" @change="bindDateChange">
					<view class="uni-input">{{ form.birthday }}</view>
				</picker>
			</view>
		</view>
		<view class="common u-border-bottom">
			<view class="common_one">所在地址</view>
			<view class="common_two"><input type="text" value="" v-model="form.userAddress" placeholder="输入所在地址" /></view>
		</view>
		<!-- <view class="keep" @click="profile()">保存</view> -->
	</view>
</template>

<script>
let serveFrom = null;   // 临时存储获取的服务器端数据
import {IS_LOGIN} from '@/store/mutations.js';
import {mapGetters} from 'vuex';
let timer = null;
export default {
	data() {
		const currentDate = this.getDate({
			format: true
		});
		return {
			imgBaseUrl: this.$http.IMG_BASE_URL,
			isAddShow: true, // 是否显示默认图片

			date: currentDate,
			sexArr: ['男', '女'],
			sexIndex: 0, 
			sexName: '男',
			userAddress: '',
			department: '', //部门
			form: {
				avatar: '', //头像
				nickname: '', //昵称
				sex: '', //性别
				birthday: '', //生日
				userAddress: ''
			},
			imgLists: [],
			isUploadImg: true,
			submitUrl: '',
			addImgLists: [],
			avatar: '' //从接口中获取到的头像
		};
	},
	computed: {
		...mapGetters([IS_LOGIN]),
		startDate() {
			return this.getDate('start');
		},
		endDate() {
			return this.getDate('end');
		}
	},
	onLoad() {
		this.getUserInfo();

		/**
		 *  进入此页面时，一定是已经登录的用户，需要获取用户信息，保存到form中
		 *  把form中的字段与页面中的字段进行绑定
		 *  当修改完毕，点击保存时，把form字段作为参数传递给后台
		 */
	},
	onNavigationBarButtonTap() {
		clearTimeout(timer);
		timer = setTimeout( () => {
			// 判断当前的信息对象和最初从服务器获取的信息对象是否相同，如果不同，则说明已经被修改过，否则未被修改过
			let tempObj = Object.assign({}, this.form);
			if(tempObj.birthday.indexOf('请选择') != -1){
				tempObj.birthday = '';
				serveFrom.birthday = '';
			}
			if(this.$helper.deepCompare(serveFrom, tempObj)){
				this.$helper.showN('暂无可保存信息');
			}else{
				this.profile();
			}
		}, 300);
	},
	methods: {
		// 修改个人资料
		profile() {
			console.log('改进行保存了');
			if(this.form.birthday.indexOf('请选择') != -1){
				this.form.birthday = '';
			}
			// this.form.avatar = '/static/image/mine/headerUrl.png';
			this.$http.editUserInfo(this.form).then(res => {
				if (res.code == 1) {
					this.$helper.showN('修改成功');
					this.$store.dispatch('queryUserInfo'); //重新刷新用户信息
					this.$helper.backL();
				}
			});
		},
		// 获取个人资料
		getUserInfo() {
			/**
			 * author: lwj
			 * description: 调用获取个人资料接口
			 * @param nickname 昵称 sex 1男 2女
			 * @return sexIndex 0男 1女
			 * @createTime: 2020-7-3 19:36:09
			 */
			this.$http.getUserInfo().then(res => {
				if (res.code == 1) {
					this.form.nickname = res.data.nickname;
					this.sexIndex = res.data.sex;
					this.form.sex = res.data.sex;
					this.sexName = this.sexArr[this.sexIndex];
					this.department = res.data.departmentType;
					if (res.data.birthday) {
						this.date = res.data.birthday.substring(0, 10);
						this.form.birthday = res.data.birthday.substring(0, 10);
					}else{
						this.form.birthday = '请选择生日';
					}
					this.form.userAddress = res.data.userAddress;
					this.form.avatar = res.data.avatar;
					this.avatar = res.data.avatar;
					serveFrom = Object.assign({}, this.form);
					console.log(serveFrom);
					console.log(this.form);
				}
			});
		},
		
		// 性别改变时触发
		bindPickerChange: function(e) {
			let index = e.detail.value;
			this.form.sex = index;
			this.sexName = this.sexArr[index];
			console.log("》》》》》");
			console.log(this.form);
		},
		// 日期piker
		bindDateChange: function(e) {
			// this.date = e.target.value;
			this.form.birthday = e.target.value;
		},
		//获取当前时间
		getDate(type) {
			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();

			if (type === 'start') {
				year = year - 60;
			} else if (type === 'end') {
				year = year + 2;
			}
			month = month > 9 ? month : '0' + month;
			day = day > 9 ? day : '0' + day;
			return `${year}-${month}-${day}`;
		},
		/************************************* 上传图片 图片处理部分 start *****************************/
		//选择图片
		ChooseImage() {
			uni.chooseImage({
				sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['camera', 'album'], //从相册选择
				count: 1 - this.imgLists.length,
				success: res => {
					// 能否继续进行上传
					this.isUploadImg = true;
					uni.showLoading({
						title: '图片处理中...',
						mask: true
					});
					// 上传图片
					this.uploadimg({
						path: res.tempFilePaths
					});
				}
			});
		},

		//多张图片上传
		uploadimg(data) {
			this.imgLists = [];
			this.addImgLists = [];
			let that = this;
			let i = data.i ? data.i : 0;
			let success = data.success ? data.success : 0;
			let fail = data.fail ? data.fail : 0;

			uni.showLoading({
				title: '正在上传第' + (success <= 0 ? 1 : success + 1) + '/' + data.path.length,
				mask: true
			});
			uni.uploadFile({
				url: this.$http.IMG_UPLOAD_URL,
				filePath: data.path[i],
				name: 'files',
				header: {
					TOKEN: this.$store.state.userToken
				},
				success: resp => {
					success++;
					// console.log(resp);
					let img = JSON.parse(resp.data).data;
					
					this.imgLists = this.imgLists.concat([data.path[i]]);
					this.addImgLists.push(JSON.parse(resp.data).data);
					// let form = this.$helper.newObj(this.form)
					// form.avatar = img;
					// this.form = form;
					console.log("得到的图片", img);
					console.log(this.form);
					console.log(this.imgBaseUrl + img);
					this.$set(this.form, 'avatar', img);
				},
				fail: err => {
					fail++;
				},
				complete: () => {
					if (that.isUploadImg) {
						i++;
						if (i == data.path.length) {
							uni.showToast({
								icon: 'none',
								title: '成功' + success + '张'
							});
							if (this.imgLists.length >= 1) {
								this.isAddShow = false;
							}
						} else {
							//若图片还没有传完，则继续调用函数
							data.i = i;
							data.success = success;
							data.fail = fail;
							that.uploadimg(); //递归，回调自己
						}
					} else {
						return;
					}
				}
			});
		}
		/************************************* 上传图片 图片处理部分 end ************************************/
	}
};
</script>
<style lang="scss">
page {
	font-size: 28rpx;
	color: #111;
	background: #ffffff;
}
.warp {
	background: #fff;
}
.common {
	position: relative;
	width: 686rpx;
	margin: 0 auto;
	height: 100rpx;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: center;
	// &:after{
	//   @include bottom-line(#eee);
	// }
}
.common image {
	width: 98rpx;
	height: 98rpx;
	border-radius: 50%;
}
.common .common_two {
	width: 70%;
	text-align: right;
	color: #999999;
	font-size: 28rpx;
}
.common .common_two input {
	font-size: 28rpx;
}
.common_two label {
	height: 100upx;
	line-height: 100upx;
	display: inline-block;
	overflow: hidden;
	color: #111111;
}
.common_two label view {
	margin-left: 10upx;
	float: left;
}
.iconfont {
	margin-left: 8upx;
	font-size: 24upx;
}
.header {
	height: 120upx;
}
.pet_information {
	height: 76upx;
	line-height: 76upx;
	padding-left: 2%;
	background: #f5f5f5;
}
.keep {
	width: 100%;
	height: 90upx;
	line-height: 90upx;
	text-align: center;
	position: fixed;
	bottom: 0;
	color: #fff;
	background: #3296fa;
}
</style>
