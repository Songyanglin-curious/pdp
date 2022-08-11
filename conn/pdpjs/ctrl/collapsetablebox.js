
/**
 * 使用前说明
 * 使用前需要执行下列SQL语句,创建表
CREATE TABLE "DBTABLEEDITCOLUMN"
(
"TITLE" VARCHAR(50),
"FIELDNAME" VARCHAR(50),
"ISIDENTITY" INT,
"COLTYPE" VARCHAR(50),
"DATASOURCE" VARCHAR(80),
"TABLENAME" VARCHAR(50),
"WIDTH" INT,
"MINWIDTH" INT,
"ISFILTER" INT) STORAGE(ON "MAIN", CLUSTERBTR) ;
COMMENT ON COLUMN "MONITOR_KM"."DBTABLEEDITCOLUMN"."COLTYPE" IS '编辑态控件类型';
COMMENT ON COLUMN "MONITOR_KM"."DBTABLEEDITCOLUMN"."DATASOURCE" IS '控件数据源（仅coltype为select需要填写）';
COMMENT ON COLUMN "MONITOR_KM"."DBTABLEEDITCOLUMN"."FIELDNAME" IS '字段名';
COMMENT ON COLUMN "MONITOR_KM"."DBTABLEEDITCOLUMN"."ISFILTER" IS '是否筛选';
COMMENT ON COLUMN "MONITOR_KM"."DBTABLEEDITCOLUMN"."ISIDENTITY" IS '是否自增列';
COMMENT ON COLUMN "MONITOR_KM"."DBTABLEEDITCOLUMN"."MINWIDTH" IS '最小列宽';
COMMENT ON COLUMN "MONITOR_KM"."DBTABLEEDITCOLUMN"."TABLENAME" IS '表名';
COMMENT ON COLUMN "MONITOR_KM"."DBTABLEEDITCOLUMN"."TITLE" IS '表格列名';
COMMENT ON COLUMN "MONITOR_KM"."DBTABLEEDITCOLUMN"."WIDTH" IS '列宽';
 */
Vue.component('collapse-table-box', {
    props: {
        titleId: {//表格ID，删除表格时会用到
            type: String,
        },
        title: {//如果需要表格左上方显示标题则配置该属性值为标题值。
            type: String
        },
        allowDel:{//删除组件图片是否显示
            type: Boolean,
            default: false,
        },
        add1row: {//如果需要显示添加按钮则配置该属性值为true
            type: Boolean,
            default: false,
        },
        addRowBtn:{//如果不需要显示添加按钮则配置该属性值为false
            type: Boolean,
            default: true,
        },
        manyRowText: {//显示添加多行输入框后面得文字，谁用谁配
            type: String,
            default: '行',
        },
        onlyOneRow:{//是否仅仅添加1行
            type: Boolean,
            default: true,
        },
        addManyRow:{//添加多行输入框值
            type: Number,
            default: 2,
        },
        table: {//后台表名字 
            type: String
        },
        condition: {//where条件用它拼成一条sql语句
            type: String
        },        
        tableHeight: {//表格高度
            type: [Number, String],
        },      
        tableBorder:{//表格边框
            type: Boolean,
            default: true,
        }, 
        actionColWidth:{//操作列宽
            type: Number,
            default: 0
        }, 
        tablePageSize:{//表格每一页得条数
            type: Number,
			default: 10,
        },
        editToForm:{//是否启用表单模式来新增、编辑
			type: Boolean,
            default: false,
		},
        modalWidth:{//新增、编辑行的modal框的宽度 
            type: [Number, String],
            default: 1000,
        },
        selDisCols: {//哪些列里面得select组件需要禁用
            type: Array,
            default: function () {
                return []
            },
        },
        removeCols: {//哪些列需要隐藏
            type: Array,
            default: function () {
                return []
            },
        },
        pageSeen:{//分页组件是否可见（只有一行的表格不需要显示分页）
			type: Boolean,
            default: true,
		},
        removeBtnShow:{//删除按钮是否显示，不显示得话行就不能删除
			type: Function,
            default: function (row) {
                return false
            },
		},
        removeLink:{//删除是否显示成链接（true为链接，false为按钮）
			type: Boolean,
            default: false,
		},
        saveBtnSeen:{//行保存按钮是否展示
			type: Boolean,
            default: false,
		},
        addDefaultCol: {//新增行保存时不需要显示，但是需要入库的其他数据
            type: Object
        },
        rowSelection:{//是否开启行复选框
            type: Boolean,
            default: false,
        },
        addCancelDis: {//新增行是否取消禁用select框（如果设置了select框禁用的话）
            type: Boolean,
            default: false,
        },
        manualInit:{//是否手动初始化（如果是则开发者自己手动调用initCtrl方法初始化组件）
            type: Boolean,
            default: false,
        },

        filterSelColData:{//xml中配置，重新定义select的数据源。
            type: Function,
        },
        rowDefaultData:{//xml中配置，新增行的默认值，不传默认都是空
            type: Object
        },
        pageMachiningData:{//xml中配置，加工数据，对现有从表里查出来的数据重新加工一下，返回新的数据再给表格绑定
            type: Function,
        },

        pageEditTitle:{//xml中配置，编辑组件title之后的操作。
            type: Function,
        },
        beforeRemoveCtrl: {
            type: Function,
        },
        afterRemoveCtrl:{//xml中配置，删除组件之后的操作。
            type: Function,
        },
        pageAdd1Row: {//xml中配置，点击添加按钮，页面出现新增行之后的操作。
            type: Function,
        },
        pageAdd2Row: {//xml中配置，点击添加两行按钮，页面出现新增行之后的操作。
            type: Function,
        },
        addSaveElse:{//xml中配置，新增行点击保存按钮，新增行数据入库之前的操作。
            type: Function,
        },
        pageAddSave: {//xml中配置，新增行点击保存按钮，新增行数据入库之后的操作。
            type: Function,
        },
        pageRemoveRow: {//xml中配置，点击删除按钮，当前行数据删除之前的操作，返回true才可以进行删除操作
            type: Function,
        },
        beforeRemoveRow: {
            type: Function,
        },
        afterRemoveRow: {//xml中配置，点击删除按钮，删除成功之后的操作。
            type: Function,
        },        
        editSaveElse: {//xml中配置，编辑行点击保存按钮,编辑行数据入库之前返回新的innerData。
            type: Function,
        },
        pageDecisionSave:{//xml中配置，编辑行点击保存按钮,编辑行数据入库之前的操作。
            type: Function,
        },
        pageEditSave: {//xml中配置，编辑行点击保存按钮,编辑行数据入库之后的操作。
            type: Function,
        },  
        pageRowMove:{//xml中配置，点击上移或下移按钮的操作。
            type: Function,
        },      
        clickActionCol: {//xml中配置，页面点击操作列时的操作。
            type: Function,
        },     
        tblCellClick:{//xml中配置，列类型为href的单元格点击事件。
            type: Function,
        },  
        pageDecisionEdit:{//xml中配置，页面决定行点击是否编辑
			type: Function
		},
        pageSetSelorinput: {//xml中配置，页面设置selorinput相关
            type: Function
        },
        pageSelSelect:{//xml中配置，页面处理select列类型select的select事件
			type: Function
		},
        pageEditSelData:{//页面处理select列类型select的数据源
			type: Function
		},
        selectGroupHandler1:{//selectGroup处理程序1
			type: Function
        },
        selectGroupHandler2:{//selectGroup处理程序2
			type: Function
        },
        indexClassHandler:{//序号列样式
			type: Function,
            default: function(row){
                return {}
            }
        },
        pageSaveHandler:{//页面执行新增行保存操作
            type: Function
        },
        pageRowRemoveHandler:{//页面执行行删除操作
            type: Function
        },
        pageRowEditSaveHandler:{//页面执行编辑行保存操作
            type: Function
        },
        pageRowSelectionChange:{//页面处理行复选框点击事件
			type: Function
		},
        pageInitSoi:{//页面初始化selectorinput组件相关
			type: Function
		},
    },
    data() {
        return {
            collapseIconType: 'md-arrow-dropup',            
            editTitleSeen: false,//编辑标题的modal框是否显示
            ctrlTitle: this.title,//组件title
            currTitle:"",//编辑title时的当前title
            showCtrl: true,//是否显示组件
            contentSeen: true,//是否显示表格
            dataLoaded: false,
            originalInnerColumns: [],//从后台获取到的数据列(原始数据列数据，不做任何改变)
            originalInnerData: [],//从后台获取到的所有数据(原始数据，不做任何改变)
            innerColumns: [],//从后台获取到的数据列
            innerData: [],//从后台获取到得数据
            tDataAuxiliary:null,//为了使tData计算属性的set函数符合vue的语法写的辅助变量
            editIndexArr: [],//当前处于编辑状态得行号
            addRow: false, //添加行状态变量（来自点击添加按钮，值为true，来自其他，值为false）
            filterCols: [],//列筛选的时候用
            tblCurrPage: 1,//默认当前页为第1页
            modalTitle: "",//新增、编辑行的modal框标题
            modalSeen: false,//新增、编辑行的modal框是否显示
            formDataSource: {},//表单数据源
            formTblCurrPage: null,//表单操作的行是哪一页
            formTblRowIndex: null,//表单编辑的行的行号
            moveBtnShow: false
        }
    },
    computed: {        
        /**
         * 总的表格列（从后台获取到的数据列拼上序号列和操作列）
         * @returns 总的表格列
         */
        tableColumns: function () {
            if(this.rowSelection){
                return [{
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },{ slot: "rowindex", key: "rowindex", title: "序号", width: 50 }].concat(this.innerColumns).concat([{ title: "操作", slot: "action", key: "action", width: this.actionColWidth }]);
            }else{
                return [{ slot: "rowindex", key: "rowindex", title: "序号", width: 50 }].concat(this.innerColumns).concat([{ title: "操作", slot: "action", key: "action", width: this.actionColWidth }]);
            }
        },        
        //表格可编辑的列组成的数组
        /**key：列显示内容（对应columns里配置的slot的字段值）
         * slotName： template的slot属性值，为了使用slot-scope，一定要加一个这属性，要不然不能用
         * colType：列编辑控件类型，（是'input'还是'select'？等等）
         * vmodel：与控件值相绑定的变量，在保存的时候会赋给data，以更新data数据源
         * selColData： 控件类型为select时，select控件绑定的数据源
         */
         tblEditCol() {
            let data = [], columns = this.innerColumns;
            for (let i = 0, l = columns.length; i < l; i++) {
                data[i] = {};
                data[i]['key'] = columns[i]['slot'];
                data[i]['slotName'] = columns[i]['slot'];
                data[i]['title'] = columns[i]['title'];
                data[i]['colType'] = columns[i]['colType'];
                data[i]['vmodel'] = [];
                data[i]['selDisabled'] = columns[i]['selDisabled'];
                data[i]['selColData'] = columns[i]['selColData'];
                data[i]['selGroupColData'] = columns[i]['selGroupColData'];
                data[i]['suffix'] = columns[i]['suffix'];
                data[i]['dateFormat'] = columns[i]['dateFormat'];
            }
            return data;
        },
        /**
         * 每行数据都拼上一个‘rowindex’属性
         * @returns 总数据源
         */
         tableData: function () {
            let data = [];
            for(let i=0,l=this.innerData.length;i<l;i++){
                data[i] = {'rowindex': i+1,...this.indexClassHandler(this.innerData[i]),...this.innerData[i]}
            }            
            return data;
        },
        /**
         * 当前显示得表格数据（某一页的数据）
         */
        tData:{
            get: function () {
                return this.tDataAuxiliary || this.getTblData();
            },
            set: function (newValue) {
                this.tDataAuxiliary = newValue;
            }
        },
        /**
         * 
         * @returns 最后一页页码
         */
        lastPage: function() {
            let iD = this.innerData,tPS = this.tablePageSize;
            return iD.length/tPS > parseInt(iD.length/tPS)
                    ? parseInt(iD.length/tPS) + 1
                    : parseInt(iD.length/tPS)
        },
    },
    methods: {
        /****************组件相关工具函数****/
        /********************************暂时搁置  两列合一 */
        /*
        //合并列编辑时组件为TwoCtrl的列
        mergeTwoCtrlCol(){
            let group = {};
            for (let i = 0; i < this.innerColumns.length; i++) {
                var title = this.innerColumns[i].title;
                if (!Object.keys(group).includes(title)) {
                    group[title] = [];
                }
                group[title].push(this.innerColumns[i]);
            }
            console.log(group)
        },
        //拆分列编辑时组件为TwoCtrl的列
        splitTwoCtrlCol(){

        },
        */
        /********************************暂时搁置  两列合一 */
        //设置添加行状态变量为false（除了点击添加按钮设置为true，其余操作都应该将其置为false）
        setAddRowFalse() {
            this.addRow = false;
        },
        //表格设置编辑状态行号（行状态由显示态转为编辑态）
        tableSetEditRow(index) {
            this.editIndexArr = [];
            if (index || index === 0) {//传行号，传谁谁是编辑态。
                this.editIndexArr.push(index);
            }
        },        
        /**
         * select类型列根据value对应label
         * @param {*} colSlot 列得slot属性值
         * @returns select框选项value:label对象
         */
        getSelLabel(colSlot){
            let columns = this.innerColumns,selObj={};
            for(let i=0,l=columns.length;i<l;i++){                
                if(columns[i]['slot'] === colSlot){
                    if(columns[i]['colType'] !== "select"){
                        return;
                    }
                    for(let j=0,m=columns[i]['selColData'].length;j<m;j++){
                        selObj[columns[i]['selColData'][j]['value']] = columns[i]['selColData'][j]['label'];
                    }
                    break;
                }
            }
            return selObj;
        },
        /**
         * 如果编辑时是datapicker控件，需要给tt[i]['vmodel'][index]赋下值（达到v-model的效果），
            datapicker的tt[i]['vmodel']没用双向绑定，用双向绑定后值得格式会变成类似
            （Mon Dec 20 2021 16:07:08 GMT+0800 (中国标准时间)）这种格式
         * @param {*} tt tblEditCol
         * @param {*} i tblEditCol的索引
         * @param {*} tblTwoCtrlDateVal [tblEditCol[i]['key'],newVal]
         * @param {*} index 行号-1
         */
        checkDatapicker(tt,i,tblTwoCtrlDateVal,index){            
            if(tblTwoCtrlDateVal
                &&(tt[i]['colType']==='datepicker-datepicker'
                ||tt[i]['colType']==='datepicker')){
                for(let j =0,k=tblTwoCtrlDateVal.length;j<k;j++){
                    if(tblTwoCtrlDateVal[j][0] === tt[i]['key']){
                        tt[i]['vmodel'][index] = tblTwoCtrlDateVal[j][1];
                        break;
                    }
                }          
            }
        },
        //获取指定页表格数据
		getTblData(page){
			if(!page){page = 1}
			let data=[],dataSrc = this.tableData;
			let startRowIndex = 0 + (page-1) * this.tablePageSize;
			let endRowIndex = 0 + (page-1) * this.tablePageSize + this.tablePageSize;
			endRowIndex = endRowIndex>dataSrc.length? dataSrc.length: endRowIndex;
			for(let i=startRowIndex,l=endRowIndex;i<l;i++){
				data.push(dataSrc[i]);
			}
			return data;
		},
        //刷新表格指定页数据
        refreshPageData(page){
            page = page?page:this.tblCurrPage;
            this.tData = this.getTblData(page);
        },
        //跳转到表格指定页
        jumpPage(page){
            this.tblCurrPage = page;
            this.refreshPageData(page);
        },
        //如果有selectgroup类型，需要给selectgroup类型的列前台赋值
        checkSelectGroup(){
            for (var i = 0; i < this.innerColumns.length; i++) {//判断某列是不上selectgroup类型
                if (this.innerColumns[i]['colType'] == 'selectgroup') {//是这个类型
                    let selGroupColKey = this.innerColumns[i]['slot'];
                    this.innerColumns[i]['selGroupColData'] = [];
                    for (var j = 0; j < this.innerData.length; j++) {//循环所有行，根据每行的设备类型，查原理等数据绑定
                        if(this.selectGroupHandler1){
                            let res = this.selectGroupHandler1(this.innerData[j]);
                            this.innerColumns[i]['selGroupColData'].push({
                                sel: res[0],
                                cas: res[1]
                            })
                        }
                        if(this.selectGroupHandler2){
                            let res = this.selectGroupHandler2(this.innerData[j]);
                            this.innerData[j][selGroupColKey] = [res[0], [res[1], res[2]]]                        
                        }
                    }
                }
            }
        },
        //通过column的key去取对应的title
        getColPropFromColKey(key,prop){
            let editCol = this.tblEditCol;
            for(let item of editCol){
                if(item.key === key){
                    return item[prop];
                }
            }
        },
        //初始化组件
        initCtrl(){
            var o = PDP.dll("PDPControl:PDPControl.TableEditControl.GetData", [this.table, this.condition]);
            if (!o.check("", true))
                return;
            this.innerColumns = JSON.parse(o.value[0][0]);
            this.innerData = JSON.parse(o.value[0][1]);
            this.moveBtnShow = o.value[0][2] == "1";
            this.originalInnerColumns = [...this.innerColumns];
            this.originalInnerData = [...this.innerData];
            if(this.pageMachiningData){//页面根据现有数据加工一下，返回新的innerColumns、innerData
                ({"innerColumns":this.innerColumns,"innerData":this.innerData} 
                = 
                this.pageMachiningData(this.innerColumns,this.innerData));
            }
            if(this.filterSelColData){
                this.innerColumns = this.filterSelColData(this.innerColumns);                
            }
            this.disSelCols();//指定某些select类型列得select框禁用，若没有则什么都不干
            this.removeColsHandler();//指定隐藏某些列，若没有则什么都不干            
            this.checkSelectGroup();//如果columns有selectgroup类型        
            this.tblCurrPage = 1;	
            this.refreshPageData(this.tblCurrPage);//初始化操作把表格切换到第一页数据       		
            this.dataLoaded = true;
            this.filterColsHandler();//哪些列需要筛选
        },

        /**************组件相关操作函数******/
        //删除组件！
        removeCtrl(){
            if (this.beforeRemoveCtrl && !this.beforeRemoveCtrl(this.title)) {
                return;
            }
            this.showCtrl = !this.showCtrl;
            if(this.afterRemoveCtrl){
                this.afterRemoveCtrl(this.titleId)
            }
        },
        //折叠表格
        collapse() {
            this.collapseIconType = this.collapseIconType === 'md-arrow-dropup' ? 'md-arrow-dropdown' : 'md-arrow-dropup';
            this.contentSeen = !this.contentSeen;
        },
        //编辑组件标题
        editTitle(type) {            
            this.editTitleSeen = !this.editTitleSeen;
            if(type == 1){
                this.ctrlTitle = this.currTitle;
                if(this.pageEditTitle){
                    this.pageEditTitle(this.ctrlTitle);
                }
            }
        },
        //编辑标题时input的on-change事件
        changeTitle(e){
            this.currTitle = e.target.value;
        },
        /***表单模式 */
        //通过表单新增一行
        formAdd1Row(rowDefaultData){
            let rowData = {}, vm = this;            
            let editCol = this.tblEditCol;
            let formdata = {};
            let formctrls = [];
            for (let i = 0, l = vm.originalInnerColumns.length; i < l; i++) {
                rowData[vm.originalInnerColumns[i]['slot']] = '';
            }
            if(rowDefaultData){
                for(let key in rowDefaultData){
                    if(Object.prototype.toString.call(rowDefaultData[key]).slice(8,-1) === 'Date'){
                        this.$refs.ctable.datePickerArr.push([key,Ysh.Time.formatString(rowDefaultData[key],111000)]);
                    }
                    rowData[key] = rowDefaultData[key];
                }
            }
            vm.innerData.push({ ...rowData });
            vm.jumpPage(vm.lastPage);            
            for(let item of this.tblEditCol){
                if(item.colType === 'selorinput'){
                    this.$refs.ctable.initSelorinput(vm.innerData,item.key);
                }
            }
            
            for(let item of editCol){
                formdata[item.key] = rowData[item.key]
            }
            for(let item in formdata){
                formctrls.push([{
                    'datakey': item,
                    'label': vm.getColPropFromColKey(item,"title"),
                    'type': vm.getColPropFromColKey(item,"colType"),
                    'source': vm.getColPropFromColKey(item,"selColData"),
                }])
            }

            this.formDataSource = {
                formdata,
                ctrls:formctrls,
                labelposition: 'right',
                labelwidth: 150,
            };


            this.formTblCurrPage = vm.lastPage;
            this.formTblRowIndex = vm.tData[vm.tData.length - 1].rowindex - 1;

            this.modalTitle = '新增';
            this.modalSeen = true;
        },
        //通过表单取消新增
        formCancelAddRow(){
            let row = this.formDataSource.formdata;
            let index = this.formTblRowIndex;
            this.$refs.ctable.newRowCancel(row,index);
        },
        //通过表单来编辑表格行
        formRowEdit(row, index,formTblCurrPage){
            this.formTblCurrPage = formTblCurrPage;
            this.formTblRowIndex = index;
            let vm = this;
            let editCol = this.tblEditCol;
            let formdata = {};
            let formctrls = [];
            for(let item of editCol){                
                formdata[item.key] = row[item.key];                
            }
            for(let item in formdata){
                formctrls.push([{
                    'datakey': item,
                    'label': vm.getColPropFromColKey(item,"title"),
                    'type': vm.getColPropFromColKey(item,"colType"),
                    'source': vm.getColPropFromColKey(item,"selColData"),
                }])
            }

            this.formDataSource = {
                formdata,
                ctrls:formctrls,
                labelposition: 'right',
                labelwidth: 150,
            };
            this.modalTitle = '编辑';
            this.modalSeen = true;
        },
        //表单新增、编辑行保存操作
        formSubmit(){
            let formdata = this.formDataSource.formdata;
            let tblPage = this.formTblCurrPage;
            let index = this.formTblRowIndex;
            let tt = this.tblEditCol;
            for (let i = 0, l = tt.length; i < l; i++) {
                if(Tools.type(formdata[tt[i]['key']]) === 'Date'){
                    formdata[tt[i]['key']] = Ysh.Time.formatString(formdata[tt[i]['key']],111000)
                }
                this.innerData[index][tt[i]['key']] = formdata[tt[i]['key']];
            }

            //页面决定是否保存
            if(this.pageDecisionSave){
                if(!this.pageDecisionSave(this.innerData[index])){
                    return false;
                }
            }

            if(this.modalTitle === '新增'){
                /*如果有其他操作，比如设置隐藏列的数据
                this.addSaveElse对row操作之后一定要返回row，
                否则默认row还是操作之前的数据
                */
                if(this.addSaveElse){
                    this.innerData[index] = this.addSaveElse(this.innerData[index], index)||this.innerData[index];
                }

                if(this.pageSaveHandler){
                    this.pageSaveHandler(this.innerData[index]);
                }else{
                    var o = PDP.dll("PDPControl:PDPControl.TableEditControl.AddData", [this.table, JSON.stringify(this.innerData[index])]);
                    if (!o.check("", true))
                        return;
                    var identityCol = o.value[0][0];
                    var id = o.value[0][1];
                    this.innerData[index][identityCol] = id;
                }                
                if(this.pageAddSave){
                    this.innerData[index] = this.pageAddSave(this.innerData[index], index)||this.innerData[index];
                }
            }else if(this.modalTitle === '编辑'){
                

                if(this.pageMachiningData){//页面根据现有数据加工一下，返回新的innerColumns、innerData
                    ({"innerColumns":this.innerColumns,"innerData":this.innerData} 
                    = 
                    this.pageMachiningData(this.innerColumns,this.innerData));
                }
                /*如果有其他操作，比如设置隐藏列的数据
                this.editSaveElse对row操作之后一定要返回row，
                否则默认row还是操作之前的数据
                */
                if(this.editSaveElse){
                    this.innerData[index] = this.editSaveElse(this.innerData[index], index)||this.innerData[index];
                }

                if(this.pageRowEditSaveHandler){
                    this.pageRowEditSaveHandler(this.innerData[index])
                }else{
                    var o = PDP.dll("PDPControl:PDPControl.TableEditControl.ModifyData", [this.table, JSON.stringify(this.innerData[index])]);
                    if (!o.check("", true))
                        return;
                }               
                
                if(this.pageEditSave){
                    this.innerData[index] = this.pageEditSave(this.innerData[index], index)||this.innerData[index];
                }

                if(this.pageMachiningData){//页面根据现有数据加工一下，返回新的innerColumns、innerData
                    ({"innerColumns":this.innerColumns,"innerData":this.innerData} 
                    = 
                    this.pageMachiningData(this.innerColumns,this.innerData));
                }                
            }     
            this.refreshPageData(tblPage);//刷新页面显示
        },
        /***新增操作 */
        //新增一行
        add1Row() {
            if(+this.addManyRow === 0 || typeof (+this.addManyRow) != 'number' || Number.isNaN(+this.addManyRow)){
                return false;
            }
            let _this = this;
            if(+this.addManyRow>1&&this.add1row){
                //添加多行时页面配置pageAdd2Row属性函数，里面新增好数据并赋值给this.innerData
                if(this.pageAdd2Row){
                    this.pageAdd2Row(this);
                }

                _this.jumpPage(_this.lastPage);

                return;
            }
            let rowDefaultData = this.rowDefaultData;
            if(this.editToForm){
                this.formAdd1Row(rowDefaultData);
                return;
            }
            let rowData = {}, vm = this;
            for (let i = 0, l = vm.originalInnerColumns.length; i < l; i++) {
                if(vm.originalInnerColumns[i]['colType'] == 'selectgroup'){
                    rowData[vm.originalInnerColumns[i]['slot']] = [];
                }else{
                rowData[vm.originalInnerColumns[i]['slot']] = '';
            }
            }

            if(rowDefaultData){
                for(let key in rowDefaultData){
                    if(Object.prototype.toString.call(rowDefaultData[key]).slice(8,-1) === 'Date'){
                        this.$refs.ctable.datePickerArr.push([key,Ysh.Time.formatString(rowDefaultData[key],111000)]);
                    }
                    //rowData[key] = rowDefaultData[key];
                    if (Object.keys(rowData).includes(key)) {
                    rowData[key] = rowDefaultData[key];
                }
            }
            }
            

            vm.innerData.push({ ...rowData });
            vm.jumpPage(vm.lastPage);
            for(let item of this.tblEditCol){
                if(item.colType === 'selorinput'){
                    this.$refs.ctable.initSelorinput(vm.tableData[vm.tableData.length - 1],item);
                }
            }
            

            vm.addRow = true;
            for (let i = 0, l = vm.tblEditCol.length; i < l; i++) {
                vm.tblEditCol[i]['vmodel'][vm.innerData.length - 1] = rowData[vm.tblEditCol[i]['key']]
            }
            if(this.pageSetSelorinput){
                this.pageSetSelorinput(this.tableData[this.tableData.length - 1], this.innerColumns);
            }
            vm.rowEditCancel(vm.innerData.length - 2);
            if(this.addCancelDis){
            vm.cancelDisSelCols();
            }
            vm.tableSetEditRow(vm.innerData.length - 1);
            if(this.pageAdd1Row){
                this.pageAdd1Row(this);
            }
            
        },
        //表格新增行保存操作
        newRowSave(index,tblPage,tblTwoCtrlDateVal) {
            let tt = this.tblEditCol;
            for (let i = 0, l = tt.length; i < l; i++) {
                this.checkDatapicker(tt,i,tblTwoCtrlDateVal,index);
                this.innerData[index][tt[i]['key']] = tt[i]['vmodel'][index];
            }

            //页面决定是否保存
            if(this.pageDecisionSave){
                if(!this.pageDecisionSave(this.innerData[index])){
                    return false;
                }
            }

            /*如果有其他操作，比如设置隐藏列的数据
                this.addSaveElse对row操作之后一定要返回row，
                否则默认row还是操作之前的数据
            */
            if(this.addSaveElse){
                this.innerData[index] = this.addSaveElse(this.innerData[index], index)||this.innerData[index];
            }

            if(this.pageSaveHandler){
                this.pageSaveHandler(this.innerData[index]);
            }else{
                var o = PDP.dll("PDPControl:PDPControl.TableEditControl.AddData", [this.table, JSON.stringify(Object.assign(this.innerData[index], this.addDefaultCol)), this.innerData.length]);
                if (!o.check("", true))
                    return;
                var identityCol = o.value[0][0];
                var id = o.value[0][1];
                this.innerData[index][identityCol] = id;
                if (o.value[0].length > 2) {
                    var indexCol = o.value[0][2];
                    var indexValue = o.value[0][3];
                    this.innerData[index][indexCol] = indexValue;
                }
            }          
            this.rowEditCancel(index);
            this.setAddRowFalse();
            if(this.pageAddSave){
                this.innerData[index] = this.pageAddSave(this.innerData[index], index)||this.innerData[index];
            }
            this.refreshPageData(tblPage);//刷新页面显示
        },
        /**删除操作 */
        //表格删除一行
        rowRemove(row,index,tblPage,delRow) {
            if (this.beforeRemoveRow && !this.beforeRemoveRow(row)) {
                return;
            }
            if(this.pageRemoveRow){
                if(this.pageRemoveRow(this.innerData[index], index)){
                    if(delRow){
                        if(this.pageRowRemoveHandler){
                            this.pageRowRemoveHandler(this.innerData[index])
                        }else{
                            var o = PDP.dll("PDPControl:PDPControl.TableEditControl.DeleteData", [this.table, JSON.stringify(this.innerData[index])]);
                            if (!o.check("", true))
                                return;
                        }                  
                    }                    
                    this.innerData.splice(index, 1);
                    tblPage = tblPage>this.lastPage?this.lastPage:tblPage;
                    this.refreshPageData(tblPage);//刷新页面显示
                    this.setAddRowFalse();
                    let ei = this.editIndexArr, tdcd = this.tblEditCol;
                    for (let i = 0, l = ei.length; i < l; i++) {
                        if (ei[i] > index) {
                            ei[i] = ei[i] - 1;
                        }
                    }
                    for (let i = 0, l = tdcd.length; i < l; i++) {
                        tdcd[i]['vmodel'].splice(index, 1);
                    }
                    if(delRow){
                        this.$Message.success('删除成功！');
                        if(this.afterRemoveRow){
                            this.afterRemoveRow(row);
                        }
                    }else{
                        this.rowEditCancel(index);
                        this.$Message.success('取消添加！');
                    }
                }else{//提示删除失败                    
                    this.$Message.error('删除失败！');
                }
            }else{
                this.$Message.error('删除失败！');
                return false;
            }
        },
        /**修改操作 */        
        //表格编辑操作
        rowToEditState(row, index) {
            let tt = this.tblEditCol;
            for (let i = 0, l = tt.length; i < l; i++) {
                tt[i]['vmodel'][index] = row[tt[i]['key']]
            }
            this.tableSetEditRow(index);
            this.setAddRowFalse();
            if(this.pageSetSelorinput){
                this.$nextTick(function(){
                    this.pageSetSelorinput(row,this.innerColumns);
                    this.refreshPageData();
                })
            }
        }, 
        //表格编辑行保存操作
        rowEditSave(index,tblPage,tblTwoCtrlDateVal) {
            let tt = this.tblEditCol;
            for (let i = 0, l = tt.length; i < l; i++) {
                this.checkDatapicker(tt,i,tblTwoCtrlDateVal,index);
                this.innerData[index][tt[i]['key']] = tt[i]['vmodel'][index];
            }

            //页面决定是否保存
            if(this.pageDecisionSave){
                if(!this.pageDecisionSave(this.innerData[index])){
                    return false;
                }
            }

            if(this.pageMachiningData){//页面根据现有数据加工一下，返回新的innerColumns、innerData
                ({"innerColumns":this.innerColumns,"innerData":this.innerData} 
                = 
                this.pageMachiningData(this.innerColumns,this.innerData));
            } 

            /*如果有其他操作，比如设置隐藏列的数据
                this.editSaveElse对row操作之后一定要返回row，
                否则默认row还是操作之前的数据
            */
            if(this.editSaveElse){
                this.innerData[index] = this.editSaveElse(this.innerData[index], index)||this.innerData[index];
            }            

            if(this.pageRowEditSaveHandler){
                this.pageRowEditSaveHandler(this.innerData[index])
            }else{
                var o = PDP.dll("PDPControl:PDPControl.TableEditControl.ModifyData", [this.table, JSON.stringify(this.innerData[index])]);
                if (!o.check("", true))
                    return;
            }            
            this.rowEditCancel(index);
            this.setAddRowFalse();
            if(this.pageEditSave){
                this.innerData[index] = this.pageEditSave(this.innerData[index], index)||this.innerData[index];
            }  
            
            if(this.pageMachiningData){//页面根据现有数据加工一下，返回新的innerColumns、innerData
                ({"innerColumns":this.innerColumns,"innerData":this.innerData} 
                = 
                this.pageMachiningData(this.innerColumns,this.innerData));
            }           
            this.refreshPageData(tblPage);//刷新页面显示
        },  
        //表格取消编辑状态行（行状态由编辑态转为显示态）
        rowEditCancel(index) {
            if (this.editIndexArr.includes(index)) {
                let pos = this.editIndexArr.indexOf(index);
                this.editIndexArr.splice(pos, 1);
                this.disSelCols();//指定某些select类型列得select框禁用，若没有则什么都不干
            }
        },      
        //哪些列需要筛选
        filterColsHandler(){
            for(let i=0,l=this.innerColumns.length;i<l;i++){
                if(this.innerColumns[i]['isfilter']){
                    this.filterCols.push(this.innerColumns[i]['slot'])
                }
            }
            if (!this.filterCols.length) {
                return;
            }
            if (this.filterCols.length > 0) {
                let filterArr = [],vm=this,fArr=[];
                for (let i = 0, l = this.filterCols.length; i < l; i++) {
                    if(this.getSelLabel(this.filterCols[i])){//是select类型
                        for (let j = 0, m = this.innerData.length; j < m; j++) { 
                            if(!fArr.includes(this.innerData[j][this.filterCols[i]])){
                                fArr.push(this.innerData[j][this.filterCols[i]]);         
                                filterArr.push({
                                    label: this.getSelLabel(this.filterCols[i])[this.innerData[j][this.filterCols[i]]],
                                    value: this.innerData[j][this.filterCols[i]]
                                });
                            }else{
                                continue;
                            }                            
                        }
                    }else{//其他类型
                        for (let j = 0, m = this.innerData.length; j < m; j++) {
                            if(!fArr.includes(this.innerData[j][this.filterCols[i]])){
                                fArr.push(this.innerData[j][this.filterCols[i]]); 
                                filterArr.push({
                                    label: this.innerData[j][this.filterCols[i]],
                                    value: this.innerData[j][this.filterCols[i]]
                                });
                            }else{
                                continue;
                            }                             
                        }
                    }                 
                    for (let j = 0, m = this.innerColumns.length; j < m; j++) {
                        if(this.filterCols[i] === this.innerColumns[j]['slot']){
                            this.innerColumns[j]['filters'] = filterArr;
                            this.innerColumns[j]['filterMethod'] = function (value, row) {
                                return row[vm.filterCols[i]].indexOf(value) > -1;
                            };
                        }
                    }
                    filterArr = [];fArr = [];
                }
            }					
        },
        //指定某些select类型列得select框禁用
        disSelCols() {
            if (!this.selDisCols.length) {
                return;
            }
            if (this.selDisCols.length > 0) {
                for (let i = 0, l = this.selDisCols.length; i < l; i++) {
                    for (let j = 0, m = this.innerColumns.length; j < m; j++) {
                        if (this.selDisCols[i] === this.innerColumns[j]['slot']) {
                            this.$set(this.innerColumns[j], 'selDisabled', true);
                            this.$set(this.tblEditCol[j], 'selDisabled', true);
                            break;
                        }
                    }
                }
            }
        },
        //取消指定某些select类型列得select框禁用
        cancelDisSelCols() {
            if (!this.selDisCols.length) {
                return;
            }
            if (this.selDisCols.length > 0) {
                for (let i = 0, l = this.selDisCols.length; i < l; i++) {
                    for (let j = 0, m = this.innerColumns.length; j < m; j++) {
                        if (this.selDisCols[i] === this.innerColumns[j]['slot']) {
                            this.$set(this.tblEditCol[j], 'selDisabled', false);
                            break;
                        }
                    }
                }
            }
        },
        //指定隐藏某些列
        removeColsHandler() {
            if (!this.removeCols.length) {
                return;
            }
            if (this.removeCols.length > 0) {
                let removeArr = [];
                for (let i = 0, l = this.removeCols.length; i < l; i++) {
                    for (let j = 0, m = this.innerColumns.length; j < m; j++) {
                        if (this.removeCols[i] === this.innerColumns[j]['slot']) {
                            removeArr.push(j)
                        }
                    }
                }
                removeArr.sort(function (a, b) { return a - b });
                for (let i = removeArr.length - 1, l = -1; i > l; i--) {
                    this.innerColumns.splice(removeArr[i], 1);
                }
            }
        },
        //行移动
        rowMove(type,row,index){
            var row = this.innerData[index];
            var placerow;
            if (type == "down") {
                if (index == this.innerData.length - 1) {
                    this.$Message.warning("最后一行不能下移！");
                    return;
                }
                placerow = this.innerData[index + 1];
            }
            else if (type == "up") {
                if (index == 0) {
                    this.$Message.warning("第一行不能上移！");
                    return;
            }
                placerow = this.innerData[index - 1];
            }
            var o = PDP.dll("PDPControl:PDPControl.TableEditControl.UpdateIndex", [this.table, JSON.stringify(row), JSON.stringify(placerow)]);
            if (!o.check("", true))
                return;
            this.$set(this.innerData, index, JSON.parse(o.value[0][1]));
            this.$set(this.innerData, type == "down" ? index + 1 : index - 1, JSON.parse(o.value[0][0]));
            this.refreshPageData();
        },
        //表格翻页
        changePage(page){
            this.jumpPage(page);
        },
        //点击操作列
        clickActionColHandler(row){
            if(this.clickActionCol){
                this.clickActionCol(row);
            }
        },
        //点击列类型为href的列单元格
        cellClick(row,index){
            if(this.tblCellClick){
                this.tblCellClick(row,index);
            }
        },
        onFilterChange(filterData){
            this.innerData = filterData;
            this.refreshPageData();
        },
    },
    created: function () {
        if(this.manualInit){
            return;
        }
        this.initCtrl();               
    },
    watch:{
        condition(){
            this.initCtrl();   
        } 
    },
    template: `
		<div class='collapse-table-box-wrapper' v-if="showCtrl">
			<div :class="ctrlTitle?'collapse-table-box-header':'collapse-table-box-header1'">
				<div class='collapse-table-box-title' v-if="ctrlTitle">
					<Icon :type="collapseIconType" @click='collapse' />	
                    <Modal
                        class="collapse-table-box-modal"
                        v-model="editTitleSeen"
                        title="编辑标题"
                        :width = '300'
                        @on-ok="editTitle(1)">
					    <i-input v-if="editTitleSeen" @on-change="changeTitle" :value="ctrlTitle" :autofocus='true'></i-input>
                    </Modal>				
					<span @dblclick='editTitle'>{{ctrlTitle}}</span>
                    <img v-if='allowDel' alt='删除' @click='removeCtrl' src="/i/PDPImg/delete.png" style='cursor: pointer;' class='ml20' width='17px' />
				</div>
				<div class='f' style='gap: 10px'>
					<slot name='header-extra'></slot>
                    <div v-if="add1row">
                        <span>新增</span>
                        <input-number :min="1" :readonly='onlyOneRow' v-model='addManyRow' style='width:60px;'></input-number>
                        <span>{{manyRowText}}</span>
                    </div>
					<i-button v-if="addRowBtn" @click.stop="add1Row">添加</i-button>
				</div>
			</div>

            <Modal
                class="collapse-table-box-modal"
                v-model="modalSeen"
                :title="modalTitle"
                :width="modalWidth"
                @on-ok = formSubmit
                @on-cancel = formCancelAddRow
            >
                <iform ref="iform1" :data-source="formDataSource"></iform>
            </Modal>
			
			<div v-show='contentSeen' class='collapse-table-box-content'>
				<collapse-table v-if="dataLoaded" ref='ctable' 
                    :columns="tableColumns" :editCol='tblEditCol' :data="tData" 
                    :tAllData = tableData
                    :tHeight="tableHeight" :tBorder="tableBorder" 
                    :tDataLen="tableData.length" :tPageSize="tablePageSize" 
                    :tCurrPage="tblCurrPage"  
                    :editToForm="editToForm"               					
					:editIndexArr='editIndexArr' :add-row='addRow' 
                    :pageSeen="pageSeen" :moveBtnShow = "moveBtnShow" 
                    :saveBtnSeen = 'saveBtnSeen'                    
                    :removeBtnShow = "removeBtnShow" :removeLink = "removeLink"
                    :pageDecisionEdit = 'pageDecisionEdit' :pageSelSelect = 'pageSelSelect'
                    :pageEditSelData='pageEditSelData'
                    :pageRowSelectionChange = 'pageRowSelectionChange'
                    :pageInitSoi = 'pageInitSoi'
                    :originalAllData = 'originalInnerData'
                    @new-row-save='newRowSave'  @row-remove="rowRemove"
                    @form-row-edit = "formRowEdit" @row-edit='rowToEditState'
                    @edit-save='rowEditSave' @edit-cancel='rowEditCancel'	
                    @row-move="rowMove"
                    @change-page="changePage"
                    @click-action-col="clickActionColHandler"
                    @cell-click="cellClick"
                    @on-filter-change = 'onFilterChange'
                >
                    <template v-slot:else-btn='{row,index}'> 
                        <slot name=table-else-btn :row='row' :index='index'></slot>
                    </template>
				</collapse-table>
			</div>
		</div>
	`
})