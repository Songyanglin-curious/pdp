Ysh.Vue.addTemplate("ysh_testDownload_template","<div class=\"wh100\"><input type=\"button\" id=\"btn_Test\" value=\"Test\" /><div id=\"myDiv1\"></div></div>");
if (!Vue.component('ysh_testDownload')) { 
Vue.component('ysh_testDownload', { 
props:{'m':{'default':''}}
	,data:function() { return { '':'' } }
	,computed: {  jump:function() { return this.m; } }
	,mounted:function () {  let testAshx = "/conn/ashx/Test.ashx";

$(function () {
    $("#btn_Test").click(function () {
        $.ajax({
            type: "post",
            url: testAshx,
            cache: false,
            data: { "TestAction": "getBaiduUrl" },
            success: function (data) {
                console.log(data)
            },
            error: function (data, status, e) {
                alert(e);
                console.log(data)
                console.log(status)
                console.log(e)
                return false;
            }
        });
    });
}); }
	, template:'#ysh_testDownload_template' });Vue.set(Ysh.Refs.loads,"testDownload",true); }