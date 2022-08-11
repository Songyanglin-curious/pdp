/**2021/04/06 
 * by mike
 * 通用js
 */

//JS Core
//Array相关方法
const YshArr = {
    /**
     * 数组去重
     * @param {Array} arr 准备去重的数组
     * @returns 去重之后的数组
     */
    deDuplicate(arr){
        if(!(arr instanceof Array)){
            return false;
        }
        if(Tools.type(arr[0])==='Array'){

        }else if(Tools.type(arr[0])==='Object'){
            
        }else{
            return [...new Set(arr)];
        }
    }
}

//Object相关方法
const YshObj = {
    /**
     * 获取自身属性值数组
     * @param {Object} obj 要获取属性值数组的对象
     * @returns 一个数组，数组元素为传入对象的key，顺序按照属性在对象中的位置
     */
    values(obj){
        if(!(obj instanceof Object)){
            return false;
        }
        let arr = [];
        for(let i of Object.keys(obj)){
            arr.push(obj[i]);
        }    
        return arr;    
    }
}

//工具函数
const Tools = {
    //延时函数（ms毫秒后调用fn）
    delay(fn,ms){
        return function(...args){
            let _this = this
            setTimeout(function(){
              fn.apply(_this,args)
            },ms)
        }
    },
    //防抖函数（触发高频事件后n秒内函数只会执行一次，如果n秒内高频事件再次被触发，则重新计算时间）
    debounce(fn,ms){
        let  hh;
        return function(...args){
            if(hh){
                clearTimeout(hh)
            } 
            hh = setTimeout(function(){
                fn.call(this,...args);
            }.bind(this),ms) 
        }   
    },
    //节流函数（高频事件触发，但在n秒内只会执行一次，节流会稀释函数的执行频率）
    throttle(fn,ms){
        let  hh,currArgs=[];
        return function(){
            currArgs = arguments
            if(hh){
                return false;
            }else{
                fn.call(this,...currArgs);  
                hh = setTimeout(function(){
                    hh = null;
                    fn.apply(this,currArgs);
                }.bind(this),ms)    
            } 
        }             
    },
    /**
     * 获取当前时间
     * @returns hh:mm:ss
     */
    currentTime(){ 
        let now = new Date();

        let time= now.toTimeString();
        time = time.slice(0,8);
        return time;
    },
    /**
     * 获取当前日期
     * @param {String} separator 指定的分隔符（如果没有指定默认分隔符为‘/’）
     * @returns yyyy/mm/dd
     */
    currentDate(separator){ 
        let now = new Date();

        let date= now.toLocaleDateString();
        if(separator){
            date = date.replace(/\//g,separator);
        }
        return date;
    },
    /**
     * 获取当前星期几
     * @returns 星期几
     */
    currentDay(){
        let now = new Date();

        let day = now.getDay();
        const obj = {
            0: '星期日',
            1: '星期一',
            2: '星期二',
            3: '星期三',
            4: '星期四',
            5: '星期五',
            6: '星期六',
        }
        return obj[day];
    },
    /**
     * 返回任意数据的数据类型
     * @param {any} arg 要判断类型的数据
     * @returns 数据的类型
     */
    type(arg){
        return Object.prototype.toString.call(arg).slice(8,-1);
    },
    // canvas 实现 watermark
    __canvasWM({
        // 使用 ES6 的函数默认值方式设置参数的默认取值
        // 具体参见 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Default_parameters
        container = document.body,
        width = '150px',
        height = '150px',
        textAlign = 'center',
        textBaseline = 'middle',
        font = "20px microsoft yahei",
        fillStyle = 'rgba(184, 184, 184, 0.1)',
        content = '用尚科技',
        rotate = '-30',
        zIndex = 1000
      } = {}) {
        var args = arguments[0];
        var canvas = document.createElement('canvas');
  
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        var ctx = canvas.getContext("2d");
  
        ctx.textAlign = textAlign;
        ctx.textBaseline = textBaseline;
        ctx.font = font;
        ctx.fillStyle = fillStyle;
        ctx.rotate(Math.PI / 180 * rotate);
        ctx.fillText(content, parseFloat(width) / 2, parseFloat(height) / 2);
  
        var base64Url = canvas.toDataURL();
        const watermarkDiv = document.createElement("div");
        watermarkDiv.setAttribute('style', `
          position:absolute;
          top:0;
          left:0;
          width:100%;
          height:100%;
          z-index:${zIndex};
          pointer-events:none;
          background-repeat:repeat;
          background-image:url('${base64Url}')`);
  
        container.style.position = 'relative';
        container.insertBefore(watermarkDiv, container.firstChild);
  
        
    },
    //把数据库查出来的二维数组数据转成Select组件可用的数据结构
    getSelectData(arr2d,labelKey="label",valueKey="value"){
        if(Tools.type(arr2d)!=="Array"||arr2d.length == 0){
            return  false;
        }
        let resArr = [],obj={};
        for(let item of arr2d){
            obj[valueKey] = item[0];
            obj[labelKey] = item[1];
            resArr.push(obj);
            obj = {};
        }
        return resArr;
    },
    //获取异步函数结果，调用该方法后接.then来使用
    //e.g. getAsyncFnResult(fn).then(val=>xxxxxx) val就是拿到的异步函数结果。
    getAsyncFnResult(fn) {
        async function test() {
          let promise = new Promise((res,rej)=>{
            fn(res,rej);      
          })
          let result = await promise;
          return result;
        }
        return test();
    },
}

//浏览器相关
//Dom相关
const tDocEl = top.document.documentElement;
const tDocElHeight = tDocEl.clientHeight;
const tDocElWidth = tDocEl.clientWidth;
const docEl = document.documentElement;
const docElHeight = docEl.clientHeight;
const docElWidth = docEl.clientWidth;

const YshDom = {
    /**
     * 获取某个元素上的某个css属性值
     * @param {Dom} el 要操作的dom元素
     * @param {String} attrName css属性名
     * @returns 获取的css属性值
     */
    getElStyle(el,attrName){
        return getComputedStyle(el).getPropertyValue(attrName).trim();
    },
    /**
     * 自定义页面右键菜单
     * @param {String} refVal 组件ref值，必需
     * @param {dom | String} customTarget 自定义的要绑定右键菜单的元素的JQ对象或组件ref，不传默认当前页面
     * @param {Number} eventX 指定菜单显示位置X坐标
     * @param {Number} eventY 指定菜单显示位置Y坐标
     * @param {Function} fn 显示菜单之前会触发，可在该回调内修改菜单显示的数据源
     */
    customContextmenu(refVal,customTarget = document,eventX,eventY,fn){ 
        let vuecomp = pdp.$refs[refVal]; 
        const bindEventHandler = function(target){
            let targetItem;
            target = Array.from(target);
            target.forEach((item)=>{                
                if(item instanceof Node||
                    item instanceof Vue)
                {
                    if(item instanceof Node){
                        targetItem = item;
                    }
                    if(item instanceof Vue){
                        targetItem = item.$el;
                    }
                    targetItem.addEventListener("contextmenu", function(e){
                        contextmenuHandler(item,e);
                    });
                    document.addEventListener("click", function(e){//不管给谁绑右键，在当前的document上点左键就取消右键菜单的显示
                        contextmenuHide();
                    });
                }else{
                    return
                }                
            })
        }
        const contextmenuHandler = function(target,e){    
            let eve = event;
            eve.preventDefault();
            eve.stopPropagation();
            vuecomp.rightClickEvent = eve;
            vuecomp.userBindEventTarget = target;
            if(fn){
                fn(target,eve);
            }
            vuecomp.firstNavTop = eventY?eventY:eve.clientY+docEl.scrollTop;      
            vuecomp.firstNavLeft = eventX?eventX:eve.clientX+docEl.scrollLeft;  
            vuecomp.firstNavSeen = true;
            if(vuecomp.rawsource.length<=0){
                return;
            }
            vuecomp.initAllData(); 
            Vue.nextTick(()=>{
                    let compElChildHeight = vuecomp.$el.children[0].clientHeight;
                    let compElChildWidth = vuecomp.$el.children[0].clientWidth;
                    if(eve.clientY + compElChildHeight > docElHeight||eve.clientX + compElChildWidth > docElWidth){
                        if(eve.clientY + compElChildHeight > docElHeight){
                            vuecomp.firstNavTop = eve.clientY + docEl.scrollTop - compElChildHeight;
                            vuecomp.firstNavTop = vuecomp.firstNavTop < 0?0:vuecomp.firstNavTop;
                            vuecomp.initAllData(); 
                        }
                        if(eve.clientX + compElChildWidth > docElWidth){
                            vuecomp.firstNavLeft = eve.clientX + docEl.scrollLeft - compElChildWidth;
                            vuecomp.firstNavLeft = vuecomp.firstNavLeft < 0?0:vuecomp.firstNavLeft;
                            vuecomp.initAllData(); 
                        }
                    }else{
                        return;
                    }
            })
        }
        const contextmenuHide = function(){
            vuecomp.hideAllNav(); 
        }
        if(typeof customTarget == "object"){
            bindEventHandler(customTarget);
        }else if(typeof customTarget == "string"&&pdp.$refs[customTarget]&&pdp.$refs[customTarget].$options._componentTag=="i-table"){
            bindEventHandler(pdp.$refs[customTarget].$children[1].$children);
        }else if(typeof customTarget == "string"&&pdp.$refs[customTarget]&&pdp.$refs[customTarget].$options._componentTag=="scrolltable"){
            bindEventHandler(pdp.$refs[customTarget].$children[0].$children[1].$children);
        }else{
            try {
                throw new Error('请检查customTarget的值，customTarget应为对象或"itable"的ref值');
            } catch (e) {
                console.log(e.stack);
            }            
        }
    },
    /**
     * 手动调用右键菜单显示
     * @param {String} refVal 组件ref值，必需
     * @param {Number} pageX 指定菜单显示位置X坐标
     * @param {Number} pageY 指定菜单显示位置Y坐标
     */
    oBindClick: {},
    ctrlContextmenu(refVal,pageX=0,pageY=0){
        let vuecomp = pdp.$refs[refVal]; 
        vuecomp.firstNavTop = pageY;      
        vuecomp.firstNavLeft = pageX;  
        vuecomp.firstNavSeen = true;
        vuecomp.initAllData(); 
        Vue.nextTick(()=>{
                let compElChildHeight = vuecomp.$el.children[0].clientHeight;
                let compElChildWidth = vuecomp.$el.children[0].clientWidth;
                if(pageY + compElChildHeight > docElHeight||pageX + compElChildWidth > docElWidth){
                    if(pageY + compElChildHeight > docElHeight){
                        vuecomp.firstNavTop = pageY - compElChildHeight;
                        vuecomp.firstNavTop = vuecomp.firstNavTop < 0?0:vuecomp.firstNavTop;
                        vuecomp.initAllData(); 
                    }
                    if(pageX + compElChildWidth > docElWidth){
                        vuecomp.firstNavLeft = pageX - compElChildWidth;
                        vuecomp.firstNavLeft = vuecomp.firstNavLeft < 0?0:vuecomp.firstNavLeft;
                        vuecomp.initAllData(); 
                    }
                }else{
                    return;
                }
        })
        if (!this.oBindClick[refVal]) {
            document.addEventListener("click", function (e) {
                vuecomp.hideAllNav();
            });
            this.oBindClick[refVal] = true;
        }
    }
}

//Vue相关
//Vue通用相关
const YshVue = {
    /**
     * 初始化数组里每个元素的值。
     * @param {Array} arr 进行操作的数组
     * @param {任意类型} initVal 每个数组元素要初始化的值
     */
    initArr(arr,initVal){
        for(let i =0;i<arr.length;i++){
            Vue.set(arr,i,initVal);
        }
    },
    /**
     * 初始化数组里每个元素的值,并设置其中一个为特定值。
     * @param {Array} arr 进行操作的数组
     * @param {任意类型} initVal 每个数组元素要初始化的值
     * @param {Number} index 要设置特殊值的元素索引
     * @param {任意类型} setVal 要设置的特殊值
     */
    initArrSetItem(arr,initVal,index,setVal){
        for(let i =0;i<arr.length;i++){
            Vue.set(arr,i,initVal);
        }
        Vue.set(arr,index,setVal);
    }
}

//Vue组件相关
//customnav
const CustomNav={
    getData(rawData){//根据数据库中的数据生成menuData
        let menuData=[],nav1=[],nav2=[];
        function compare(property){
            return function(a,b){
                let value1 = a[property];
                let value2 = b[property];
                return value1 - value2;
            }
        }
        for(let i=0;i<rawData.length;i++){
            if(rawData[i][2] == 1){
                nav1.push(rawData[i]);
            }else if(rawData[i][2] == 2){
                nav2.push(rawData[i]);
            }
        }
        for(let i =0;i<nav1.length;i++){
            // if(!nav1[i][3]){
            //     menuData.push({})
            //     continue;
            // }
            menuData.push(
                {
                "id": nav1[i][0],
                "title":nav1[i][1],
                "titleImg":nav1[i][7],
                "titleHoverImg":nav1[i][8],
                "titleSelImg":nav1[i][9],
                "titleNum":nav1[i][10],
                "url": nav1[i][4]
                }
            )
        }
        for(let i =0;i<nav2.length;i++){
            let pid = nav2[i][5];            
            for(let j=0,l=menuData.length;j<l;j++){
                if(menuData[j]["id"] === pid){
                    if(!menuData[j]["subData"]){
                        menuData[j]["subData"]=[];                        
                    }
                    menuData[j]["subData"].push({
                        "text":nav2[i][1],
                        "textImg":nav2[i][7],
                        "textHoverImg":nav2[i][8],
                        "textSelImg":nav2[i][9],
                        "textNum":nav2[i][10],
                        "url": nav2[i][4],
                        "order": nav2[i][6]
                    })                    
                }
            }
        }
        menuData.forEach((item)=>{
            if(item.subData){
                item.subData.sort(compare('order'));
            }
        })
        return menuData;
    }
}

//ysh-ele-menu
const YshEleMenu = {
    /**
     * 获取组件所需数据源
     * @param {2d} rawData 数据库里查出来的原始二维数组数据
     * @returns 组件所需结构的数据
     */
    getData(rawData){
        let menuData=null;
        let nav1 = [],nav2=[],nav3=[];
        for(let item of rawData){
          if(item[2].length === 1){
            nav1.push({
              index:item[2],
              title: item[1],
              order: item[3],
              nodeType: item[4],
              elseAttrs: JSON.parse(item[5]),
            })
          }else if(item[2].length === 3){
            nav2.push({
              index:item[2],
              pindex: item[2].slice(0,-2),
              title: item[1],
              order: item[3],
              nodeType: item[4],
              elseAttrs: JSON.parse(item[5]),
            })
          }else if(item[2].length === 5){
            nav3.push({
              index:item[2],
              pindex: item[2].slice(0,-2),
              title: item[1],
              order: item[3],
              nodeType: item[4],
              elseAttrs: JSON.parse(item[5]),
            })
          }               
        }

        function compare(prop){
          return function(a,b){
            let val1 = a[prop];
            let val2 = b[prop];

            return val1 - val2
          }
        }
        nav1.sort(compare('order'));
        nav2.sort(compare('order'));
        nav3.sort(compare('order'));
        
        function composeSubData(nav,pnav){
          for(let item of nav){
            for(let item1 of pnav){
              if(item.pindex === item1.index){
                if(!item1.subData){
                  item1.subData = [];
                }
                item1.subData.push(item);
              }
            }
          }
        }
        
        composeSubData(nav3,nav2);
        composeSubData(nav2,nav1);

        menuData = nav1;

        return menuData;
    },
    /**
     * 获取Menu实例
     * @param {*} ref 组件ref值
     * @returns Menu的Vue实例
     */
    getMenu(ref){
        return pdp.$refs[ref].$children[0];
    },
}

//iview原生Tree组件
const IviewTree = {
    /**
     * 
     * @param {2d} arr
     * @returns 
     */
    getData(arr) {
        let arr1=[],res=[];
        arr.forEach((item)=>{
            arr1.push({
                'id': item[0],
                'title': item[1],
                'pid': item[2],
                'expand': item[3]||false,
                'disabled': item[4]||false,
                'disableCheckbox': item[5]||false,
                'selected': item[6]||false,
                'checked': item[7]||false,
                'render': item[8],
                'contextmenu': item[9]||false,
            })
        })
    
        function findParent(arr,item) {
            if(item.pid){
                let parent =  arr.find((item1)=>{
                   return item1.id == item.pid
                })
                if(parent.children){
                    parent.children.push(item)
                }else{
                    parent.children = []
                    parent.children.push(item)            
                }
            }
        }
    
        arr1.forEach((item)=>{
            findParent(arr1,item)
        })
    
        res = arr1.filter(item=>{
            return !item.pid
        })
        
        return res;
    }
    
}

//iview原生Modal组件
const IviewModal = {
    /**
     * 
     * @param {*} refVal Modal组件绑定的ref名
     * @param {*} fullscreenVar Modal组件绑定的fullscreen的变量名
     * @param {*} fn Modal框变化之后相关内容响应式变化逻辑代码的回调
     * @param {*} type 
     * @returns 
     */
    toChange(refVal,fullscreenVar,fn,type){
        let modal = pdp.$refs[refVal];
        if(!modal){
            console.error('该ref值对应的组件不存在，请检查传入的第一个参数是否为正确的Modal组件的ref值。');
            return false;
        }
        if(type === 'fullscreen'){
            pdp[fullscreenVar] = true;
        }else if(type === 'reduction'){
            pdp[fullscreenVar] = false;
        }
        let modalWidth = modal.$el.children[1].offsetWidth;
        let modalHeight = modal.$el.children[1].offsetHeight;
        if(fn){
            return fn(modalWidth,modalHeight);
        }
    },    
    toFullscreen({ref,fullVal,toBigFn}){
        this.toChange(ref,fullVal,toBigFn,'fullscreen')
    },
    toReduction({ref,fullVal,toSmallFn}){
        this.toChange(ref,fullVal,toSmallFn,'reduction')
    },
}












