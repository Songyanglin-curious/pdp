/*v=1.21.609.1*/
Vue.component("contextmenuitem",{
    props:{
        datasource:{
            type: Array,
        },
        level: {
            type: Number
        }
    },
    methods:{
        itemHover(args,dis){
            if(dis){return}
            this.$emit('item-hover',args)
        },
        itemClick(item,dis){            
            if(dis){return}
            this.$emit('item-click',item)
        }
    },
    created(){
        // console.log(this.datasource)
    },
    template:`
        <ul>
            <li v-for="(item,index) in datasource" :key="index"
             :class="{'disabled-item': item.disabled}"
             @mouseenter="itemHover([level,item.id,$event],item.disabled)"
             @click="itemClick(item,item.disabled)"
            >{{item.text}}</li>
        </ul>
    `
}) 