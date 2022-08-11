Vue.component('ysh-carousel',{
	props:{
		list:{//轮播图数据源，必填，数组item为{name: 'a',pos: 'pos1',},
					//其中name不能重复，pos必须从pos1开始按顺序（pos1、pos2...）
			type: Array
		},
		angle:{//旋转角度
			type: Number,
			default: 30,
		},
		translateX:{//平移基数
			type: Number,
			default: 100,
		},
		interval:{//自动轮播时间间隔
			type: Number,
			default: 10000,
		},
	},
	data(){
		return {
			posArr:(function(vm){
				let arr = [];
				for(let i=1;i<=vm.list.length;i++){
					arr.push(i)
				}
				console.log(arr)
				return arr
			})(this),
			itemList: this.list,
		}
	},
	methods:{
		handleCarousel(direction){
			if(direction === 'left'){
				let flag = this.posArr.shift();
				this.posArr.push(flag);
			}else if(direction === 'right'){
				let flag = this.posArr.pop();
				this.posArr.unshift(flag);
			}else{
				return false;
			}	
			let i = 0;
			for(let item of this.posArr){
				this.$set(this.itemList[i],'pos','pos'+item);
				i++;
			}
		},
		handleItemClick(){
			return;//暂时不支持点击
			this.handleCarousel('right')
		},
		handleAutoCarousel(){
			setInterval(function(){
				this.handleCarousel('right');
			}.bind(this),this.interval)
		},
	},
	created(){
		console.log(this.itemList)
	},
	mounted(){
		this.handleAutoCarousel();
	},
	template: `
		<div class="carousel-wrapper">
			<div v-for="(item,index) in itemList" :key="item.name" 
			@click="handleItemClick" :class="'carousel-item div'+index" :data-item-pos="item.pos"
			:style="{zIndex:1000-item.pos.slice(3)+1,
				transform: 'translate(calc('+translateX+'px * ('+(parseFloat(item.pos.slice(3)%2) === 0?-1:1) * parseInt(item.pos.slice(3)/2)+')), 10px) rotate3d(0, 1, 0, calc('+angle+'deg * '+(parseFloat(item.pos.slice(3)%2) === 0?1:-1)+'))'
			}"
		>
				<slot :name="'slot'+(index+1)"></slot>
			</div>
		</div>
	`,
})