/**
 * author: lwj
 * description: 判断市场常见的几种刘海屏机型；获取当前系统版本号；手机系统
 * @param 
 * @return $version：版本号 $systemType：手机系统'android''ios' 
 * @createTime: 2020-7-9 09:24:13
 */
import Vue from 'vue'
// 判断市场常见的几种刘海屏机型
uni.getSystemInfo({
	success: function(res) {
		let modelmes = res.model;
		// console.log("手机型号-------",res.model);
		if (modelmes.indexOf('iPhone X') >= 0 || modelmes.indexOf('iPhone XR') >= 0 || modelmes.indexOf('iPhone XS') >= 0 ||
			modelmes.indexOf('iPhone 12') >= 0 || modelmes.indexOf('iPhone 11') >= 0 || modelmes.indexOf('iPhone11') >= 0 ||
			modelmes.indexOf('iPhone12') >= 0 || modelmes.indexOf('iPhoneXR') >= 0 || modelmes.indexOf('iPhoneX') >= 0) {
			Vue.prototype.$is_bang = true
		} else {
			Vue.prototype.$is_bang = false
		}
		// #ifndef MP
		if (res.platform == 'android') {
			Vue.prototype.$systemType = 'android';
		} else {
			Vue.prototype.$systemType = 'ios';
		}
		console.log("手机系统-------", res.platform);
		Vue.prototype.$windowWidth = res.windowWidth;
		// #endif
	}
});
// 获取当前系统版本号
// #ifdef APP-PLUS
plus.runtime.getProperty(plus.runtime.appid, inf => {
	Vue.prototype.$version = inf.version;
	console.log("版本号---------", inf.version);
});
// #endif
// 更新最新版APP
function upDateApp() {
	let __this = this;
	// 此处需要指明资源包的下载地址
	var downToak = plus.downloader.createDownload(this.$http.RESOURCE_DOWNLOAD_URL, {
		filename: '_doc/update/'
	}, function(d, status) {
		if (status == 200) {
			// 安装wgt包
			plus.runtime.install(
				d.filename, {},
				function() {
					uni.hideLoading();
					plus.nativeUI.alert('升级完成！', function() {
						plus.runtime.restart();
					});
				},
				function(e) {
					plus.nativeUI.alert('升级失败，请稍后重试！' + e.message);
					uni.hideLoading();
				}
			);
		} else {
			plus.nativeUI.alert('更新失败，请稍后重试！');
			uni.hideLoading();
		}
	});
	downToak.start();
	var prg = 0;
	var showLoading = plus.nativeUI.showWaiting('正在下载', {
		width: '112px',
		height: '95px'
	}); //创建一个showWaiting对象
	downToak.addEventListener('statechanged', function(task, status) {
		//给下载任务设置一个监听 并根据状态  做操作
		switch (task.state) {
			case 1:
				showLoading.setTitle('正在下载');
				break;
			case 2:
				showLoading.setTitle('已连接到服务器');
				break;
			case 3:
				prg = parseInt((parseFloat(task.downloadedSize) / parseFloat(task.totalSize)) * 100);
				if (prg % 10 == 0) {
					// 让百分比 10% 增长，如果这里不这么处理  出现 堆栈内存溢出的问题，有知道原因的大神指导一下哈
					showLoading.setTitle('已下载' + prg + '%');
				}
				break;
			case 4:
				plus.nativeUI.closeWaiting();
				break;
		}
	});
}

Vue.prototype.$upDateApp = upDateApp;