Vue.component('two-ctrl',{
	props:{
		tcType:{
			type: String
		},
		tcmodel:{
			type: Array
		},
		tcSelData:{
			type: Array
		},
	},
	data(){
		return {
			tcSelData1:[],
			tcSelData2:[],
			date1: null,
			date2: null,
		}
	},
	computed:{
		typeArr:function() {
			if(!this.tcType){
				return false
			}
			return this.tcType.split('-');
		},
		dateArr:function() {
			return [this.date1,this.date2]
		}
	},
	methods:{
		datePickerChange(val){
			this.date1 = val;	
			this.$emit('date-change',this.dateArr);
		},
		datePickerChange1(val){
			this.date2 = val;
			this.$emit('date-change',this.dateArr);				
		},
	},
	created(){
		console.log(this.tcmodel)
		if(this.tcType==='datepicker-datepicker'){
			this.date1 = this.tcmodel[0];
			this.date2 = this.tcmodel[1];
		}

		if(this.typeArr[0]==='sel'){
			this.tcSelData1 = this.tcSelData;
		}else if(this.typeArr[1]==='sel'){
			this.tcSelData2 = this.tcSelData;
		}
	},
	template:`
		<div class="two-ctrl-wrapper">
			<div class="two-ctrl-item">	
				<Select v-if="typeArr[0]==='sel'" v-model="tcmodel[0]">
						<Option v-for="item in tcSelData1" :value="item.value" :key="item.value">{{ item.label }}</Option>
				</Select>
				<DatePicker v-else-if="typeArr[0] === 'datepicker'" :value="date1" @on-change="datePickerChange" type="date" placeholder="Select date" style="width: 200px"></DatePicker>
				<Input v-else v-model="tcmodel[0]" />
			</div>
			<div class="two-ctrl-item">
				<Select v-if="typeArr[1]==='sel'" v-model="tcmodel[1]">
						<Option v-for="item in tcSelData2" :value="item.value" :key="item.value">{{ item.label }}</Option>
				</Select>
				<DatePicker v-else-if="typeArr[1] === 'datepicker'" :value="date2" @on-change="datePickerChange1" type="date" placeholder="Select date" style="width: 200px"></DatePicker>
				<Input v-else v-model="tcmodel[1]" />
			</div>
		</div>
	`,
})