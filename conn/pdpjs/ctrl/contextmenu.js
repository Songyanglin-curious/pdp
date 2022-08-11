/*v=1.21.609.1*/
//使用时配合YshDom.customContextmenu方法，具体参见示例文件。
Vue.component("contextmenu",{
    props:{
        datasource:{
            type: Array,
        }
    },
    data(){
        return {
            dataLevel: [],
            groupMenu: [],
            pids: [],
            firstNavSeen: false,
            firstNavTop:0,
            firstNavLeft:0,
            rightClickEvent: null,
            userBindEventTarget: null,            
        }
    },
    methods:{ 
        clearAllData(){
            this.dataLevel=[];
            this.groupMenu=[];
            this.pids=[];
        },
        initLevelData(ds,arrIndex,loopIndex,level,seen,top,left){//初始化分级数据
            let dl = this.dataLevel;
            if(!dl[arrIndex]){dl[arrIndex] = {};dl[arrIndex]["data"]=[]}
            dl[arrIndex]["data"].push(ds[loopIndex]);
            dl[arrIndex]["level"]= level;
            dl[arrIndex]["seen"]= seen;
            dl[arrIndex]["top"]= top;
            dl[arrIndex]["left"]= left;
        },       
        determineLevel(ds){//数据分级     
            let dl = this.dataLevel;
            for(let i=0;i<ds.length;i++){
                if(ds[i]["pid"] === ""){
                    this.initLevelData(ds,0,i,1,this.firstNavSeen,this.firstNavTop,this.firstNavLeft);
                    continue;
                }
                if(ds[ds[i]["pid"]]["pid"] === ""){
                    this.initLevelData(ds,1,i,2,false,"100px",0);
                    continue;
                }
                if(ds[ds[ds[i]["pid"]]["pid"]]["pid"] === ""){
                    this.initLevelData(ds,2,i,3,false,"200px",0);
                    continue;
                }
                if(ds[ds[ds[ds[i]["pid"]]["pid"]]["pid"]]["pid"] === ""){
                    this.initLevelData(ds,3,i,4,false,"300px",0);
                    continue;
                }
            }
            return dl;
        },
        determineGroup(dl){//数据分组,pid相同的分在一组
            let arr =[];
            dl["data"].forEach((item)=>{
                if(!arr[item["pid"]]){arr[item["pid"]]=[];}
                arr[item["pid"]].push(item)
            })
            arr.forEach((item,index)=>{
                arr[index] = {"data": item,"level": dl.level,"seen": dl.seen,"top": dl.top,"left": dl.left}
            })
            return arr;            
        },
        initAllData(){//组件初始化，根据数据重新渲染。
            if(this.rawsource.length<=0){
                this.hideAllNav();
                this.clearAllData();
                return;
            }
            this.clearAllData();
            this.rawsource.forEach((item)=>{
                this.pids.push(item["pid"]);
            })
            this.dataLevel = this.determineLevel(this.rawsource);
            this.groupMenu.push(this.dataLevel[0])
            for(let i = 1;i<this.dataLevel.length;i++){
                this.determineGroup(this.dataLevel[i]).forEach((item)=>{
                    this.groupMenu.push(item);
                })
            }
        },
        hideAllNav(){
            let gm = this.groupMenu;
            gm.forEach(item=>{
                item.seen = false;
            })           
        },
        itemHover(args){
            let [level,id,ev] = [...args],gm = this.groupMenu;
            gm.forEach((item)=>{
                if(item.level === level+1&&item["data"][0]["pid"]===id){
                    item["top"] = ev.target.parentElement.offsetTop +ev.target.offsetTop;
                    item["left"] = ev.target.parentElement.offsetLeft + ev.target.offsetWidth;
                    item["seen"] = true;
                }else if(item.level === level+1&&item["data"][0]["pid"]!==id){
                    item["seen"] = false;
                }else if(item.level > level+1){
                    item["seen"] = false;
                }
            })
        },
        itemClick(item){
            if(this.pids.includes(item.id)){
                console.log("not-allowed");
                return "not-allowed";
            }
            this.$emit("click",item,this.userBindEventTarget,this.rightClickEvent);
            this.hideAllNav();
        }
    },
    created(){
        this.rawsource = [...this.datasource];               
    },
    watch:{
        datasource: {
            handler: function (val, oldVal) {
                 this.rawsource = [...val];
                 this.initAllData();
            },
            deep: true
        },
    },
    template:`
        <div class="cm-wrapper">
            <contextmenuitem v-for="(item,index) in groupMenu" :key="index" 
                v-show="item.seen" :datasource="item.data" :level="item.level"
                @item-hover = itemHover($event) 
                @item-click = itemClick($event)
                class="cm-list" :style="{top: item.top+'px',left: item.left+'px'}"
            >
            </contextmenuitem>
        </div>
    `
})