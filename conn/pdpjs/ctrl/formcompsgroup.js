
/**
 * 使用时把控件放入该组件子元素，配置slot属性即可，slot属性值为dataSource属性的索引。
 * 具体使用可以查看示例。
 */
Vue.component("formcompsgroup",{
    props:{
        dataSource:{/**对象数组，对象中要配置label属性，该属性为控件的label（控件前面的文字说明）。 */
            type: Array
        },
        labelclass:{
            type: String
        },
        column:{
            type: Boolean,
            default: false,
        },
        gap:{
            type: Number,
            default: 10,
        }
    },
    template:`
        <div class="form-comps-group-wrapper" :style="{'gap':gap+'px'}" :class="{'f dc':column}">
            <div class="form-comp-box" v-for="(item,index) in dataSource">
                <span :class="labelclass">{{item.label}}</span>
                <slot :name="index"></slot>
            </div>
        </div>
    `
}) 