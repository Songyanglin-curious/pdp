Ysh.Vue.addTemplate("ysh_exportWeather_template","<div class=\"wh100\"><div><div><span>天气数据导出</span></div><div><span>时	间:</span><div><date-picker format=\"yyyy-MM-dd\" type=\"daterange\" style=\"width:150px\" v-model=\"idate8\"></date-picker></div></div><div><span></span><div><i-select v-model=\"iselect12\"><i-option v-for=\"option in iselect12options\" :value='option[0]' :key='option[0]'>{{ option[1] }}</i-option></i-select></div></div><div><span></span><div><i-select v-model=\"iselect16\"><i-option v-for=\"option in iselect16options\" :value='option[0]' :key='option[0]'>{{ option[1] }}</i-option></i-select></div></div><div><input type=\"button\" value=\"导出\" class=\"default-button\" @click=\"button18_onclick\" /></div></div></div>");
if (!Vue.component('ysh_exportWeather')) { 
Vue.component('ysh_exportWeather', { 
props:{'m':{'default':''}}
	,data:function() { return { 'dateDay':'','dsDataType':[['0','网络数据'],['1','站点数据']],'dataType':'','dsScheduleUnit':[['0','陕西调度']],'scheduleUnit':'' } }
	, methods: { button18_onclick:function() {this.exportWeather()} }
	,computed: {  jump:function() { return this.m; },dsDataType_0:function () { return Ysh.Array.to1d(this.dsDataType, 0); },dsDataType_1:function () { return Ysh.Array.to1d(this.dsDataType, 1); },dsScheduleUnit_0:function () { return Ysh.Array.to1d(this.dsScheduleUnit, 0); },dsScheduleUnit_1:function () { return Ysh.Array.to1d(this.dsScheduleUnit, 1); },idate8:Ysh.Vue.m("dateDay"),iselect12:Ysh.Vue.m("dataType"),iselect12options:function() { return this.dsDataType },iselect16:Ysh.Vue.m("scheduleUnit"),iselect16options:function() { return this.dsScheduleUnit } }
	,created:function () {  let testAshx = "/conn/ashx/ExportWeather.ashx";
this.exportWeather = function () {
    console.log("导出天气")
    $.ajax({
        type: "post",
        url: testAshx,
        datatype: "text",
        data: { "TestAction": "getBaiduUrl" },
        success: function (result) {
            console.log(result)
        },
        error: function (data, status, e) {
            console.log(data)
            console.log(status)
            console.log(e)
            return false;
        }
    });
} }
	, template:'#ysh_exportWeather_template' });Vue.set(Ysh.Refs.loads,"exportWeather",true); }