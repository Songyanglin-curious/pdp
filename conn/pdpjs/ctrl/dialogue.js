Vue.component("dialogue",{
    props:{
        datasource:{/*数据源  格式见示例 */
            type: Array
        },
        // selected: {/**该属性和点击事件搭配使用，实现用父级数据控制子级数据。详细见示例 */
        //     type: Boolean,
        //     default: false
        // },
        width: {/**组件宽度 不传默认100% */
            type: String,
            default: "100%"
        },
        height: {/**组件高度 不传默认100% */
            type: String,
            default: "100%"
        },
        groupCode: {
            type: String,
        },
    },
    data(){
        return {
            iconshow: false,//图标是否显示
            iconstate: [],//图标状态
            showMoreDialogue: false,
            showDataGroup:[],
            firstDataOfGroup:[],
            groupPos: [],
            groupCodePos: null,//点击的code的位置
        }
    },
    computed:{
        firstDataIndexOfGroup(){
            let arr=[];
            for(let item of this.firstDataOfGroup){
                arr.push(item.index)
            }
            return arr;
        },
        firstDataCodeOfGroup(){
            let obj={};
            for(let item of this.firstDataOfGroup){
                obj[item.index] = item.code;
            }
            return obj;
        },
        firstDataContentOfGroup(){
            let obj={};
            for(let item of this.firstDataOfGroup){
                obj[item.index] = item.groupContent;
            }
            return obj;
        },
        rawData(){
            return this.datasource;
        },
        showData(){
            let arr=[];
            for(let i = this.rawData.length-1;i>=(this.rawData.length-30>0?this.rawData.length-30:0);i--){
                arr.unshift(this.rawData[i])
            }
            return arr;
        },  
        selDialogue: {
            get(){
                return this.iconshow;
            },
            set(val){
                this.iconshow = val;
            } 
        }
    },
    created(){
        
    },
    methods:{
        getGroupData(){//获取组数据
            this.showDataGroup = this.getShowDataGroup();
            this.firstDataOfGroup = this.getFirstDataOfGroup();
        },
        getFirstDataOfGroup(){
            let arr=[],
                showData = this.showData,
                showDataGroup = this.showDataGroup;
            for1:for(let item of showDataGroup){
                for(let i=0,l = showData.length;i<l;i++){
                    if(showData[i].code === item){
                        arr.push({
                            index:i,
                            code:showData[i].code,
                            groupContent:showData[i].groupContent,
                        });
                        continue for1;
                    }
                }
            }
            return arr;
        },
        getShowDataGroup(){
            let codeArr=[];
            let sd = this.showData;
            for(let item of sd){
                if(item.code&&!codeArr.includes(item.code)){
                    codeArr.push(item.code)
                }
            }
            return codeArr;
        },
        getGroupPos(){
            let vm = this;
            vm.groupPos = [];
            this.$nextTick(function(){
                let groupSpanEls = $('.group-span');
                for(let item of groupSpanEls){
                    vm.groupPos.push({
                        pos: $(item).parent()[0].offsetTop,
                        code: item.innerText.trim(),
                    })
                }
            })            
        },
        initIconState(){/*初始化图标状态及位置 */
            let vm = this;
            vm.iconstate = [];
            if(this.selDialogue === true){
                vm.iconshow = true;
                for(let i=0;i<vm.showData.length;i++){
                    vm.iconstate.push(true)
                }
                vm.$nextTick(function(){
                    for(let i=0;i<this.$refs.text.length;i++){
                        this.$refs.iconnoselect[i].style.top = (this.$refs.text[i].clientHeight-16)/2+54+"px";
                    } 
                })
            }else{
                vm.iconshow = false;
            }
        },
        iconClick(i){/** 切换图标状态 */
            this.iconstate[i]
            ? this.$set(this.iconstate,i,false)
            : this.$set(this.iconstate,i,true); 
        },
        getWrapperScroll(){
            let diw = this.$refs["diw"];
            if(diw.scrollTop != 0||this.showData.length===this.rawData.length){
                return;
            }
            this.showMoreDialogue = true;
            return diw.scrollTop;
        },
        getDiboxPos(i){
            return this.$refs.dibox[i].offsetTop;
        },
        posDibox(i){
            let diw = this.$refs["diw"];
            diw.scrollTop = this.getDiboxPos(i)-20;
        },
        showMore(){
            let currLastNum = this.rawData.length - this.showData.length-1;
            for(let i = currLastNum;i>(currLastNum-30>-1?currLastNum-30:-1);i--){
                this.showData.unshift(this.rawData[i]);
            }
            this.$nextTick(function(){
                this.posDibox(this.showData.length - parseInt((this.showData.length - 1) / 30) * 30 - 1);
            })
            this.showMoreDialogue = false;
            this.getGroupData();
            this.getGroupPos();
        },
        delDialogue(){
            //删除对话，返回要删除的数据，去页面上操作数据源来删除。
            let delItemIndexArr = [],delItemInfoArr=[];
            for(let i=0;i<this.iconstate.length;i++){
                if(this.iconstate[i] === false){
                    delItemIndexArr.push(i);
                    delItemInfoArr.push(this.showData[i]);
                }
            }   

            //for(let i =delArr.length-1;i>-1;i--){
           // this.showData.splice(delArr[i],1);
           // }          
            this.selDialogue = false;
            return delItemInfoArr;
        },
        showSelIcon(){
            this.selDialogue === true
            ?this.selDialogue = false
            :this.selDialogue = true;
        },
        play(){
            this.$emit('play')
        },
        posGroup(pos){
            console.log(pos)
            let diw = this.$refs["diw"];
            diw.scrollTop = pos - 100;
        },
        posAllGroup(n){//在页面中用ref找组件调用
            let vm = this;
            let groupSpanEls = $('.group-span'),
            elIndex=null,
            existence = null;
            for(let i=0,l=this.rawData.length;i<l;i++){
                if(this.rawData[i]['code'] === n){
                    existence = true;
                    break;
                }
            }
            if(existence){
                for(let i = 0,l=groupSpanEls.length;i<l;i++){
                    if(groupSpanEls[i].innerText.trim()===n){
                        elIndex = i;
                    }
                }
                if(elIndex||elIndex===0){
                    let pos = vm.groupCodePos = $(groupSpanEls[elIndex]).parent()[0].offsetTop;
                    vm.posGroup(pos);
                }else{
                    this.showMore();
                    this.$nextTick(function(){
                        vm.posAllGroup(n);
                    })
                }
                
                return  elIndex;
            }else{
                console.log(n+"不存在")
            }            
        },
        codeIsSeen(){//code是否在页面中显示
            let groupCodePos = this.groupCodePos,diw = this.$refs["diw"];
            if(groupCodePos - diw.scrollTop>0&&groupCodePos - diw.scrollTop - diw.offsetHeight<0){
                return true;
            }else{
                return false;
            }
        },
    },
    created(){
        
    },
    mounted(){
        this.getGroupData();
        this.getGroupPos();
        let vm = this,diw = this.$refs["diw"];
        /*监视该属性，父级按钮切换该属性时予以响应 */
        this.$watch("selDialogue",function(n,o){
            vm.initIconState();
        }) 
        // this.$watch("rawData",function(n,o){
        //     diw.scrollTop = diw.scrollHeight;  
        // }) 
        diw.scrollTop = diw.scrollHeight; 
        // this.$watch("groupCode",function(n,o){//watch不检测相同值，在页面中用ref找组件调用
        //     this.posAllGroup(n);
        // }) 
        
        diw.onscroll = function() {
            let groupPos = vm.groupPos;
            for(let i= groupPos.length-1,l=-1;i>l;i--){
                if(diw.scrollTop + diw.offsetHeight>groupPos[i].pos){
                    vm.$emit('hover-item',groupPos[i].code);
                    break;
                }
            }
            if(vm.codeIsSeen()){
                vm.$emit('hover-item',vm.groupCode);
            }
        };
    },
    template: `
        <div class="di-wrapper" ref="diw" :style="{width,height}" @scroll="getWrapperScroll">
            <div class="di-box" ref="dibox" :class="i.speaker==='self'?'self':'other'" 
                v-for="(i,index) in showData" :key='index'                
            >
                <div class="group-span" v-if="firstDataIndexOfGroup.includes(index)">
                    <span>{{firstDataCodeOfGroup[index]}}</span>
                    <Poptip word-wrap width="150" trigger="hover" placement="bottom">
                        <img src="a" @click="play"/>   
                        <span slot="content">
                        {{firstDataContentOfGroup[index]}}
                        </span>                 
                    </Poptip>
                </div>
                <span class="time">{{i.time}}</span>
                <span>
                    <span class="person">{{i.person}}</span>
                    <span class="company"> {{i.company}}</span>
                    <Tooltip v-if="i.authentication" placement="top">                    
                        <span v-if="i.authentication" class="authentication"> {{'（'+i.authentication+'）'}}</span>
                        <div slot="content">
                            <p class='f ac'>
                                <img class='mr10' width='10px' height='12px' src='../../../i/ctrl/dialogue/name.png'/>
                                姓名：{{i.person}}
                            </p>
                            <p class='f ac'>
                                <img class='mr10' width='10px' height='13px' src='../../../i/ctrl/dialogue/company.png'/>
                                单位：{{i.company}}
                            </p>
                            <p class='f ac'>
                                <img class='mr10' style='margin-left: -3px;' width='13px' height='12px' src='../../../i/ctrl/dialogue/scores.png'/>
                                分数：{{i.scores}}
                            </p>
                        </div>
                    </Tooltip>
                    <template v-else>
                        <span>
                            <span class="authentication">（未认证）</span>
                        </span>
                    </template>
                </span>
                <span class="text" ref="text">{{i.text}}</span>
                <div ref="iconnoselect" v-if="iconshow" class="selectbox" @click="iconClick(index)">
                    <Icon v-if="iconstate[index]" type="md-radio-button-off" />
                    <Icon v-else type="ios-checkmark-circle" />
                </div>                
            </div>
            <div v-show="showMoreDialogue" class="more-info" @click="showMore">
                <span>显示更多消息</span>
            </div>
        </div>
    `
})