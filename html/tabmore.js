Ysh.Vue.addTemplate("ysh_tabmore_template","<div class=\"wh100\"><div><tabmore :datasource=\"testData\"></tabmore></div><div><input type=\"button\" value=\"增加测试\" @click=\"button5_onclick\" /><input type=\"button\" value=\"减少测试\" @click=\"button6_onclick\" /></div></div>");
if (!Vue.component('ysh_tabmore')) { 
Vue.component('ysh_tabmore', { 
props:{'m':{'default':''}}
	,data:function() { return { 'testData':'','count':0 } }
	, methods: { button5_onclick:function() {this.testAdd()},button6_onclick:function() {this.testReduce()} }
	,computed: {  jump:function() { return this.m; } }
	,created:function () {  this.testData = [

          ]
          this.testAdd = function(){
   
            let value = "测试" +  this.count
            let label = "测试测试测试测试测试" +this.count
            this.count++
            this.testData.push([value,label])
          },
          this.testReduce = function(){
            this.testData.pop();
          } }
	, template:'#ysh_tabmore_template' });Vue.set(Ysh.Refs.loads,"tabmore",true); }