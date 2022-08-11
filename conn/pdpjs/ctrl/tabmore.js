/*
 * @Author: songyanglin 1503464667@qq.com
 * @Date: 2022-08-08 14:22:57
 * @LastEditors: songyanglin 1503464667@qq.com
 * @LastEditTime: 2022-08-11 17:23:33
 * @FilePath: \新建地理信息导航\conn\pdpjs\ctrl\tabmore.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

Vue.component('tabmore', {
    props: {
        "datasource": {
            type: Array,
            default: () => []
        },
    },
    data() {
        return {
            // 当前循环的数据
            currentData:[],
            // 各个元素的长度
            widthArr: [],
            // widthWrap 容器的宽度
            widthWrap: 0,
            //更多按钮
            moreButton: false,
            //更多按钮的尺寸
            moreButtonWidth:0,
            //
            widthAll:0,
            //
            index:0,
            //选中的数据
            selData:"",

            showMoreButton:false,
        }
    },
    /**
     * 核心为，判断元素宽度，将元素个数修剪到合适的个数显示，并且根据条件显示隐藏更多
     * 
     * 
     */
    methods: {
        click(v) {
            console.log("点击", v)
            this.$emit('input', v);
            this.$emit('click');
        },
        //
        initWidth() {
            this.widthArr = []
            this.widthWrap = this.$el.offsetWidth
            
            let moreButton = this.$el.children[this.$el.children.length-1];
            this.moreButtonWidth = moreButton.offsetWidth
            let childrens = this.$el.children;
            this.widthAll = 0;
            let toLeft = 0
            for (let i = 0; i < childrens.length-1; i++) {
                let widthObj = {}
                widthObj.index = i;
                widthObj.width = childrens[i].offsetWidth
                toLeft +=childrens[i].offsetWidth;
                widthObj.rightToLeft = toLeft;
                this.widthArr.push(widthObj)
                this.widthAll += childrens[i].offsetWidth
            }
        },
        trimData() {
            // 重新计算宽度，直到找到需要显示的前几个
            // let childNum = this.widthArr.length - 1;
            // let showNum = 0;
            // for (childNum; childNum >= 0; childNum--) {
            //     let sumWidth = 0;
            //     for (let i = 0; i <= childNum; i++) {
            //         sumWidth += this.widthArr[i].width
            //     }
            //     if (sceenWidth - sumWidth - 80 > 0) {
            //         showNum = childNum;
            //         break;
            //     }
            // }
            for(let i=this.widthArr.length-1;i>=0;i--){
                console.log(i)
                if(this.widthArr[i].rightToLeft+this.moreButtonWidth<this.widthWrap){
                    this.index = i;
                    break;
                }
            }
            // for(let i = 0;i<this.widthArr.length;i++){
            //     if(i == this.widthArr.length-1){
            //         this.index = i
            //         break
            //     }
            //     if(this.widthArr[i].rightToLeft+this.moreButtonWidth<this.widthWrap && this.widthArr[i+1].rightToLeft+this.moreButtonWidth > this.widthWrap){
            //         this.index =i
            //         break
            //     }
            // }
             
            this.currentData = this.datasource.slice(0, this.index)
        },
        showTab:function(v,o){
            //获取容器宽度，tab总宽度，记录每个tab宽度到widthArr
            this.initWidth()
            //过长
            if(this.widthAll  >this.widthWrap ){
                //tab长度过长，需要修剪显示数据
                this.showMoreButton = true
                this.trimData()
            }else{
                this.showMoreButton = false
            }
            // else{
            //     // this.showMoreButton = false
            //     this.currentData = this.datasource
            //     this.initWidth();
            //     this.$nextTick(function () {
            //         if(this.widthAll  <this.widthWrap){
            //             this.showMoreButton = true
            //         }
            //     })
            // }
            //过短
    
        }
    },
    computed:{
        // showMoreButton(){
        //     if(this.widthAll  >this.widthWrap){
        //         return true
        //     }else{
        //         return false;
        //     }
        // }
    },

    watch: {

        datasource(v,o) {
            this.currentData = this.datasource;
                this.$nextTick(function () {
                    this.showTab();
                })
        },
        // widthAll(v,o) {
        //         this.$nextTick(function () {
        //             this.showTab(v,o);
        //         })
        // }
    },

    // created: function () {
    //     this.currentData = this.datasource;
       

    // },
    mounted: function () {
        this.showTab();
        // this.initWidth();
        // this.showTab();
    },

    template: `
    <div class="tabmore-wrap" ref="wrap">
        <div  v-for="(item, index) in currentData" :key="item[0]" class=".table-item-wrap">
            <div  @click="click(item[0])" class="tabmore-item">{{item[1]}}</div>
        </div>
        <div class=".table-item-wrap">
            <Poptip >
                <div class="btnMore tabmore-item" v-if="showMoreButton">更多</div>
                <div  slot="content">
                    <Select v-model="selData" style="width:200px">
                        <Option v-for="item in datasource" :value="item[0]" :key="item[0]">{{ item[1] }}</Option>
                    </Select>
                </div>
             </Poptip>
        </div>
    </div>
    `,
})