<template>
	<scroll-view :scroll-into-view="scrollIntoId" scroll-y class="container" @scroll="scroll">
		<!-- 头部搜索 -->
		<view class="" :style="{ height: CustomBar + 'px' }">
			<view class="head-city" :style="{ height: CustomBar + 'px' }">
				<view class="" :style="{ height: StatusBar + 'px' }"></view>
				<view class="city-search" :style="{height: CustomBar - StatusBar + 'px'}">
					<!-- <view class="iconfont city" @tap.stop="back">&#xe62d;</view> -->
					<image
						class="iconfont"
						@tap.stop="back"
						src="/static/image/mine/left.png"
						mode=""
						style="width: 10rpx; height: 30rpx; margin: 0 20rpx; vertical-align: middle;"
					></image>
					<view class="search-wrappe">
						<view class="search-wrapper">
							<image src="./search.png" mode=""></image>
							<input type="text" placeholder="搜索城市名" value="" v-model="text" @confirm="searchCity(text)" />
						</view>
						<view class="search-btn" @tap="searchCity(text)">搜索</view>
					</view> 
				</view>
			</view>
		</view>
		<!-- 定位/最近访问 -->
		<view class="nearest" ref="nearest">
			<view class="title">定位/最近访问</view>
			<view class="list">
				<view class="item" @tap="chooseCity(locationCity)">
					<image src="./dingwei.png" mode="" style="width: 30rpx; height: 25rpx; margin-right: 10rpx;"></image>
					{{ locationCity.city || locationCity.cityName ? locationCity.city || locationCity.cityName : '' }}
				</view>
				<view class="item" v-for="(l, i) in nearCity" :key="i" @tap="chooseCity(l)">{{ l.cityName || l.city }}</view>
			</view>
		</view>
		<!-- 热门城市 -->
		<view class="hot" id="hot">
			<view class="title">热门城市</view>
			<view class="list">
				<view class="item" v-for="(item, key) of hotCities" :key="key" @tap="chooseCity(item)">{{ item.cityName }}</view>
			</view>
		</view>
		<!-- 城市排序列表 -->
		<view class="city-list">
			<view class="city-group" v-for="(item, key) of cities" :key="key" :id="item.begins">
				<view class="group-title">{{ item.begins }}</view>
				<view class="list-group">
					<view class="list-group-item" v-for="innerItem of item.child" :key="innerItem.id" @tap="chooseCity(innerItem)">
						<text class="name">{{ innerItem.shortName }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 右侧的导航列表 -->
		<view class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
			<view>
				<view v-for="(item, index) in letters" :key="index" :data-index="index" :data-item="item" class="item" :class="{ current: currentIndex == index }">{{ item }}</view>
			</view>
		</view>

		<view class="mask" v-if="searchList.length > 0 || text.length > 0">
			<view class="city-list">
				<view class="city-group">
					<view class="list-group">
						<view class="list-group-item" v-for="(item, key) of searchList" :key="key" @tap="chooseCity(item)">
							<text class="name">{{ item.cityName }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script>
const citys = require('./city_data_three.js');
const ANCHOR_HEIGHT = 18;
const TITLE_HEIGHT = 29;
export default {
	data() {
		return {
			oldCityData: [], // 原始数据源，用于本地搜索
			cities: [], //城市数据源
			hotCities: [
				{
					cityName: '北京',
					lat: '39.904987',
					lng: '116.405289'
				},
				{
					cityName: '上海',
					lat: '31.231707',
					lng: '121.472641'
				},
				{
					cityName: '广州',
					lat: '23.125177',
					lng: '113.28064'
				},
				{
					cityName: '深圳',
					lat: '22.547001',
					lng: '114.085945'
				},
				{
					cityName: '杭州',
					lat: '30.287458',
					lng: '120.15358'
				},
				{
					cityName: '重庆',
					lat: '29.729153',
					lng: '106.463341'
				},
				{
					cityName: '郑州',
					lat: '34.757977',
					lng: '113.665413'
				},
				{
					cityName: '武汉',
					lat: '30.584354',
					lng: '114.298569'
				},
				{
					cityName: '成都',
					lat: '30.659462',
					lng: '104.065735'
				}
			], //热门城市
			searchList: [], // 搜索的数据
			scrollIntoId: '', //滚动的某个ID
			currentIndex: 0, //当前是第几个模块
			nearCity: [], //最近访问城市列表
			cityName: '南京', //当前定位城市
			text: '', //搜索框输入内容
			letters: [],
			locationCity: '' ,//当前位置
			origin: 1 ,  // 默认是首页
		};
	},
	onLoad({origin}) {
		this.origin = origin ? origin : 2;  // 1首页，   2: 找人工页面
		this.touch = {};
		let address = uni.getStorageSync('addressCity') ? uni.getStorageSync('addressCity') : this.$store.state.userPosition;
		this.locationCity = address;

		// 初始化右侧导航栏列表和城市数据源
		this.cities = citys.default; //获取到a-z的城市列表
		this.letters = ['热'];
		this.cities.map(item => {
			this.letters.push(item.begins);
		});
		this._calculateHeight();
		let _this = this;
		uni.getStorage({
			key: 'nearCity',
			success: function(res) {
				if (res.data != '') {
					_this.nearCity = res.data;
				}
				// console.log(_this.nearCity);
			}
		});
	},
	/**
	 *  点击导航栏 buttons 时触发
	 */
	onNavigationBarButtonTap() {
		let text = this.text;
		this.searchCity(text);
	},
	methods: {
		/**
		 * 选择城市
		 */
		chooseCity(item) {
			let name = item.city || item.cityName;
			if (name == '') {
				uni.showModal({
					title: '提示',
					content: '请打开地图定位功能',
					success: function(res) {
						if (res.confirm) {
							uni.getLocation({
								type: 'wgs84',
								geocode: true,
								success: function(res) {
									this.lat = res.latitude;
									this.lng = res.longitude;
									uni.setStorageSync('address', {
										province: res.address.province,
										city: res.address.city,
										latitude: res.latitude,
										longitude: res.longitude
									});
								}
							});
						}
					}
				});
			} else {
				uni.setStorageSync('address', {
					city: name,
					latitude: item.latitude || item.lat,
					longitude: item.longitude || item.lng
				});
				
				// 首页
				if(this.origin == 1){
					uni.$emit('address_index', {
						city: item.city || item.cityName,
						latitude: item.latitude || item.lat,
						longitude: item.longitude || item.lng
					});
				}
				// 找人页面
				if(this.origin == 2){
					uni.$emit('address_find', {
						city: item.city || item.cityName,
						latitude: item.latitude || item.lat,
						longitude: item.longitude || item.lng
					});
				}
				

				// console.log(this.checkArr(this.nearCity, name));
				if (this.checkArr(this.nearCity, name)) {
					this.nearCity.push(item);
				}
				if (this.nearCity.length > 2) {
					this.nearCity.shift();
				}
				this.nearCity = this.nearCity;
				uni.setStorage({
					key: 'nearCity',
					data: this.nearCity,
					success: function() {
						uni.navigateBack();
					}
				});
			}
		},
		checkArr(arr, name) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i].city || arr[i].cityName == name || (this.locationCity.city || this.locationCity.cityName == name)) {
					return false;
				}
			}
			return true;
		},
		/**
		 *  城市列表滚动时边界处理
		 */
		scroll(e) {
			this.scrollY = -e.detail.scrollTop;
			const listHeight = this.listHeight;
			// 当滚动到顶部， newY大于0
			if (this.scrollY > 0) {
				this.currentIndex = 0;
			}
			// 滚动到中间部分
			for (let i = 0; i < listHeight.length - 1; i++) {
				let height1 = listHeight[i];
				let height2 = listHeight[i + 1];
				if (-this.scrollY < height1 && -this.scrollY >= 0) {
					this.currentIndex = i;
					return;
				}
				if (-this.scrollY >= height1 && -this.scrollY < height2) {
					this.currentIndex = i;
					// this.diff = height2 + this.scrollY
					return;
				}
			}
			// 滚动到底部，且-newY大于最后一个元素的上限
			this.currentIndex = listHeight.length - 2;
		},
		/**
		 *  计算每一个城市模块的高度
		 */
		_calculateHeight() {
			this.listHeight = [];
			let height = 0;
			let view = uni.createSelectorQuery().select('.hot');
			view.boundingClientRect(data => {
				// this.listHeight.push(data.top);
			}).exec();
			this.cities.map(k => {
				let view = uni.createSelectorQuery().select('#' + k.begins);
				view.boundingClientRect(data => {
					// this.listHeight.push(data.top)
				}).exec();
			});
		},
		/**
		 *  点击右侧字母时左侧城市列表的联动
		 */
		onShortcutTouchStart(e) {
			let anchorIndex = parseInt(e.target.dataset.index);
			let anchorItem;
			if (anchorIndex === 0) {
				anchorItem = 'hot';
			} else {
				anchorItem = e.target.dataset.item;
			}
			let firstTouch = e.touches[0];
			this.touch.y1 = firstTouch.pageY;
			this.touch.anchorIndex = anchorIndex;
			this.scrollIntoId = anchorItem;
		},
		/**
		 *  手指在右侧字母列表上滑动时处理函数
		 */
		onShortcutTouchMove(e) {
			let firstTouch = e.touches[0];
			this.touch.y2 = firstTouch.pageY;
			let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0;
			let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
			let anchorItem;
			if (anchorIndex === 0) {
				anchorItem = 'hot';
			} else {
				anchorItem = this.letters[anchorIndex];
			}
			this.scrollIntoId = anchorItem;
		},
		/**
		 * 搜索功能的实现
		 */
		searchCity(text) {
			// if (!text) {
			// 	uni.showToast({
			// 		title: '请输入搜索内容',
			// 		icon: 'none'
			// 	})
			// 	return;
			// 	// 如果搜索框为空, 数组置空
			// 	this.searchList = [];
			// } else {
			// 根据输入框的关键字检索城市 并存入到searchList数组中
			let arr = [];
			this.cities.map((item, index) => {
				arr.push(...item.child);
			});
			this.searchList = arr.filter(items => {
				return items.cityName.indexOf(text) != -1;
			});

			// uni.showToast({
			// 	title: `您搜索了${text}`,
			// 	icon: 'none'
			// })
			// }
		},
		// 返回上一级
		back() {
			uni.navigateBack();
		}
	}
};
</script>

<style lang="scss">
@import './city_list.scss';

page {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
	background-color: #ffffff;
}

.mask {
	position: fixed;
	top: 84px;
	bottom: 0;
	left: 0;
	right: 0;
	width: 100%;
	height: 100%;
	overflow: scroll;
	background-color: #fff;
	z-index: 40;
}
</style>
