<template>
	<view class="">
		<!-- 找人工详情内容区域  || 找施工队详情信息区域 || 找材料详情信息区域-->
		<template v-if="type == 1 || type == 2 || type == 3 || type == 4 || type == 5">
			<view class="bar"><view class="bar-title">工程案例</view></view>
			<view class="page-section">
				<view class="page-text">{{item.projectCase}}</view>
				<block v-for="(imgItem, imgIndex) in projectImgs" :key="imgIndex">
					<image class="page-img" :src="IMG_BASE_URL + imgItem" mode="widthFix"></image>
				</block>
			</view>
		</template>
		<!-- 求购详情的信息区域 -->
		<template v-if="type == 6">
			<view class="bar"><view class="bar-title">求购内容</view></view>
			<view class="page-section">
				<view class="page-text">{{item.remark}}</view>
			</view>
		</template>
		
		<!-- 工人招聘详情的信息区域 -->
		<template v-if="type == 7">
			<view class="bar"><view class="bar-title">职位描述</view></view>
			<view class="page-section">
				<view class="page-text">{{item.jobDuty}}</view>
				<block v-for="(imgItem, imgIndex) in projectImgs" :key="imgIndex">
					<image class="page-img" :src="IMG_BASE_URL + imgItem" mode="widthFix"></image>
				</block>
			</view>
		</template>
	</view>
</template>

<script>
	export default{
		props:{
			// 列表类型: 1:找人工  2:找团队  3:找材料  4:找设备  5:专业市场  6:求购  7:工人招聘
			type: {
				type: [String, Number],
				default: 1
			},
			item: {
				type: Object,
				default(){
					return {
						// title: '', // 所有的标题、名称、找人工的姓名，用这个字段
						// address: '',  // 地址、籍贯
					}
				}
			},
		},
		data(){
			return {
				IMG_BASE_URL: this.$http.IMG_BASE_URL
			}
		},
		computed:{
			projectImgs(){
				let imgUrls = this.item.imgUrls;
				return imgUrls ? JSON.parse(imgUrls) : [];
			}
		}
	}
</script>

<style lang="scss" scoped>
.bar {
	height: 100rpx;
	display: flex;
	align-items: center;
	padding: 0 32rpx;
	.bar-title {
		font-size: 34rpx;
		font-weight: bold;
	}
}

.page-text {
	font-size: 28rpx;
	font-weight: 400;
	line-height: 50rpx;
	color: #999999;
}

.page-img {
	margin-top: 20rpx;
	width: 100%;
	height: auto;
}
</style>
