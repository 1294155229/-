<template>
	<view class="section-list-item">
		<view class="section-list-item-top" :class="type == 7 ? '' : 'u-border-bottom'">
			<template v-if="type == 1 || type == 2">
				<view class="section-list-item-top-left">
					<template v-if="mySend">
						<image class="icon_img2" v-if="item.workStatus == 0" src="/static/image/index/status1.png" mode=""></image>
						<image class="icon_img2" v-if="item.workStatus == 1" src="/static/image/index/status2.png" mode=""></image>
					</template>
					<template v-else>
						<image class="icon_img1" src="/static/image/index/ren.png" mode=""></image>
					</template>
					<view class="section-list-item-top-title">
						<view class="line1">{{ item.infoTitle }}</view>
					</view>
				</view>
				<view class="section-list-item-top-right">
					<template v-if="mySend">
						<view class="change_btn" @tap.stop="changeStatus(item)">切换状态</view>
					</template>
					<template v-else>
						<image class="icon_img2" v-if="item.workStatus == 0" src="/static/image/index/status1.png" mode=""></image>
						<image class="icon_img2" v-if="item.workStatus == 1" src="/static/image/index/status2.png" mode=""></image>
					</template>
				</view>
			</template>
			<template v-if="type == 3 || type == 4 || type == 5 || type == 6">
				<view class="section-list-item-top-left">
					<view class="section-list-item-top-title">
						<view class="line1">{{ item.infoTitle }}</view>
					</view>
					<view class="section-list-item-top-tag" v-if="type == 6 && item.classfy">{{ item.classfy }}</view>
				</view>
				<!-- <view class="section-list-item-top-right" v-if="type == 3 && item.classfy">
					<view class="team_name">{{item.classfy}}</view>
				</view> -->
			</template>
			<template v-if="type == 7">
				<view class="section-list-item-top-left">
					<view class="section-list-item-top-title">
						<view class="line1">{{ item.infoTitle }}</view>
					</view>
				</view>
				<view class="section-list-item-top-right">
					<view class="salary">{{ item.salaryRange }}</view>
				</view>
			</template>
		</view>
		<view class="section-list-item-cont">
			<template v-if="type == 1 || type == 2">
				<view class="section-list-tag" v-if="type == 1">
					<view class="section-list-tag-item" v-if="item.classfy">{{ item.classfy }}</view>
					<!-- <view class="section-list-tag-item">油漆工</view> -->
				</view>
				<view class="label-row">
					<image class="label-img" src="/static/image/index/icon1.png" mode=""></image>
					<view class="label-text">{{ item.contactWay }}</view>
				</view>
				<view class="label-row">
					<image class="label-img" src="/static/image/index/icon2.png" mode=""></image>
					<view class="label-text">籍贯：{{ item.address }}</view>
				</view>
				<view class="label-row" v-if="type == 2">
					<image class="label-img" src="/static/image/index/icon4.png" mode=""></image>
					<view class="label-text">
						<view class="u-line-1" style="width: 550rpx;">经营范围：{{ item.runRange }}</view>
					</view>
				</view>
			</template>
			<template v-if="type == 3 || type == 4 || type == 5">
				<view class="label-row">
					<view class="label-text">联系方式: {{ item.contactWay }}</view>
				</view>
				<view class="label-row row_tag" v-if="item.brand">
					<view class="label-text">
						<view style="flex-shrink: 0;">经营品牌：</view>
						<view class="section-list-tag">
							<view class="section-list-tag-item">{{ item.brand }}</view>
							<!-- <view class="section-list-tag-item">油漆工</view>
							<view class="section-list-tag-item">油漆工</view>
							<view class="section-list-tag-item">油漆工</view>
							<view class="section-list-tag-item">油漆工</view> -->
						</view>
					</view>
				</view>
				<view class="label-row u-m-t-0">
					<view class="label-text">经营范围：{{ item.runRange }}</view>
				</view>
			</template>
			<template v-if="type == 6">
				<view class="label-row">
					<view class="label-text">联系人: {{ item.contactName }}</view>
				</view>
				<view class="label-row">
					<view class="label-text">联系方式: {{ item.contactWay }}</view>
				</view>
				<view class="label-row">
					<view class="label-text u-line-1">
						<view class="u-line-1" style="width: 550rpx;">描述：{{ item.remark }}</view>
					</view>
				</view>
			</template>
			<template v-if="type == 7">
				<view class="label-row u-m-t-0">
					<view class="label-text">{{ item.address }}丨{{ item.workTime }}</view>
				</view>
				<view class="label-row">
					<view class="label-text">
						<view class="u-line-3" style="line-height: 40rpx;">{{ item.jobRequire }}</view>
					</view>
				</view>
				<template v-if="mySend">
					<view class="section-list-item-top user-box u-border-top">
						<view class="section-list-item-top-left"></view>
						<view class="section-list-item-top-right">
							<view class="del_btn" @tap.stop="handleDel(item)" style="margin-right: 20rpx;">删除</view>
							<view class="del_btn" @tap.stop="handleEdit(item)">编辑</view>
						</view>
					</view>
				</template>
				<template v-else>
					<view class="section-list-item-top user-box u-border-top">
						<view class="section-list-item-top-left">
							<u-image :src="IMG_BASE_URL + item.avatar" width="56" height="56" border-radius="1000"></u-image>
							<view class="username">{{ item.nickname }}</view>
						</view>
						<view class="section-list-item-top-right">
							<view class="time">发布时间:{{ item.createTime }}</view>
						</view>
					</view>
				</template>
			</template>
		</view>
		<template v-if="mySend && type != 7">
			<view class="section-list-item-top user-box">
				<view class="section-list-item-top-left"></view>
				<view class="section-list-item-top-right">
					<view class="del_btn" @tap.stop="handleDel(item)" style="margin-right: 20rpx;">删除</view>
					<view class="del_btn" @tap.stop="handleEdit(item)">编辑</view>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
export default {
	props: {
		// 列表类型: 1:找人工  2:找团队  3:找材料  4:找设备  5:专业市场  6:求购  7:工人招聘
		type: {
			type: [String, Number],
			default: 1
		},
		item: {
			type: Object,
			default() {
				return {
					// title: '', // 所有的标题、名称、找人工的姓名，用这个字段
					// address: '',  // 地址、籍贯
				};
			}
		},
		// 是否是我的发布
		mySend: {
			type: Boolean,
			default: false
		},

		// 当前对象在列表中对应的索引
		curIndex: {
			type: [String, Number],
			default: 0
		}
	},
	data() {
		return {
			name: '',
			IMG_BASE_URL: this.$http.IMG_BASE_URL
		};
	},
	methods: {
		// 删除按钮点击事件
		handleDel(item) {
			this.$emit('doDelItem', {
				item,
				index: this.curIndex
			});
		},

		// 编辑按钮点击事件
		handleEdit(item) {
			this.$emit('doEditItem', {
				item,
				index: this.curIndex
			});
		},

		// 切换状态按钮点击操作
		changeStatus(item) {
			this.$emit('doChangeStatus', {
				item,
				index: this.curIndex
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.section-list-item {
	background-color: #ffffff;
	border-radius: 16rpx;
	padding: 32rpx;
	margin-bottom: 20rpx;

	.section-list-item-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 14rpx;

		.section-list-item-top-left {
			display: flex;
			align-items: center;
			flex: 1;
			width: 450rpx;
			.section-list-item-top-title {
				margin-left: 8rpx;
				font-size: 40rpx;
				font-weight: 500;
				.line1 {
					width: 450rpx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}

			.section-list-item-top-tag {
				position: absolute;
				right: 0;
				top: 5rpx;
				padding: 5rpx 14rpx;
				background: rgba(255, 88, 0, 0.08);
				border: 1px solid #ff5800;
				font-size: 22rpx;
				color: #ff5800;
				border-radius: 8rpx;
				margin-left: 20rpx;
			}

			.username {
				font-size: 26rpx;
				color: #333333;
				margin-left: 20rpx;
			}
		}

		.section-list-item-top-right {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;

			.team_name {
				color: #039bfd;
				font-weight: bold;
			}

			.salary {
				text-align: right;
				width: 180rpx;
				color: #fe7d4b;
				font-weight: bold;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}

			.time {
				color: #999999;
				font-size: 24rpx;
			}

			.change_btn {
				color: #3296fa;
				font-size: 26rpx;
				font-weight: 500;
			}

			.del_btn {
				width: 168rpx;
				height: 64rpx;
				background: #f6f6f6;
				border-radius: 39rpx;
				font-weight: 500;
				line-height: 64rpx;
				text-align: center;
			}
		}

		.icon_img1 {
			flex-shrink: 0;
			width: 40rpx;
			height: 40rpx;
		}

		.icon_img2 {
			flex-shrink: 0;
			width: 60rpx;
			height: 60rpx;
		}

		&.user-box {
			height: 112rpx;
			margin-top: 24rpx;
			margin-bottom: 0;
			height: auto;
			padding: 24rpx 0 0;
		}
	}

	.section-list-item-cont {
		.section-list-tag {
			display: flex;
			margin: 20rpx 0;
			flex-wrap: wrap;
			.section-list-tag-item {
				padding: 5rpx 22rpx;
				background: rgba(2, 181, 252, 0.08);
				border: 1px solid #02b5fc;
				font-size: 22rpx;
				color: #02b5fc;
				border-radius: 8rpx;
				margin-right: 20rpx;
			}
		}

		.label-row {
			margin-top: 24rpx;
			display: flex;
			align-items: center;
			.label-img {
				width: 32rpx;
				height: 32rpx;
				margin-right: 5rpx;
			}

			.label-text {
				display: flex;
				color: #999999;
				font-size: 26rpx;

				.section-list-tag {
					margin: 0;
				}
			}

			&.row_tag {
				.section-list-tag-item {
					margin-bottom: 24rpx;
				}
			}
		}
	}
}
</style>
