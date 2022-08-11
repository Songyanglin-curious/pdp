Ysh.Vue.addTemplate("ysh_test_template","<div class=\"wh100\"><collapse-table-box modal-width=\"500\" table-height=\"466\" ref=\"ctbox1\" title=\"母线间隔\" table=\"dbstation\" sel-group-col-key=\"jointid\" :allow-del=\"true\" :table-border=\"true\" :add2row=\"true\" :sel-dis-cols=\"['volid1','jkdeptid']\" :remove-cols=\"['volid1','jointname','staname']\" :remove-link=\"false\" :edit-to-form=\"false\" :page-remove-row=\"this.pageRemoveRow\" :after-remove-row=\"this.AfterRemoveRow\" :edit-save-else=\"this.editSaveElse\" :page-edit-save=\"this.pageEditSave\" :add-save-else=\"this.addSaveElse\" :page-add-save=\"this.pageAddSave\" :page-add1-row=\"this.pageAdd1Row\" :page-add2-row=\"this.pageAdd2Row\" :click-action-col=\"this.clickActionCol\" :after-remove-ctrl=\"this.afterRemoveCtrl\" :page-edit-title=\"this.pageEditTitle\" :filter-sel-col-data=\"this.filterSelColData\" :page-row-move=\"this.pageRowMove\" :row-default-data=\"this.rowDefaultData\" :tbl-cell-click=\"this.tblCellClick\"><template v-slot:table-else-btn=\"elseBtnSlotProps\"><input type=\"button\" value=\"我是自定义得按钮\" @click=\"button3_onclick(elseBtnSlotProps)\" /><Checkbox @on-change=\"Checkbox4_on_change\"><span>测试</span></Checkbox></template></collapse-table-box></div>");
if (!Vue.component('ysh_test')) { 
Vue.component('ysh_test', { 
props:{'m':{'default':''}}
	,data:function() { return { 'pageRemoveRow':'','AfterRemoveRow':'','editSaveElse':'','pageEditSave':'','addSaveElse':'','pageAddSave':'','pageAdd1Row':'','pageAdd2Row':'','clickActionCol':'','afterRemoveCtrl':'','pageEditTitle':'','filterSelColData':'','pageRowMove':'','rowDefaultData':'','tblCellClick':'' } }
	, methods: { button3_onclick:function(elseBtnSlotProps) {this.test(elseBtnSlotProps)},Checkbox4_on_change:function(val) {this.clickActionCheckbox(val)} }
	,computed: {  jump:function() { return this.m; } }
	,created:function () {  let vm = this;

            this.tblCellClick = function(row,index){
              console.log(row,index)
            }

            this.rowDefaultData = {isfocus: '1'}

            this.pageRowMove = function(type,row,index,innerData){
              console.log(type,row,index,innerData)
              return innerData;
            }

            
            this.filterSelColData = function(innerColumns){
              console.log(innerColumns)
              return innerColumns;
            }


            this.pageEditTitle=function(newTitle){
              console.log(newTitle)
            }

            this.test=function(a){
              console.log(a)
            }

            this.afterRemoveCtrl = function(val){
              console.log(val)
            }

            this.clickActionCheckbox = function(val){
              console.log(val)
            }

            this.clickActionCol = function(row){
              console.log(row)
            }

						this.pageRemoveRow = function(row,index){
              return true;
							console.log(row,index)
						}

            this.AfterRemoveRow = function(){
              console.log('AfterRemoveRow')
            }

            this.editSaveElse = function(row,index){
							console.log(row,index)
              return row;
						}

            this.pageEditSave = function(row,index){
							console.log(row,index)
						}

            this.addSaveElse = function(row,index){
							console.log(row,index)
              return row;
						}

						this.pageAddSave = function(row,index){
							console.log(row,index)
						}

						this.pageAdd1Row = function(ctrl){
							console.log(ctrl)
						}

						this.pageAdd2Row = function(ctrl){
							console.log(ctrl)
						} }
	, template:'#ysh_test_template' });Vue.set(Ysh.Refs.loads,"test",true); }