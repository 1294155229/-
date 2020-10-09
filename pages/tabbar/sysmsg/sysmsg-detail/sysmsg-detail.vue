<template>
	<view>
		<template v-if="msgDetail">
			<view class="title">{{ msgDetail.title }}</view>
			<view class="content"><rich-text :nodes="decodeURIComponent(msgDetail.content)"></rich-text></view>
		</template>
	</view>
</template>

<script>
export default {
	data() {
		return {
			msgId: '',
			msgDetail: null
		};
	},
	onLoad({ id }) {
		this.msgId = id;
		this.getDetail();
	},
	methods: {
		getDetail() {
			let param = {
				id: this.msgId
			};
			this.$http.getSystemMessageDetailById(param).then(res => {
				if (res.code == 1) {
					this.msgDetail = res.data;
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
.title {
	height: 90rpx;
	line-height: 90rpx;
	text-align: center;
	font-size: 32rpx;
	color: #333333;
}
.content{
	word-wrap: break-word;
}
</style>
