Ysh.Vue.addTemplate("ysh_login_template","<div style=\"height:100%;width:100%\"></div>");
if (!Vue.component('ysh_login')) { 
Vue.component('ysh_login', { 
props:{'m':{'default':''},'l':{'default':''}}
	,data:function() { return { 'url':{ ref:'config',value:'LoginUrl' } } }
	,computed: {  jump:function() { return this.m; },user:function() { return this.l; } }
	,mounted:function () {  this.doJump = function(url) {
    var m = this.jump;
    if (this.user == "") {
        //window.location.href = url + "/index.jsp?m=" + m;
        var site = window.location.href;
        site = site.substring(0,site.indexOf("?"));
        if (url.endsWith("html"))
        window.location.href = url + "?from=" + site+"&m=" + m;
        else
        window.location.href = url + "/index.jsp?from=" + site+"&m=" + m;
    }
    else {
        $.ajax({
            url: "/Search/GetDeptID",
            dataType: "json",
            type: "post",
            data: {
                strUser: this.user
            },
            success: function (data) {
                if (data != "")
                    window.location.href = "/" + data + (data == "" ? "?s=1" : "&s=1");
                else {
                    m = unescape(m);
                    window.location.href = "/" + m + (m == "" ? "?s=1" : "&s=1");
                }
            },
            error: function (data) {
                console.log(data.responseText);
            }
        });
    }
          }
          var vm = this;
          PDP.dll("FreeGridLib:FreeGrid.ConfigHelper.GetConfig",["LoginUrl"],function(data) {
          if (!data.check("获取跳转地址",true)) return;
          vm.doJump(data.value[0]);
          }); }
	, template:'#ysh_login_template' });Vue.set(Ysh.Refs.loads,"login",true); }