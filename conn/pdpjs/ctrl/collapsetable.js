Vue.component('collapse-table',{
	props:{
		columns:{//表格列数据
			type: Array,
		},
		editCol:{//这个数组存储表格可编辑的列
			type: Array,
		},
		data:{//表格当前页显示数据
			type: Array,
		},
		tHeight:{//表格高度
			type:[Number,String],
		},
		tBorder:{//表格边框
			type:Boolean,
		},		
		tAllData:{//表格所有数据
			type: Array,
		},
		originalAllData:{//表格所有原始数据
			type: Array,
		},
		tDataLen:{//表格所有数据条数
			type: Number,
		},		
		tPageSize:{//每页显示多少条数据
			type: Number,
		},
		tCurrPage:{//表格当前页
			type: Number,
		},
		editToForm:{//是否用iform组件来编辑
			type: Boolean,
		},		
		editIndexArr:{//这个数组里面行号对应行显示为编辑状态	
			type: Array,
		},
		addRow: {//当前编辑状态行是否是点添加按钮出来的行，如果是添加行则操作列显示得按钮和不是添加行显示得按钮不一样
			type: Boolean,
		}, 	
		pageSeen:{//翻页用Page组件是否显示
			type: Boolean,
		},
		removeBtnShow:{//删除按钮是否显示
			type: Function,
		},
		removeLink:{//删除按钮是否显示为link状态（默认图片状态）
			type: Boolean,
		},
		moveBtnShow:{//行上移下移按钮是否展示
			type: Boolean,
		},
		saveBtnSeen:{//行保存按钮是否展示
			type: Boolean,
		},
		pageDecisionEdit:{//页面决定行点击是否编辑
			type: Function
		},
		pageSelSelect:{//页面处理select列类型select的select事件
			type: Function
		},
		pageEditSelData:{//页面处理select列类型select的数据源
			type: Function
		},
		pageRowSelectionChange:{//页面处理行复选框点击事件
			type: Function
		},
		pageInitSoi:{//页面初始化selectorinput组件相关
			type: Function
		},
	},
	data(){
		return {
			//two-ctrl组件可选类型
			twoCtrlType:['sel-input','input-sel','sel-sel','input-input','datepicker-datepicker'],
			//存储编辑行时用到datePicker组件（包括datePicker和
			//two-ctrl类型为"datepicker-datepicker"等）的值和
			//对应列名组成的数组
			datePickerArr:[],
			selorinputType:[],
			//筛选完的数据源，是从xml中给它赋值的负责人列和变电站列数据源
			selorinputSelData:[],
			moveBtnWrapperSeen: [],
			moveBtnTop: 0,
			moveBtnLeft: 0,
			filterData: [],
		}
	},
	computed:{
		rowSelection(){
			return this.$parent.rowSelection?1:0;
		},
	},
	methods: {
		/***工具函数 */
		//把datePickerArr初始化，操作共用的数据，用完或用之前都应初始化一下，以免下次操作时里面有上次操作留下来的数据
		initDatePickerArr(){
			this.datePickerArr = [];
		},
		getTimeFormat(dateFormat){
			if(!dateFormat){return}
			let format;
			switch (dateFormat) {
				case "yyyy-MM-dd HH:mm:ss":
					format = 111111;
					break;
				case "yyyy-MM-dd HH:mm":
					format = 111110;
						break;
				case "yyyy-MM-dd HH":
					format = 111100;
						break;
				case "yyyy-MM-dd":
					format = 111000;
						break;
				case "yyyy-MM":
					format = 110000;
						break;
				case "yyyy":
					format = 100000;
						break;
				default:
					format = 111000;
			}
			return format;
		},
		//表格显示数据（select和selectgroup类型需将value对应成label显示）
		selColShowText(row,item){
			if(item['colType']==='select'||item['colType']==='rowsel'){
				for(let i=0,l=item['selColData'].length;i<l;i++){
					if(item['selColData'][i]['value'] === row[item.key]){
						return item['selColData'][i]['label'];
					}
				}
			}else if(item['colType']==='selectgroup'){
				let index = row.rowindex - 1;
				let rowsel1data = row[item.key][0]?row[item.key][0].toString():row[item.key][0];
				let rowsel2data = (row[item.key][1][0] || row[item.key][1][0] == 0)?row[item.key][1][0].toString():row[item.key][1][0];
				let rowsel3data = (row[item.key][1][1] || row[item.key][1][1] == 0)?row[item.key][1][1].toString():row[item.key][1][1];
				//原理这一列for循环可能不进，则会返回undefined，所以showsel1data需要有默认值是空
				let showsel1data = '', showsel2data = '', showsel3data = '';
				let loop = function(datasrc,rowdata,showdata){
					for(let item2 of datasrc){
						if(item2['value'] === rowdata){
							showdata = item2['label']
							break;
						}
					}
					return showdata;
				}
				showsel1data = loop(item['selGroupColData'][index].sel,rowsel1data,showsel1data)
				showsel2data = loop(item['selGroupColData'][index].cas,rowsel2data,showsel2data)
				for(let item2 of item['selGroupColData'][index].cas){
					if(showsel3data = loop(item2.children,rowsel3data,showsel3data)){
						break;
					}
				}
                if (item['selGroupColData'][index].sel.length == 0 || showsel1data == ""){
					return showsel2data+'/'+showsel3data;
				}
				return showsel1data +'/'+showsel2data+'/'+showsel3data;
			}else{
				return row[item.key];
			}
		},
		//更新selorinput类型列显示数据
		updateSoiShowtext(row,item){
			this.initSelorinput(row,item);
			if(!this.selorinputType.length){
				return row[item.key];
			}
			let type = this.selorinputType[row.rowindex-1][item.key];
			if(type == 'selinput'||type == 'select'){
				for(let i=0,l=item['selColData'].length;i<l;i++){
					if(item['selColData'][i]['value'] === row[item.key]){
						return item['selColData'][i]['label'];
					}
				}
			} else {
				return row[item.key];
			}
		},
		//初始化Selorinput组件
		initSelorinput(row,item){			
			if(this.pageInitSoi){
				let currSelorinputType
				({
					'selorinputType':currSelorinputType
				} = this.pageInitSoi(row,item));
				if (!this.selorinputType[row.rowindex - 1]) {
					this.selorinputType[row.rowindex - 1] = {}
				}
				this.selorinputType[row.rowindex - 1][item.key] = currSelorinputType;
				return;
			}
			this.initSelorinputType(row,item.key);
		},
		//初始化Selorinput的Type
		initSelorinputType(row,colKey){
			let arr = this.selorinputType;
			if(!arr[row.rowindex - 1]){
				arr[row.rowindex - 1] = {};
			}
			arr[row.rowindex - 1][colKey]='select';
		},
		//selorinput类型更新type
		updatesoiType(index,colKey,type){
			this.$set(this.selorinputType[index],colKey,type);
		},
		//selorinput类型更新data
		updatesoiData(row,colKey){
			let selorinputSelData = this.selorinputSelData;
			let data = selorinputSelData[row.rowindex-1]?selorinputSelData[row.rowindex-1][colKey]:[]
			return data;
		},

		/**表格新增行 */	
		//新增行保存操作
		newRowSave (index) {
			if(this.datePickerArr.length){
				this.$emit('new-row-save',index,this.tCurrPage,this.datePickerArr);
				this.initDatePickerArr();
				return;
			}
			this.$emit('new-row-save',index,this.tCurrPage);
		},
		//新增行取消操作
		newRowCancel(row,index){
			this.initDatePickerArr();
			this.$emit('row-remove',row,index,this.tCurrPage,0);		
		},

		/**表格删除行 */
		//删除一行
		rowRemove(row,index){
			this.$emit('row-remove',row,index,this.tCurrPage,1);		
		},

		/**表格行编辑 */
		//行转到编辑状态
		rowToEditState (row, column, data, event) {	
			event.stopPropagation();		
			let index = row.rowindex - 1;	
			// if(column.colType === 'href'){
			// 	if(this.editIndexArr.includes(index)){
			// 		return;
			// 	}
			// 	this.$emit('cell-click',row,index)
			// 	return;
			// }
			if(this.pageDecisionEdit){
				let res;
				res= this.pageDecisionEdit(row,index,column);
				if(!res){
					return;
				}
			}				
			if(column.slot === "action"){
				this.$emit('click-action-col',row);				
				return;
			}
			if(this.editToForm){
				this.$emit('form-row-edit',row,index,this.tCurrPage);			
				return;
			}			
			if(this.editIndexArr.includes(index)){
				return;
			}else{
				if(this.editIndexArr.length>0){			
					if(this.addRow){//新增行
						this.newRowSave(this.editIndexArr[0]);
					}else{
						this.editSave(this.editIndexArr[0]);
					}
					return;
				}
				this.initDatePickerArr();
				this.$emit('row-edit',row,index);			
			}
		},	
		//日期控件on-change事件绑定方法
		datePickerChange(date,colKey){
			for(let i=0,l=this.datePickerArr.length;i<l;i++){
				if(this.datePickerArr[i][0] === colKey){
					this.datePickerArr.splice(i, 1);
				}
			}
			this.datePickerArr.push([colKey,date]) ;
		},

		//two-ctrl组件类型为"datepicker-datepicker"时，
		//更改时间时触发
		twoCtrlDateChange(dateArr,colKey){
			for(let i=0,l=this.datePickerArr.length;i<l;i++){
				if(this.datePickerArr[i][0] === colKey){
					this.datePickerArr.splice(i, 1);
				}
			}
			this.datePickerArr.push([colKey,dateArr]);
		},
		//编辑行保存操作
		editSave (index) {
			if(this.datePickerArr.length){
				this.$emit('edit-save',index,this.tCurrPage,this.datePickerArr);
				this.initDatePickerArr();
				return;
			}
			this.$emit('edit-save',index,this.tCurrPage);
		},
		//取消编辑状态行（行状态由编辑态转为显示态）
		editCancel(index){
			this.initDatePickerArr();
			this.$emit('edit-cancel',index);
		},	

		//行上移下移
		rowMove(type,row,index){
			this.$emit('row-move',type,row,index)
		},

		//翻页
		changePage(page){				
			this.$emit('change-page',page);
		},
		
		//select类型select事件处理
		handleSelSelect(value,colKey,row,columns){
			if(this.pageSelSelect){
				this.$nextTick(function(){
					this.pageSelSelect(value,colKey,row,columns);
					this.$parent.refreshPageData();
				})
			}
		},
		//行点击复选框事件
		rowSelectionChange(s){
			if(this.pageRowSelectionChange){
				this.pageRowSelectionChange(s);
			}
		},
		//href类型列的点击事件
		clickHref(row){
			let index = row.rowindex - 1;	
			this.$emit('cell-click',row,index)
			return;
		},
		//表格筛选
		onFilterChange(column) {
			if (column._filterChecked.length == 0) {
					this.filterData = this.originalAllData;
					this.$emit("on-filter-change", this.filterData);
					return;
			}
			this.filterData = [];
			this.originalAllData.forEach(item => {
					if (column._filterChecked.includes(item[column.slot])) {
							this.filterData.push(item);
					}
			});
			this.$emit("on-filter-change", this.filterData);
	}

	},
	created(){
		Ysh.Web.Event.attachEvent(document.body, "onmousedown", function (e) {	
			if(e.path.includes(document.querySelector('tr.ivu-table-row.ivu-table-row-hover'))){
				return
			}
			if(this.editIndexArr.length>0){			
				if(this.addRow){//新增行
					this.newRowSave(this.editIndexArr[0]);
				}else{
					this.editSave(this.editIndexArr[0]);
				}
			}
		}.bind(this));
		document.body.addEventListener('mouseover',(e)=>{
			let target = e.target;
			let tr = target.closest('.ivu-table-row');	
			let tAllData = this.tAllData;		
			tAllData.forEach((item,index) => {
				this.$set(this.moveBtnWrapperSeen,index,false)
			});		
			if(!tr){				
				return;
			}		
			if (!this.$el.contains(tr)) return;
			let index = tr.__vue__.row.rowindex-1;	
			let rowindexObj = this.columns.find((item)=>{return item.slot==='rowindex'});
			if(this.moveBtnWrapperSeen[index] === false){
				let thead = target.closest('.ivu-table').querySelector('.ivu-table-header');				
				this.$set(this.moveBtnWrapperSeen,index,true);
				this.moveBtnTop = tr.offsetTop + thead.offsetHeight;
				if(!rowindexObj){
					this.moveBtnLeft = tr.offsetLeft;
				}else{
					this.moveBtnLeft = tr.offsetLeft+rowindexObj.width;
				}
			}	
		})
	},
	template:`
			<div>
				<i-table :columns="columns" :data="data" 
								:height='tHeight' :border='tBorder' :stripe='true'
								@on-cell-click="rowToEditState"
								@on-selection-change='rowSelectionChange'
								@on-filter-change = 'onFilterChange'
				>
					<template slot-scope="{ row, index }" :slot="columns[rowSelection].slot">
						<span>{{row.rowindex}}</span>
					</template>

					<template v-for="(item,forIndex) in editCol" slot-scope="{ row, index }" :slot="item.slotName">
						<template v-if="editIndexArr.includes(row.rowindex-1)">
							<Select v-if="item.colType === 'select'" filterable @on-select='handleSelSelect($event,item.key,row,columns)' :disabled='item.selDisabled' v-model="item.vmodel[row.rowindex-1]" style="width:100%;">
								<Option v-for="item1 in item.selColData" :value="item1.value" :key="item1.value">{{ item1.label }}</Option>
							</Select>
							<selorinput v-else-if="item.colType === 'selorinput'" 
													:type='selorinputType[row.rowindex-1][item.key]'
													:soi-model.sync = 'item.vmodel[row.rowindex-1]' 
													:sel-data='updatesoiData(row,item.key)'
													@on-select='handleSelSelect($event,item.key,row,columns)'
							>
							</selorinput>
							<selorinput v-else-if="item.colType === 'rowsel'" 
													type='select'
													:soi-model.sync = 'item.vmodel[row.rowindex-1]' 
													:sel-data='updatesoiData(row,item.key)'
													@on-select='handleSelSelect($event,item.key,row,columns)'
							>
							</selorinput>
							<Input v-else-if="item.colType === 'textarea'" :disabled='item.selDisabled' v-model="item.vmodel[row.rowindex-1]" type="textarea" placeholder="请输入" />
							<DatePicker v-else-if="item.colType === 'datepicker'" :format='item.dateFormat' :disabled='item.selDisabled' :value="item.vmodel[row.rowindex-1]" @on-change="datePickerChange($event,item.key)" type="datetime" placeholder="请选择日期" style="width: 100%"></DatePicker>
							<select-group v-else-if="item.colType === 'selectgroup'" :sgData="item.selGroupColData[row.rowindex-1]" :sgModel.sync="item.vmodel[row.rowindex-1]"></select-group>
							<two-ctrl v-else-if="twoCtrlType.includes(item.colType)" :tcType="item.colType" 
												:tcmodel="item.vmodel[row.rowindex-1]" 
												:tc-sel-data="item.selColData" 
												@date-change="twoCtrlDateChange($event,item.key)">
							</two-ctrl>
							<span v-else-if="item.colType === 'span'">{{ selColShowText(row,item) }}</span>
							<Input v-else type="text" :disabled='item.selDisabled' v-model="item.vmodel[row.rowindex-1]"  />
						</template>
						<div v-else-if="item.colType === 'href'">
							<span class="tbl-cell-href" @click.stop="clickHref(row)">{{ item.suffix?(selColShowText(row,item) + item.suffix): selColShowText(row,item) }}</span>
						</div>
						<div v-else-if="twoCtrlType.includes(item.colType)" class="two-ctrl-wrapper">
							<div class="two-ctrl-item">{{ row[item.key][0] }}</div>
							<div class="two-ctrl-item">{{ row[item.key][1] }}</div>						
						</div>
						<span v-else-if="item.colType === 'selorinput'">{{ item.suffix?(updateSoiShowtext(row,item) + item.suffix):updateSoiShowtext(row,item) }}</span>
						<span v-else-if="item.colType === 'datepicker'">{{ item.suffix?(selColShowText(row,item) + item.suffix):Ysh.Time.formatString(new Date(selColShowText(row,item)), getTimeFormat(item.dateFormat)) }}</span>
						<span v-else>{{ item.suffix?(selColShowText(row,item) + item.suffix): selColShowText(row,item)}}</span>
					</template>

					<template slot-scope="{ row, index }" :slot="columns[columns.length-1]['slot']">
						<div v-if="editIndexArr.includes(row.rowindex-1)">		
							<div v-if="addRow">	
								<Button v-if='saveBtnSeen' @click.stop="newRowSave(row.rowindex-1)" key="newRow-save">保存</Button>						
								<Button @click.stop="newRowCancel(row,row.rowindex-1)" key="newRow-remove">取消</Button>
							</div>
							<template v-else>
								<Button v-if='saveBtnSeen' @click.stop="editSave(row.rowindex-1)" key="edit-save">保存</Button>
								<Button @click.stop="editCancel(row.rowindex-1)" key="edit-cancel">取消</Button>								
							</template>							
						</div>
						<div class="f jc ac" v-else>
							<slot name='else-btn' :row='row' :index='row.rowindex-1'></slot>
							<template v-if="removeBtnShow(row)">
								<a v-if="removeLink" href="" onclick="return false;" @click.stop="rowRemove(row,row.rowindex-1)" key="edit-remove">删除</a>
								<img src="/i/PDPImg/delete.png" width="17px" height='17px' alt='删除' v-else style='cursor: pointer;'  @click.stop="rowRemove(row,row.rowindex-1)" key="edit-remove"/>
							</template>
							<template v-if="moveBtnShow">
								<div class='move-btns' v-if="moveBtnWrapperSeen[row.rowindex-1]" :style="{position:'absolute',top: moveBtnTop+'px',left: moveBtnLeft+'px',}">
									<span class='move-up-btn' title="上移"  @click.stop="rowMove('up',row,row.rowindex-1)" key="edit-up"></span>
									<span class='move-down-btn'  title="下移"  @click.stop="rowMove('down',row,row.rowindex-1)" key="edit-down"></span>
								</div>
							</template>
						</div>
					</template>

					<div v-if="pageSeen" slot="footer" style="display: flex;justify-content: center;">
							<div v-if='tDataLen-tPageSize>0'>
									<Page :total="tDataLen" :page-size="tPageSize" :current="tCurrPage" show-elevator @on-change="changePage"></Page>
							</div>
					</div>
				</i-table>				
			</div>	
		`
}) 