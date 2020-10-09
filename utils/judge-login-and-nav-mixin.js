import { IS_LOGIN } from '@/store/mutations.js';
export default {
	methods: {
		judgeLoginAndNav(url){
			if(this.$store.getters[IS_LOGIN]){
				this.$helper.to(url);
			}else{
				this.$helper.to('/pages/views/login/login');
			}
		}
	}
}