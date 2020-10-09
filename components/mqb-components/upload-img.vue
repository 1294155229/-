<template>
	<view class="files-pic">
		<view @tap="upload" v-if="tempFilePaths.length > 0" class="img-item">
			<image :src="tempFilePaths" mode="aspectFit"></image>
		</view>
		<view @tap="upload" v-if="tempFilePaths.length <= 0" class="img-item">
			<image src="/static/image/common/add-icon.png" mode="aspectFit"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				count:1,	//最多可以选择的图片张数
				tempFilePaths: [], //本地保存图片路径
				imgs: [], //要发送给后台图片路径
			}
		},
		methods: {
			//点击图片 或者上传图片 调用微信小程序API选择图片
			upload() {
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
										_this.uploadImg(data)
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
			uploadImg(data) {
				let _this = this;
				uni.showLoading({
					title: '正在上传第' + (data.success <= 0 ? 1: ( data.success + 1)) + '/' + data.path.length,
					mask: true
				});
				
				uni.uploadFile({
					url: this.$http.baseUrl + 'common/uploadImageAli',
					filePath: data.path[data.i],
					name: 'files',
					header: {
						"X-Access-Token": this.$store.state.userToken
					},
					success: res => {
						uni.hideLoading();
						++data.success;
						//成功后 展示列表与发送路径列表 添加此图片
						_this.tempFilePaths = _this.tempFilePaths.concat([data.path[data.i]]);
						_this.imgs.push(JSON.parse(res.data).data);
						console.log(_this.tempFilePaths);
						console.log(_this.imgs);
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
		},
	}
</script>

<style lang="scss" scoped>
	.files-pic{
		.img-item{ margin-right: 20upx; }
		image{
			width: 144upx;
			height: 144upx;
		}
	}
</style>
