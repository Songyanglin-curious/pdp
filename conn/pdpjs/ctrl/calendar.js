Vue.component("calendar",{
    props:{
        width:{
            type: String,
            default: "100%"
        },
        height:{
            type: String,
            default: "100%"
        },
        infoDate:{
            type: Array,
        }
    },
    data(){
        return {
            currYear: new Date().getFullYear(),
            currMonth: new Date().getMonth() + 1,
            today: new Date().getDate(),
            week: ['日','一','二','三','四','五','六'],
            daysWidth: 0,        
        }
    },
    computed:{
        getCurrMonthDays(){/**获取当前月一共多少天 */
            return new Date(this.currYear,this.currMonth,0).getDate();
        },
        getCurrMonthFirstdayWeek(){/**获取当前月第一天周几 */
            return this.getDay(this.currYear,this.currMonth,1);
        },
        getCurrMonthLastDay(){/**获取当前月的最后一天的日期 */
            return new Date(this.currYear,this.currMonth,0).getDate();
        }
    },
    methods:{
        getDayNum(y,m,d){/**获取传入日期的getDay（）值 */
            return new Date(`${m}/${d}/${y}`).getDay();
        },
        getDay(y,m,d){/**传入参数年，月，日，获取传入日期周几 */
            return this.week[new Date(`${m}/${d}/${y}`).getDay()];
        },
        get2dArr(){/**获取当前月的二维数组 */
            let arr=[],childArr = [];
            for(let i = 1;i<this.getCurrMonthDays+1;i++){
                if(this.getDay(this.currYear,this.currMonth,i) === "日"){
                    arr.push(childArr);
                    childArr = [];
                    childArr.push(i);
                }else{
                    childArr.push(i);
                }
                if(i === this.getCurrMonthDays){
                    arr.push(childArr);
                }
            }
            return arr;
        },
        getDaysWeekStyle(i){/**获取日期行样式 */
            if(i === 0)
            return {'padding-left' : this.getDayNum(this.currYear,this.currMonth,1) *  this.daysWidth+'px'};
            if(i === this.get2dArr().length-1)
            return {'padding-right' : (6 - this.getDayNum(this.currYear,this.currMonth,this.getCurrMonthLastDay)) *  this.daysWidth+'px'};
        },
        getCurrYearMonth(){/**获取日历显示的当前年月 */
            console.log(`${this.currYear}/${this.currMonth}`)
            return `${this.currYear}/${this.currMonth}`
        },
        prevYear(){
            this.currYear--;
            this.getCurrYearMonth();
        },
        prevMonth(){
            if(this.currMonth === 1)
            this.currMonth = 13;
            this.currMonth--;
            this.getCurrYearMonth();
        },
        nextMonth(){
            if(this.currMonth === 12)
            this.currMonth = 0;
            this.currMonth++;
            this.getCurrYearMonth();
        },
        nextYear(){
            this.currYear++;
            this.getCurrYearMonth();
        },
        infoDay(y,m,d){
            let infodays;
            this.infoDate.map((item)=>{
                if(d<10&&m<10){
                    if(item === `${y}/0${m}/0${d}`){
                        infodays = "infoday"
                    }
                }else if(d<10&&m>10){
                    if(item === `${y}/${m}/0${d}`){
                        infodays = "infoday"
                    }
                }else if(d>10&&m<10){
                    if(item === `${y}/0${m}/${d}`){
                        infodays = "infoday"
                    }
                }else {
                    if(item === `${y}/${m}/${d}`){
                        infodays = "infoday"
                    }
                }                
            })
            return infodays;
        }
    },
    created(){
        console.log(this.infoDate)
    },
    mounted(){
        this.daysWidth = this.$refs.week.children[0].offsetWidth;
    },
    template: `
        <div class="cal-wrapper" :style="{width,height}">
            <div class="header">
                <Icon type="md-rewind" @click="prevYear" />
                <Icon type="md-arrow-dropleft" @click="prevMonth" />
                <span>
                    <span>{{currMonth+"月"}}</span>
                    <span>{{currYear}}</span>
                </span>
                <Icon type="md-arrow-dropright" @click="nextMonth" />
                <Icon type="md-fastforward" @click="nextYear" />
            </div>
            <div class="week" ref="week">
                <span v-for="(item,i) in week">{{item}}</span>
            </div>
            <div class="days" ref="days">
                <div class="days-week" :style="getDaysWeekStyle(index)" :ref="'daysWeek'+index" v-for="(item,index) in get2dArr()">
                    <span :class="infoDay(currYear,currMonth,item1)" @click="$emit('click-day',currYear,currMonth,item1)" v-for="(item1,index1) in item">{{item1}}</span>
                </div>
            </div>
        </div>
    `
})