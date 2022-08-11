Vue.component('title-div',{
	props:{
		title:{
			type: String,
			require: true,
		},
		contentClass: {
			type: String,
			default: '',
		}
	},
	data(){
		return {
			divContentHeight: 0,
		}
	},
	mounted(){
		this.divContentHeight = this.$refs['divContent'].clientHeight;
	},
	template:`
	<div class='f dc'>
		<div class='wrapper-title'>
			<span>{{title}}</span>
			<slot name="title-aside"></slot>
		</div>
		<div ref='divContent' class='wrapper-content' :class='contentClass'>
			<slot v-bind:divContentHeight='divContentHeight'></slot>		
		</div>
	</div>
	`
})