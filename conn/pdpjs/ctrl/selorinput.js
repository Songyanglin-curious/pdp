Vue.component('selorinput',{
	props:{
		type:{
			type: String
		},
		soiModel:{
			type: [String, Number],
		},
		selData:{
			type: Array
		},
	},
	computed:{
		soiModelVal: function(){			
			return this.soiModel;
		}
	},
	methods:{
		updateInput(event){
			this.$emit('update:soiModel', event.target.value)
		},
		updateSelect(event){
			this.$emit('update:soiModel', event.value)
			this.$emit('on-select',event)
		},
	},
	template:`
		<Select v-if="type === 'select'" 
						style="width:100%"
						:value='soiModelVal'
						filterable
						@on-select='updateSelect'
		>
			<Option v-for="(item,index) in selData" :value="item.value" :key="index">{{ item.label }}</Option>
		</Select>
		<Select v-else-if="type === 'selinput'"
						style="width:100%"
						:value='soiModelVal'
						filterable allow-create
						@on-select='updateSelect'
		>
			<Option v-for="(item,index) in selData" :value="item.value" :key="index">{{ item.label }}</Option>
		</Select>
		<Input v-else :value='soiModelVal' type="text" @on-change='updateInput'/>
	`
})