Ysh.Vue.addTemplate("ysh_empty_template","<div class=\"wh100\"></div>");
if (!Vue.component('ysh_empty')) { 
Vue.component('ysh_empty', { 
props:{'m':{'default':''}}
	,data:function() { return { '':'' } }
	,computed: {  jump:function() { return this.m; } }
	, template:'#ysh_empty_template' });Vue.set(Ysh.Refs.loads,"empty",true); }