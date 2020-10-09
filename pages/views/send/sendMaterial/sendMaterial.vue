<template>
	<view>
		<view class="form u-border-top">
			<view class="form-row u-border-bottom" v-if="list">
				<view class="label-box"><view class="label">材料分类</view></view>
				<view class="right-box">
					<picker mode="selector" :range="list" range-key="classifyName" @change="selectChange">
						<view class="u-flex">
							<view class="text" :class="Typeofwork == -1 ? 'color1' : ''">{{ Typeofwork == -1 ? '请选择' : list[Typeofwork].classifyName }}</view>
							<u-icon class="icon" name="arrow-right" color="#BFBFBF" size="26"></u-icon>
						</view>
					</picker>
				</view>
			</view>

			<view class="form-row u-border-bottom">
				<view class="label-box"><view class="label">公司名称</view></view>
				<view class="right-box"><input class="input" type="text" placeholder="请输入" placeholder-style="color:#BFBFBF" v-model="form.title" /></view>
			</view>

			<view class="form-row u-border-bottom">
				<view class="label-box"><view class="label">联系方式</view></view>
				<view class="right-box"><input class="input" type="number" placeholder="请输入" maxlength="11" placeholder-style="color:#BFBFBF" v-model="form.contactWay" /></view>
			</view>
			<view class="form-row u-border-bottom">
				<view class="label-box"><view class="label">经营品牌</view></view>
				<view class="right-box"><input class="input" type="text" placeholder="请输入" placeholder-style="color:#BFBFBF" v-model="form.brand" /></view>
			</view>
			<view class="form-row u-border-bottom">
				<view class="label-box"><view class="label">经营范围</view></view>
				<view class="right-box"><input class="input" type="text" placeholder="请输入" placeholder-style="color:#BFBFBF" v-model="form.runRange" /></view>
			</view>
		</view>
		<view class="line_bar"></view>
		<view class="form">
			<view class="form-row u-border-bottom"><view class="title">公司简介</view></view>
			<textarea class="textarea u-border" v-model="form.intro" placeholder="多行输入" placeholder-style="color:#BFBFBF" />
		</view>
		<view class="form">
			<view class="form-row u-border-bottom"><view class="title">工程案例</view></view>
			<textarea class="textarea u-border" v-model="form.projectCase" placeholder="多行输入" placeholder-style="color:#BFBFBF" />
		</view>
		<view class="uplodImg">
			<view class="imgs" v-for="(it, i) in weighingImg" :key="i" >
				<image :src="it" mode="aspectFill" @tap="previewImage(it,i)"></image>
				<image class="closeimage" data-id="2" :data-index="index" src="/static/image/common/close_icon.png" mode="" @click="aoutaddimg(i)"></image>
			</view>
			<view class="upload" v-if="weighingImg.length < 9" @tap="addPic(1)"></view>
		</view>
		<view class="send-bottom-btn-box"><view class="bottom-btn" @click="adddata">发布</view></view>
		<!-- 底部添加图片 -->

		<!-- :areaCode="userInfoMsg.userAddressCode ? userInfoMsg.userAddressCode : []" -->
		<!-- :hideArea="true" -->
		<w-picker mode="region" @confirm="onCityConfirm" ref="selector" themeColor="#5AA792" :selectList="proviceData"></w-picker>
	</view>
</template>

<script>
import wPicker from '@/components/uniapp-components/w-picker/w-picker.vue';
import proviceData from '@/components/uniapp-components/w-picker/city-data/province.js';
export default {
	components: {
		wPicker
	},
	data() {
		return {
			items: {},
			Typeofwork: -1, //选择工种
			choosename: 0, //选择忙闲返回
			id: '', // 当前记录的ID
			iconId: '', // 所属分类ID
			list: [],
			form: {
				contactName: '', //姓名
				contactWay: '', //联系方式
				address: '', //地址、籍贯
				firstWorkAddr: '', //优先考虑工作地点
				state: '', //工作状态：1、忙 0、闲
				projectCase: '', //工程案例
				classifyIds: '', //二级分类
				brand: '',
				runRange: '',
				intro: ''
			},
			proviceData: proviceData,
			shows: false,
			bjstate: false,
			weighingImg: [] //添加图片
		};
	},

	//获取传参
	onLoad(options) {
		let that = this;
		let data = JSON.parse(options.item); // 字符串转对象
		this.id = data.sort ? data.sort : '';
		this.iconId = data.sort ? data.sort : '';
		if (typeof data.iconId == 'string') {
			data.num = data.iconId;
			this.bjstate = true;
			data.title = data.infoTitle;
			this.shows = true;
			this.form = data;
			this.choosename = parseInt(data.workStatus);
			if (data.imgUrls) {
				let imgs = JSON.parse(data.imgUrls);
				imgs.forEach(resd => {
					that.weighingImg = [...that.weighingImg, this.$http.IMG_BASE_URL + resd];
				});
			}
		} else {
			data.num = data.id;
			this.id = data.sort ? data.sort : '';
		}
		this.items = data;
		this.$http.getSecondClassifyList(data.num).then(res => {
			if (res.code == 1) {
				let datas = Object.keys(res.data).length == 0;
				datas ? (that.list = '') : (that.list = res.data);
				if (this.bjstate) {
					res.data.map((item, index) => {
						item.id == data.classifyIds ? (that.Typeofwork = index) : '';
					});
				}
			}
		});
	},
	methods: {
		//预览图片
			previewImage(index,i){
				// var i = this.detailList[0].lunboImg; //获取当前页面的轮播图数据
				//uniapp预览轮播图
				var arr = [];
				arr.push(index);
				uni.previewImage({
					current:i, //预览图片的下标
					urls:arr//预览图片的地址，必须要数组形式，如果不是数组形式就转换成数组形式就可以
				})
			},
		//点击切换二类
		selectChange(ev) {
			this.Typeofwork = ev.detail.value;
			this.shows = true;
		},
		//点击闲和忙
		chooseStatus() {
			let that = this;
			uni.showActionSheet({
				itemList: ['闲', '忙'],
				success: tapIndex => {
					that.choosename = tapIndex.tapIndex;
				}
			});
		},

		openCityPicker() {
			this.$refs.selector.show();
		},

		onCityConfirm(e) {
			this.form.address = e.checkArr[0] + e.checkArr[1];
			// if (this.modeStatus == 'selector') {
			// 	this.userInfoMsg.sex = e.result == '男' ? 0 : 1;
			// } else if (this.modeStatus == 'region') {
			// 	this.userInfoMsg.userAddress = e.result;
			// 	this.userInfoMsg.userAddressCode = e.checkValue; // 默认选中的地址的索引 code值
			// }
		},
		//上传
		adddata() {
			this.$u.debounce(() => {
			let name = '';
			this.form.title ? '' : (name = name + '公司名称/');
			this.form.contactWay.length == 11 ? '' : (name = name + '联系方式/');
			this.form.brand ? '' : (name = name + '经营品牌/');
			this.form.runRange ? '' : (name = name + '经营范围/');
			this.form.intro ? '' : (name = name + '公司简介/');
			this.form.projectCase ? '' : (name = name + '工程案例/');
			this.shows ? '' : (name = name + '分类/');
			if (name) {
				let data = name.substr(0, name.length - 1);
				return this.$helper.showN('请输入' + data);
			}
			let data = this.form;
			if (this.weighingImg) {
				let names = [];
				this.weighingImg.forEach(resd => {
					let imgs = resd.split(this.$http.IMG_BASE_URL);
					names = [...names, imgs[1]];
				});
				data.imgUrls = JSON.stringify(names);
			}
			data.state = this.choosename;
			this.list ? (data.classifyIds = this.list[this.Typeofwork].id) : '';
			data.latitude = this.$store.state.userPosition.latitude;
			data.longitude = this.$store.state.userPosition.longitude;
			uni.showLoading({ title: '加载中', mask: true });
			if (this.bjstate) {
				//编辑
				data.infoTitle = data.title;
				data.workStatus = data.state;
				data.createTime = '';
				data.updateTime = '';
				// console.log(data)
				this.$http.getInfoaddEvaluaeditInfo(data).then(res => {
					setTimeout(function() {
						uni.hideLoading();
						that.$helper.showN(res.msg);
					}, 1999);
					if (res.code == 1) {
						setTimeout(function() {
							uni.navigateBack({
								delta: 1
							});
						}, 2000);
					}
				});
			} else {
				let that = this;
				data.iconId = this.items.id;
				
				// 添加经纬度和当前的城市名称
				data.cityName = this.$store.state.userPosition.city;
				data.longitude = this.$store.state.userPosition.longitude;
				data.latitude = this.$store.state.userPosition.latitude;
				
				this.$http.getSecondClassissueInfo(data).then(res => {
					setTimeout(function() {
						uni.hideLoading();
						that.$helper.showN(res.msg);
					}, 1999);
					if (res.code == 1) {
						setTimeout(function() {
							that.$helper.redirect('/pages/views/send/sendSuc/sendSuc');
						}, 2000);
					}
				});
			}
			})
		},
		aoutaddimg(index) {
			let that = this;
			uni.showModal({
				title: '温馨提示',
				content: '是否删除该照片',
				success: res => {
					if (res.confirm) {
						let data = [];
						for (let i in this.weighingImg) {
							i == index ? '' : (data = [...data, that.weighingImg[i]]);
						}
						that.weighingImg = data;
					} else if (res.cancel) {
						// console.log('用户点击取消');
					}
				}
			});
		},
		//添加评论图片
		addPic(index) {
			this.index = index;
			this.chooseImage(this.index);
		},

		chooseImage(index) {
			let isUpload = true;
			let count = 9;
			if (index == 1) {
				isUpload = this.weighingImg.length < 9;
				count = 9 - this.weighingImg.length;
			}
			if (isUpload) {
				// console.log(isUpload)
				uni.chooseImage({
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['camera', 'album'], //从相册选择
					count: count,
					success: res => {
						this.isUploadImg = true;
						uni.showLoading({
							title: '图片处理中...',
							mask: true
						});
						this.uploadimg(
							{
								path: res.tempFilePaths
							},
							index
						);
					}
				});
			} else {
				uni.showToast({
					icon: 'none',
					title: '最多只能上傳九張圖片',
					duration: 2000
				});
			}
		},
		//多张图片上传
		uploadimg(data, index) {
			// console.log("Datadata",data)
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
					if (index == 1) {
						let datas = JSON.parse(resp.data);
						// this.imgLists=this.imgLists.concat([data.path[i]]);

						// this.carImg = this.addImgLists.toString();

						this.weighingImg.push(this.$http.IMG_BASE_URL + datas.data);
					}
				},
				fail: err => {
					fail++;
					console.log('fail', fail);
				},
				complete: () => {
					if (that.isUploadImg) {
						i++;
						if (i == data.path.length) {
							//当图片传完时，停止调用
							// console.log('执行完毕');
							// console.log('成功：' + success + ' 失败：' + fail);
							uni.showToast({
								icon: 'none',
								title: '成功' + success + '张'
							});
							if (this.imgLists.length >= 9) {
								this.isAddShow = false;
							}
						} else {
							//若图片还没有传完，则继续调用函数
							data.i = i;
							data.success = success;
							data.fail = fail;
							that.uploadimg(data, that.index); //递归，回调自己
						}
					} else {
						return;
					}
				}
			});
			return;
			// 上传图之前先进行一次压缩
			uni.compressImage({
				src: data.path[i],
				quality: 80,
				success: com_res => {
					console.log('压缩图片成功', com_res);
					uni.uploadFile({
						url: this.$http.IMG_UPLOAD_URL,
						filePath: com_res.tempFilePath,
						name: 'files',
						header: {
							TOKEN: this.$store.state.userToken
						},
						success: resp => {
							success++;
							if (index == 1) {
								// this.imgLists=this.imgLists.concat([data.path[i]]);
								// this.addImgLists.push(JSON.parse(resp.data).data);
								// this.carImg = this.addImgLists.toString();
								this.carImg.push(JSON.parse(resp.data).data);
							}
						},
						fail: err => {
							fail++;
							console.log('fail', fail);
						},
						complete: () => {
							if (that.isUploadImg) {
								i++;
								if (i == data.path.length) {
									//当图片传完时，停止调用
									// console.log('执行完毕');
									// console.log('成功：' + success + ' 失败：' + fail);
									uni.showToast({
										icon: 'none',
										title: '成功' + success + '张'
									});
									if (this.imgLists.length >= 9) {
										this.isAddShow = false;
									}
								} else {
									//若图片还没有传完，则继续调用函数
									data.i = i;
									data.success = success;
									data.fail = fail;
									that.uploadimg(data, that.index); //递归，回调自己
								}
							} else {
								return;
							}
						}
					});
				},
				fail: com_err => {
					console.log('压缩图片失败');
					uni.uploadFile({
						url: this.$http.IMG_UPLOAD_URL,
						filePath: data.path[i],
						name: 'files',
						header: {
							TOKEN: uni.getStorageSync('user_token')
						},
						success: resp => {
							uni.hideLoading();
							success++;
							// if(index == 1){
							// 	this.imgLists.push(JSON.parse(resp.data).data);
							// 	this.carImg = this.imgLists.toString();
							// }else if(index == 2){
							// 	this.imgTwoLists.push(JSON.parse(resp.data).data);
							// 	this.weighingImg = this.imgTwoLists.toString();
							// }
						},
						fail: err => {
							fail++;
							// console.log('fail:' + i + 'fail:' + fail);
						},
						complete: () => {
							if (that.isUploadImg) {
								i++;
								if (i == data.path.length) {
									//当图片传完时，停止调用
									// console.log('执行完毕');
									// console.log('成功：' + success + ' 失败：' + fail);
									uni.showToast({
										icon: 'none',
										title: '成功' + success + '张'
									});
								} else {
									//若图片还没有传完，则继续调用函数
									data.i = i;
									data.success = success;
									data.fail = fail;

									that.uploadimg(data, that.index); //递归，回调自己
								}
							} else {
								return;
							}
						}
					});
				}
			});
		},
		// 删除图片
		DelImg(index, it, type) {
			uni.showModal({
				title: '温馨提示',
				content: '是否删除该照片',
				success: res => {
					if (res.confirm) {
						this.weighingImg.splice(index, 1);
						// this.imgLists[index].splice(i, 1);
						// this.$set(this.imgLists, index, this.imgLists[index]);
						// this.jsonEvaluate[index].image = this.imgLists[index].join(',');
						// console.log(this.imgLists)
						// this.addImgLists.splice(this.deleteImgIndexs, 1);
					} else if (res.cancel) {
						// console.log('用户点击取消');
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #ffffff;
}
.uplodImg {
	margin: 15rpx 0 0 35rpx;
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
	vertical-align: middle;
	// padding: 30rpx 32rpx;
	.imgs {
		position: relative;
		left: 0;
		right: 0;
		width: 190rpx;
		// margin: 20rpx 15rpx 0 0;
		image {
			margin: 10rpx 15rpx 0 0;
			width: 180rpx;
			height: 180rpx;
			vertical-align: middle;
		}
	}
	.closeimage {
		position: absolute;
		right: 0;
		top: 5rpx;
		width: 30rpx !important;
		height: 30rpx !important;
	}
	.upload {
		margin: 10rpx 10rpx 0 0;
		width: 180rpx;
		height: 180rpx;
		background-image: url('/static/image/common/add-icon.png');
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}
}
</style>
