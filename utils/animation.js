export default {
	data() {
		return {
			animationData: {}
		}
	},
	onLoad() {
		let animation = uni.createAnimation({
		  duration: 300,
		});
		this.animation = animation
		this.opacityFadeIn();
	},
	onUnload() {
		this.opacityFadeOut();	
	},
	methods: {
		opacityFadeIn(){
			this.animation.opacity(1).step()
			this.animationData = this.animation.export()
		},
		opacityFadeOut(){
			this.animation.opacity(0.5).step()
			this.animationData = this.animation.export()
		}
	}
}
