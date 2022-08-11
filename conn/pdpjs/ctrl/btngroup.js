let option = {
    props:{
        datasource: {/**数据源,对象数组类型，每个对象里需配置“text”属性作为按钮显示的文字 */
            type: Array,
        },
        defaultsel:{/**默认选中按钮索引值 */
            type: [String, Number],
            default:0,
        },
        column:{
            type: Boolean,
            default: false,
        },
        gap:{
            type: Number,
            default: 10,
        },
        imgpost:{
            type: Boolean,
            default: false,
        },
        triggerdefaultselclick:{/**触发默认选中按钮点击事件 */
            type: Boolean,
            default: false,
        }
    },
    data(){
        return {
            check: [],
        }
    },
    computed:{
    },
    methods:{
        /**
         * 设置按钮组某个项目选中
         * @param {Number} index item的索引值 
         */
        setItemSelect(index){
            for(let i = 0;i<this.check.length;i++){
                this.$set(this.check,i,"");
            }
            this.$set(this.check,index,"btn-select");
        },
        /**
         * 该方法会触发父级绑定的click事件，并抛出一个item作为参数
         * @param {Object} item 按钮组项目
         * @param {Number} index item的索引值 
         */
        btnClick(item,index){
            this.setItemSelect(index);
            this.$emit("click",item);
        },        
    },
    created(){
        for(let i = 0;i<this.datasource.length;i++){
            this.check.push("");
        }
        if(Number(this.defaultsel)>-1){
            if(this.triggerdefaultselclick){
            this.btnClick(this.datasource[this.defaultsel],this.defaultsel);
            }else{
                this.setItemSelect(this.defaultsel);
            }
        }
    },
    template:`
        <div class="btn-group-wrapper" :style="{'gap':gap+'px'}" :class="{'f dc':column}">
            <button v-for="(item,index) in datasource" 
                :key = "index"
                :disabled= 'item.disabled'
                type="button" 
                :class="{[check[index]]:true,'img-post':imgpost}" 
                class="btn-default" 
                @click="btnClick(item,index)"
            >
                <slot :name="index"></slot>
                {{item.text}}
            </button>
        </div>
    `
}
console.log(option)
Vue.component("btngroup",option)

