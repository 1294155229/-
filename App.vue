<script>
	import Vue from 'vue';
	import { SET_USER_TOKEN } from '@/store/mutations.js';
	export default {
		globalData:{
			status: 0,  // 0表示在首页点击发布按钮  1表示在个人中心点击发布按钮
		},
		onLaunch: function() {
			// #ifdef APP-PLUS
			// 获取当前所在地的经纬度和城市名称
			this.$store.dispatch("getUserPosition");
			// #endif
			
			// 判断登录状态
			if(uni.getStorageSync("user_token")){
				this.$store.commit(SET_USER_TOKEN, uni.getStorageSync("user_token"));
				this.$store.dispatch('queryUserInfo');
			}else{
				console.log('，未登录哦');
			}
			
			
			//状态栏高度
			uni.getSystemInfo({
				success: function(e) {
					let StatusBar = e.statusBarHeight;
					let CustomBar = 0;
					Vue.prototype.StatusBar = StatusBar;
					// #ifndef MP
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 44;
						CustomBar = e.statusBarHeight + 44;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
						CustomBar = e.statusBarHeight + 45;
					}
					// #endif
					// #ifdef MP-WEIXIN
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif
					// #ifdef MP-ALIPAY
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					CustomBar = e.statusBarHeight + e.titleBarHeight;
					
					// #endif
			
					// console.log('e=====>')
					let ScreenHeight = e.screenHeight;
					let WindowHeight = e.windowHeight;
					//全局混入  设置全局变量 全局方法
					//2019.9.7 see:https://juejin.im/post/5b7bb9b56fb9a019f671266a
					Vue.mixin({
						data() {
							return {
								CustomBar,
								StatusBar,
								ScreenHeight,
								WindowHeight
							};
						}
					});
				}
			});
			
		},
		onShow: function() {
			// #ifdef APP-PLUS
			// 检测当前系统的版本
			this.getVersion();
			// #endif
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			// #ifdef APP-PLUS
			getVersion() {
				let version = 1.0;   // 当前的系统版本
				let type = 1;
				let systemInfoRes = uni.getSystemInfoSync();
				if(systemInfoRes.platform == 'ios'){
					type = 2;
				}
				plus.runtime.getProperty(plus.runtime.appid, inf => {
					version = inf.versionCode;
					console.log("当前版本", inf);
					console.log("当前版本", version);
					global.curVersion = version;
					this.checkUpdate(type, version);   // 检测到的系统版本
				});
			},
			checkUpdate(type, version) {
				let _this = this;
				let tempData = {
					type, version
				}
				this.$http.doUpdateAPI(tempData).then(res => {
					if(res.code == 1){
						uni.showModal({
							title: '版本提示',
							content: '发现新版本,是否更新？',
							success: function(res) {
								if (res.confirm) {
									_this.$upDateApp();
								} else if (res.cancel) {
									console.log("取消更新");
									// if(_this.$systemType == 'ios'){
									// console.log('ios用户点击取消');
									// const threadClass = plus.ios.importClass("NSThread");
									// const mainThread = plus.ios.invoke(threadClass, "mainThread");
									// plus.ios.invoke(mainThread, "exit");
									// 上面的不行就用下面的
									// plus.ios.import("UIApplication").sharedApplication().performSelector("exit")
									// } else{
									// console.log('安卓用户点击取消');
									// plus.runtime.quit();
									// }
								}
							}
						});
					}
				})
				// this.$http.getContactUsInfo().then(res => {
				// 	console.log(">>>>>>>>>>");
				// })
				
				// commonAPI.checkUpdate(tempData).then(res => {
					
				// 	if (res.code == 1) {
				// 		uni.showModal({
				// 			title: '版本提示',
				// 			content: '发现新版本,是否更新？',
				// 			success: function(res) {
				// 				if (res.confirm) {
				// 					// _this.$upDateApp();
				// 				} else if (res.cancel) {
				// 					// if(_this.$systemType == 'ios'){
				// 					// console.log('ios用户点击取消');
				// 					// const threadClass = plus.ios.importClass("NSThread");
				// 					// const mainThread = plus.ios.invoke(threadClass, "mainThread");
				// 					// plus.ios.invoke(mainThread, "exit");
				// 					//上面的不行就用下面的
				// 					// plus.ios.import("UIApplication").sharedApplication().performSelector("exit")
				// 					// } else{
				// 					// console.log('安卓用户点击取消');
				// 					// plus.runtime.quit();
				// 					// }
				// 				}
				// 			}
				// 		});
				// 	}
				// });
			},
			// #endif
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	
	/* 引入uview-ui的样式库 */
	@import "@/uview-ui/index.scss";
	
	@import "@/static/css/common.scss";
	
	@font-face {
	  font-family: 'myiconfont'; 
	  // src: url('//at.alicdn.com/t/font_1302347_an3mq1axgx6.ttf') format('truetype');
	  src: url('/static/font/iconfont.ttf') format('truetype');
	}
	
	.myiconfont{
		font-family: "myiconfont";
	}
	
	@keyframes show {
		0% {
			transform: translateY(-50px);
		}
	
		60% {
			transform: translateY(40upx);
		}
	
		100% {
			transform: translateY(0px);
		}
	}
	
	@-webkit-keyframes show {
		0% {
			transform: translateY(-50px);
		}
	
		60% {
			transform: translateY(40upx);
		}
	
		100% {
			transform: translateY(0px);
		}
	}
</style>
