
export default {
	data() {
		return {
			pageNo: 1,
			pageSize: 10,
			total: 10,
			loadStatus: 'noMore',
			loadTextObj: {
				contentdown: '下拉加载更多', // more
				contentrefresh: '加载中...', // loading
				contentnomore: '-- 人家也是有底线的 --' // noMore
			}
		}
	},
	computed: {
		len() {
			return this.lists.length;
		}
	},
	watch: {
		lists: {
			handler: function(val) {
				if (val.length) {
					if( val.length <= this.total ){
						this.loadStatus = "noMore";
						this.$set(this.loadTextObj, 'contentnomore', '-- 人家也是有底线的 --');
					}else{
						this.$set(this.loadTextObj, 'contentnomore', '-- 人家也是有底线的 --');
					}
				} else {
					this.loadStatus = "noMore";
					this.$set(this.loadTextObj, 'contentnomore', '');
				}
			},
			immediate: true
		}
	},
	onPullDownRefresh() {
		this.total = 0;
		this.lists = [];
		this.pageNo = 1;
		this.pageSize = 10;
		this.getList();
	},
	onReachBottom() {
		if (this.len < this.total) {
			this.pageNo++;
			this.getList();
		} else {
			this.loadStatus = 'noMore';
		}
	},
	// onLoad() {
	// 	this.getList();
	// },
	methods: {
		init() {
			this.total = 0;
			this.lists = [];
			this.pageNo = 1;
			this.pageSize = 10;
		}
		// getList() {
		// 	this.loadStatus = 'loading';
		// 	// this.$http.getList(this.entryParams).then(res => {
		// 	// 	if(res.code == 1){
		// 	// 		this.lists = this.lists.concat([0, 0, 0, 0 , 0]);
		// 	// 	}
		// 	// })
		// 	setTimeout(() => {
		// 		this.lists = this.lists.concat([0, 0, 0, 0, 0])
		// 	}, 500)
		// }
	}
}
