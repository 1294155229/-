<template>
	<view class="page">
		<template v-if="xieyiInfo">
			<view class="title">
				{{xieyiInfo.title?xieyiInfo.title:''}}
			</view>
			<view class="content" v-if="xieyiInfo.agreementContent">
				<rich-text :nodes="decodeURIComponent(xieyiInfo.agreementContent)"></rich-text>
			</view>
		</template>
		<noData v-else></noData>
	</view>
</template>

<script>
	import noData from '@/components/mqb-components/no-data.vue';
	let __type = 1;
	let titleObj = {
		1: '用协议和隐私政策',
		2: '使用条款',
		3: '注册协议',
	}
	export default {
		components:{
			noData
		},
		data() {
			return {
				xieyiInfo:{
					title:''
				}
			};
		},
		onLoad({type}) {
			__type = type;
			uni.setNavigationBarTitle({
				title: titleObj[type]
			})
			this.getAgreementList();
		},
		methods:{
			getAgreementList(){
				let param = {
					type: __type
				}
				this.$http.getAgreement(param).then(res=>{
					if(res.code == 1){
						this.xieyiInfo = res.data;
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.page{
	padding: 48upx 24upx;
	width: 750rpx;
	// min-height: 100vh;
	background-color: #fff;
	.title{
		color: #333;
		font-size: 38upx;
		text-align: center;
		line-height: 60upx;
	}
	.spec-tip{
		color: #333;
		font-size: 32upx;
		line-height: 60upx;
		margin-bottom: 16upx;
	}
	.content{
		font-size: 32upx;
		text-indent: 2em;
		line-height: 54upx;
		width: 100%;
	}
}
</style>
