<template>
	<view class="">
		<uniPopup ref="unipopup">
			<view class="pop-cont">
				<view class="list">
					<scroll-view class="scroll-list" scroll-y="true">
						<view class="scroll-list-cont">
							<block v-for="(item, index) in list">
								<view class="list-item" :class="{'active': activeIndex == index}" @tap="itemTap(index)">{{item.classifyName}}</view>
							</block>
						</view>
					</scroll-view>
				</view>
				<view class="foot-btn u-border-top">
					<button class="left-btn btn u-reset-button u-border-right" @tap="reset">重置</button>
					<button class="right-btn btn u-reset-button" @tap="confirm">确定</button>
				</view>
			</view>
		</uniPopup>
	</view>
</template>

<script>
import uniPopup from '@/components/uniapp-components/uni-popup/uni-popup.vue';
export default {
	name: 'typeofworkPopup',
	components: {
		uniPopup
	},
	props:{
		list: {
			type: [Array],
			default(){
				return [];
			}
		}
	},
	data() {
		return {
			activeIndex: -1,
		};
	},
	methods: {
		open() {
			this.$refs.unipopup.open();
		},
		close() {
			this.$refs.unipopup.close();
		},
		
		// 某一项点击
		itemTap(index){
			this.activeIndex = index;
		},
		
		// 点击重置按钮
		reset(){
			this.activeIndex = -1;
			this.$emit('doConfirm', null);
			this.close();
		},
		
		// 点击确定按钮
		confirm(){
			this.$emit('doConfirm', this.list[this.activeIndex])
			this.close();
		}
	}
};
</script>

<style lang="scss" scoped>
.pop-cont {
	position: relative;
	width: 600rpx;
	height: 726rpx;
	background-color: #ffffff;
	border-radius: 16rpx;

	.list {
		padding: 32rpx;
		height: calc(100% - 94rpx);

		.scroll-list {
			height: 100%;
			.scroll-list-cont {
				
			}
			.list-item {
				width: 30%;
				display: inline-block;
				background: #eeeeee;
				border-radius: 8rpx;
				padding: 8rpx 24rpx;
				font-weight: 500;
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				&.active {
					color: #02b5fc;
					background: rgba(2, 181, 252, 0.08);
					border: 1rpx solid #02b5fc;
				}
				&:nth-child(3n){
					margin-right: 0;
				}
			}
		}
	}

	.foot-btn {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 94rpx;
		display: flex;

		.btn {
			width: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32rpx;
			background-color: #ffffff;

			&.left-btn {
				color: #999999;
				border-right: 1rpx solid #e4e7ed;
			}

			&.right-btn {
				color: #02b5fc;
			}
		}
	}
}
</style>
