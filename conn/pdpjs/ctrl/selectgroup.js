Vue.component('select-group',{
	props:{
		sgModel: {
      type: Array,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function () {
        return []
      }
    },
		sgData: {
      type: Object,
      default: function () {
        return {
					sel:'',
					cas:[]
				}
      }
    },
	},
	data () {
		return {
			
		}
	},
	mounted(){
		console.log(this.sgData)
	},
	template:`
		<div class="f">
			<Select v-model="sgModel[0]" style="width:200px" v-if="sgData.sel.length">
					<Option v-for="item in sgData.sel" :value="item.value" :key="item.value">{{ item.label }}</Option>
			</Select>
			<Cascader :data="sgData.cas" v-model="sgModel[1]"></Cascader>
		</div>
	`,
})