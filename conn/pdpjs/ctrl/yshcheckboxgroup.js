Vue.component('ysh-checkbox-group',{
	template:`
		<div class='ycg-wrapper'>
			<span v-if='labelText'>{{labelText+'：'}}</span>
			<Checkbox
					class='mr20'
					:indeterminate="indeterminate"
					:value="checkAll"
					@click.prevent.native="handleCheckAll">全选</Checkbox>
			<CheckboxGroup :value="checkAllGroup" @on-change="checkAllGroupChange">
					<Checkbox label="香蕉"></Checkbox>
					<Checkbox label="苹果"></Checkbox>
					<Checkbox label="西瓜"></Checkbox>
			</CheckboxGroup>
		</div>
	`,
	props:{
		labelText:{
			type: String
		},
		allData:{
			type: Array
		},
		checkData:{
			type: Array
		}
	},
	data () {
		return {
				indeterminate: true,
				checkAll: false,
		}
	},
	computed:{
		checkAllGroup(){
			let arr=[];
			if(Array.isArray(this.checkData[0])){
				for(let item of this.checkData){
					arr.push(item[1])
				}
			}else{
				for(let item of this.checkData){
					for(let i=0,l=this.allData.length;i<l;i++){
						if(item === this.allData[i][0]){
							arr.push(this.allData[i][1])
						}
					}
				}
			}			
			return arr;
		}
	},
	methods: {
			getUserFormatData(ctrlData){
				let allData = this.allData,
						arr=[];
				for(let j=0,k=ctrlData.length;j<k;j++){
					for(let i=0,l=allData.length;i<l;i++){					
						if(allData[i][1] === ctrlData[j]){
							arr.push([allData[i][0],ctrlData[j]])
						}
					}
				}
				return arr;				
			},
			handleCheckAll () {
					if (this.indeterminate) {
							this.checkAll = false;
					} else {
							this.checkAll = !this.checkAll;
					}
					this.indeterminate = false;

					let data;
					if (this.checkAll) {
						data = ['香蕉', '苹果', '西瓜'];
					} else {
						data = [];
					}
					this.$emit('update:checkData', this.getUserFormatData(data))
			},
			checkAllGroupChange (data) {
					this.$emit('update:checkData', this.getUserFormatData(data))
					if (data.length === 3) {
							this.indeterminate = false;
							this.checkAll = true;
					} else if (data.length > 0) {
							this.indeterminate = true;
							this.checkAll = false;
					} else {
							this.indeterminate = false;
							this.checkAll = false;
					}
			}
	},
})