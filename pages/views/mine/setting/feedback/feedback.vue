<template>
	<view class="change">
		<view class="warp">
			<view class="feedback">
				<view class="feedback-title">反馈类型</view>
				<view class="feedback-reason">
					<view v-for="(item, index) in reasonList" :key="index" class="reason-item" :class="type == index ? 'active' : ''" @click="reason(index,item.configName)">
						{{ item.configValue || '其他' }}
					</view>
				</view>
			</view>
			<view class="feedback_content">
				<view class="feedback-title">反馈内容</view>
				<view class="content"><textarea class="row-textarea" v-model="content" placeholder="请提供详细问题描述，以便我们更快的解决问题" placeholder-style="color:#bfbfbf;" /></view>
				<view class="files-pic">
					<view @tap="upload(true)" v-if="tempFilePaths.length > 0" class="img-item"><image :src="tempFilePaths[0]" mode="aspectFit"></image></view>
					<view @tap="upload" v-if="tempFilePaths.length <= 0" class="img-item"><image src="/static/image/common/add-icon.png" mode="aspectFit"></image></view>
				</view>
			</view>
		</view>
		<view class="feedback-contact">
			<view class="feedback-title">请留下您的联系方式</view>
			<view class="feedback-form-row">
				<view class="feedback-form-item">
					<input v-model="contactWay" type="number" maxlength="11" placeholder="请输入您的手机号码" />
				</view>
			</view>
		</view>
		<view class="sub" @tap="addFeedback">提交</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			type: '0', //选中类型的下标
			reasonList:[], //反馈类型列表
			feedbackTypes:'',//反馈类型
			content:'',//反馈内容
			image:'',//图片的url
			contactWay:'',//联系方式
			count:1,	//最多可以选择的图片张数
			tempFilePaths: [], //本地保存图片路径
			imgs: [], //要发送给后台图片路径
		};
	},
	onLoad() {
		this.getFeedBackType()
	},
	methods: {
		// 表单校验
		checkForm(content,contactWay){
			const qqTest = /^[1-9][0-9]{4,9}$/; // 正则匹配QQ号
			const telTest = /^1[3456789]\d{9}$/; // 手机号
			if(!content){
				this.$helper.showN('请输入反馈内容');
				return false
			}
			// console.log(contactWay);
			if(!qqTest.test(contactWay) && !telTest.test(contactWay)){
				this.$helper.showN('请输入正确的手机号码或QQ号');
				return false
			}
			return true
		},
		addFeedback(){
			/**
			 * author: lwj
			 * description: 调用意见反馈提交按钮
			 * @param feedbackTypes 反馈类型		  
			 * @param content 反馈内容
			 * @param image 图片的url 非必填
			 * @param contactWay 联系方式
			 * @return 
			 * @createTime: 2020-7-4 17:41:47
			 */
			let data = {
				feedbackTypes : this.reasonList[this.type].id,
				content : this.content,
				image : this.imgs.join(','),
				contactWay : this.contactWay,
			}
			
			if(this.checkForm(this.content,this.contactWay)){
				console.log(this.$http.addFeedBack);
				this.$http.addFeedback(data).then(res=>{
					if(res.code==1){
						this.$helper.redirectL('/pages/views/mine/setting/feedback/submit-success/submit-success', 800)
					}
				})
			}
			
		},
		// 获取意见反馈类型
		getFeedBackType(){
			this.$http.getFeedBackType().then(res=>{
				if(res.code==1){
					this.reasonList = res.data
					this.feedbackTypes = res.data[0].configName
				}
			})
		},
		// 切换反馈问题
		reason(index,feedbackTypes) {
			this.type = index;
			this.feedbackTypes = feedbackTypes;
		},
		//点击图片 或者上传图片 调用微信小程序API选择图片
		upload(flag) {
			let _this = this;
			// let maxNum = 6 - this.tempFilePaths.length; //当前最多上传多少张
			// console.log(maxNum);
			// if(maxNum < 1) return this.$helper.showN('最多录入六张图片')
			uni.showActionSheet({
				itemList: ['拍照', '从手机相册选择'],
				success: res => {
					switch (res.tapIndex) {
						case 0:
							uni.chooseImage({
								count: 1,
								sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
								sourceType: ['camera'], //拍照
								success: res => {
									console.log(res)
									let data = {
										path: res.tempFilePaths,
										i: 0,
										success: 0,
										fail: 0
									}
									_this.uploadImg(data, flag)
								}
							});
							break;
						case 1:
							uni.chooseImage({
								count: 1, //默认9
								sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
								sourceType: ['album'], //从相册选择
								success: res => {
									let data = {
										path: res.tempFilePaths,
										i: 0,
										success: 0,
										fail: 0
									}
									_this.uploadImg(data)
								}
							});
							break;
						default:
							break;
					}
				},
				fail: function(res) {
					console.log(res.errMsg);
				}
			});
		},
		//上传图片到服务器函数
		uploadImg(data, flag) {
			let _this = this;
			uni.showLoading({
				title: '正在上传第' + (data.success <= 0 ? 1: ( data.success + 1)) + '/' + data.path.length,
				mask: true
			});
			
			uni.uploadFile({
				url: this.$http.IMG_UPLOAD_URL,
				filePath: data.path[data.i],
				name: 'files',
				header: {
					TOKEN: this.$store.state.userToken
				},
				success: res => {
					uni.hideLoading();
					++data.success;
					//成功后 展示列表与发送路径列表 添加此图片
					// _this.tempFilePaths = _this.tempFilePaths.concat([data.path[data.i]]);
					// _this.imgs.push(JSON.parse(res.data).data);
					
					_this.tempFilePaths = [data.path[data.i]];
					_this.imgs = [JSON.parse(res.data).data];
				
				},
				fail: err => {
					console.log(err)
					++data.fail;
				},
				complete: () => {
					++data.i;
					if (data.i == data.path.length) {
						//当图片传完时，停止调用
						console.log('执行完毕');
						console.log('成功：' + data.success + ' 失败：' + data.fail);
						uni.showToast({
							icon: 'none',
							title: '成功' + data.success + '张'
						});
					}
					else {
						//若图片还没有传完，则继续调用函数
						_this.uploadImg(data); //递归执行
					}
				}
			});
			
		},
		// upload: function() {	//上传图片
		// 	const _self = this;
		// 	uni.chooseImage({
		// 		count: _self.count,
		// 		sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
		// 		sourceType: ['album','camera'], //从相册选择
		// 		success: function(res) {
		// 			const tempFilePaths = res.tempFilePaths;
		// 			// 上传图片
		// 			const uploadTask = uni.uploadFile({
		// 				url: _self.$http.baseUrl + 'common/uploadImageAli',
		// 				filePath: tempFilePaths[0],
		// 				name: 'files',
		// 				formData: {
		// 					type: '图片'
		// 				},
		// 				success: function(uploadFileRes) {
		// 					// console.log(uploadFileRes.data);
		// 					//成功后 展示列表与发送路径列表 添加此图片
		// 					_self.tempFilePaths = tempFilePaths[0];
		// 					_self.imgs.push(JSON.parse(uploadFileRes.data).data);
		// 				}
		// 			});

		// 			uploadTask.onProgressUpdate(function(res) {
		// 				_self.percent = res.progress;
		// 				// console.log('上传进度' + res.progress);
		// 				// console.log('已经上传的数据长度' + res.totalBytesSent);
		// 				// console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
		// 				uni.showLoading({
		// 				    title: '正在上传'
		// 				});
		// 				if(res.progress == 100){
		// 					uni.hideLoading();
		// 				}
		// 			});
		// 		},
		// 		error: function(e) {
		// 			console.log(e);
		// 		}
		// 	});
		// }
	}
};
</script>

<style lang="scss">
page {
	background: #f6f6f6;
}
.change {
	font-size: 28upx;
	color: #333;
}
.feedback-title {
	padding: 32rpx 24rpx;
	font-size:32rpx;
	font-family:PingFang SC;
	font-weight:500;
	line-height:49rpx;
	color:rgba(51,51,51,1);
}
.warp {
	width: 100%;
	background: #fff;
	border-bottom: 20upx solid #eee;
}
.max-img{ width: 100%; height: 100%; }
.feedback {
	width: 100%;
	.feedback-reason {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		.reason-item{
			box-sizing: border-box;
			min-width: 29.33%;
			line-height: 58rpx;
			text-align: center;
			margin: 0 2% 20rpx;
			padding: 0 20rpx;
			background: #FFFFFF;
			font-size: 28rpx;
			border-radius: 28rpx;
			border:1rpx solid rgba(153,153,153,1);
			&.active{
				color: #039BFD;
				border: 1rpx solid #039BFD;
			}
		}
	}
}
.feedback_content {
	.feedback_content_top {
		height: 80rpx;
		line-height: 80rpx;
	}
	.content {
		padding: 0 32rpx;
		.row-textarea{
			box-sizing: border-box;
			padding: 24rpx;
			height:250rpx;
			background:rgba(250,250,250,1);
			width: 100%;
			border-radius:6px;
			font-size:28rpx;
			font-weight:400;
			line-height:32rpx;
		}
	}
	.files-pic{
		padding: 30upx;
		.img-item{ margin-right: 20upx; }
		image{
			width: 144upx;
			height: 144upx;
		}
	}
}
.feedback-contact {
	width: 100%;
	background: #fff;
	.feedback-form-row {
		padding: 0 33upx;
		.feedback-form-item {
			height: 90upx;
			display: flex;
			flex-wrap: wrap;
			flex-direction: row;
			align-items: center;
			border-bottom: 1upx solid #eee;
			text {
				width: 140upx;
			}
			// &:last-child{
			// 	border-bottom: none;
			// }
		}
	}
}
.sub {
	width: 100%;
	height: 100rpx;
	text-align: center;
	line-height: 100rpx;
	position: absolute;
	left: 0;
	bottom: 0;
	color: #fff;
	background: #3296FA;
}

</style>
