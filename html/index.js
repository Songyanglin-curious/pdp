Ysh.Vue.addTemplate("ysh_index_template","<div class=\"wh100 f dc index-wrapper\"><div class=\"index-title\"><div class=\"logo\"><span>预付费云管理平台</span><span>Prepaid cloud management platform</span></div><div class=\"loginInfo\"><Poptip trigger=\"hover\" placement=\"bottom\"><img src=\"/i/frmMain_files/username.png\" /><div class=\"optk-main-header-avatar-popup\" slot=\"content\"><div @click=\"div10_onclick\" v-if=\"false\"><icon type=\"ios-contact-outline\"></icon><span>个人中心</span></div><div @click=\"div13_onclick\"><icon type=\"ios-log-out\"></icon><span>退出登录</span></div></div></Poptip><span>{{ pureValue('当前登录:' + userName) }}</span></div></div><div class=\"f f1cs\"><ysh-ele-menu ref=\"menu1\" class=\"menu1\" :raw-data=\"rawData\" @menu-open=\"menu1_menu_open\" @menu-close=\"menu1_menu_close\" @menu-select=\"menu1_menu_select\"></ysh-ele-menu><iframe class=\"f1\" :frameborder=\"0\" :src=\"pageSrc\"></iframe></div></div>");
if (!Vue.component('ysh_index')) { 
Vue.component('ysh_index', { 
props:{'m':{'default':''}}
	,data:function() { return { '':'','rawData':'','menu1mode':'','pageSrc':'','userName':'' } }
	, methods: { div10_onclick:function() {this.personalCenterClick()},div13_onclick:function() {this.logout()},menu1_menu_open:function(index) {this.menuOpen(index)},menu1_menu_close:function(index) {this.menuClose(index)},menu1_menu_select:function(url) {this.menuSelect(url)} }
	,computed: {  jump:function() { return this.m; } }
	,created:function () {  this.menu1mode = "horizontal"

            this.menuOpen = function(index){
              console.log(index)
            }

            this.menuClose = function(index){
              console.log(index)
            }

            this.menuSelect = function(url){
              console.log(url)
            }
            
            var o = PDP.dll('FreeGridCode:YshWebUI.LoadMenu', []);
            if(o.check('获取菜单', true)){
              this.rawData = o.value[0];
              //字段顺序：[MODULEID,MODULENAME,MODULETYPE,MODULEPRIV,MODULEARG,PMODULEID,MODULEIDX,IMG,IMGHOVER,IMGSELECT]
              //ID,item的text,level,权限,url,PID,顺序,img,悬浮img,选中img
            }

            this.rawData = o.value[0];
            //数据库取出来的数据结构不对，先用假数据写死
            this.rawData = [
              [1, "线损情况", "1", 1,'SubMenu', '{"popper-class":"adc"}'],
              [3, "线损情况2", "1-1-1", 1,'MenuItem','{"disabled": true}'],
              [2, "线损情况1", "1-2", -2,'SubMenu',"{}"],
              [4, "线损情况3", "1-1", 1,'MenuItem','{}'],
              [5, "线损情况4", "2", 0,'SubMenu','{"icon":"el-icon-school"}'],
              [6, "线损情况5", "2-1", 1,'MenuItem','{"disabled": true}'],
              [7, "线损情况6", "3", -1,'MenuItem','{"icon":"/i/loading.gif","url":"http://www.yongshangtech.com/index.html"}'],
            ]
            

            this.logout = function(){
              $.ajax({
                  url: "/conn/ashx/LoginHandler.ashx",
                  dataType: "json",
                  type: "post",
                  data: { postType: "logout" },
                  success: function (data, s, r) {
                      if (data.code == "500") {
                          alert(data.msg)
                          return;
                      }
                      Ysh.Cookie.set("ysh_jwt", "", new Date(), "/");
                      window.location.href = "/";
                  },
                  error: function (data) {
                      console.log(data.responseText);
                  }
              });
            } }
	,mounted:function () {  window.getUserInfo = function(){
              var jwtInfo = Ysh.Cookie.get("ysh_jwt")
              if(jwtInfo == null)
                return null;
              return JSON.parse(Base64.decode(jwtInfo.split(".")[1]));
            }
            window.getUserName = function(){
              return window.getUserInfo().UserName;
            }
            
            this.userName = getUserName(); }
	, template:'#ysh_index_template' });Vue.set(Ysh.Refs.loads,"index",true); }