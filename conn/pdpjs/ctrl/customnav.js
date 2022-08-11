Vue.component("customnav",{
	props:{
		datasource:{
			type: Array,
		},
		classname:{
			type: String,
		},
		selitem:{
			type: [String],
		},
		keeponegroup:{
			type: Boolean,
			default: false,
		},
		allGroupOpen:{
			type: [Number,Boolean]
		},
		allGroupClose:{
			type: [Number,Boolean]
		},
	},
	data:function(){
		return {
			selTitleArr: [],//选中的一级导航成员
			selItemArr:[],//选中的二级导航成员
			groupShow: [],//一级导航是否打开
			groupArrowArr:[],//一级导航的箭头是什么状态
			nav1CurrImg:[],//一级导航的配图
			nav2CurrImg:[],//二级导航的配图
			titleCurrImg:"",//一级导航当前配图
			itemCurrImg:"",//二级导航当前配图
		}
	},
	computed:{
		
	},
	methods:{
		//工具函数
		initSelTitleArr(){//初始化selTitleArr属性（selTitleArr数组成员全部置空）
			YshVue.initArr(this.selTitleArr,"");
		},
		initSelItemArr(){//初始化selItemArr数组（如果存在，selItemArr数组成员全部置空）
			for(let i = 0;i<this.selItemArr.length;i++){
				if(this.selItemArr[i]){
					YshVue.initArr(this.selItemArr[i],"");
				}
			}
		},
		initGroupShow(){//初始化groupShow属性（groupShow数组成员全部置false）
			YshVue.initArr(this.groupShow,false);
		},
		initGroupArrowArr(){//初始化groupArrowArr属性（groupArrowArr数组成员全部置"md-arrow-dropup"）
			YshVue.initArr(this.groupArrowArr,"md-arrow-dropup");
		},
		initNav1CurrImg(){//初始化nav1CurrImg属性（nav1CurrImg数组成员全部置成datasource中的titleImg）
			for(let i = 0;i<this.nav1CurrImg.length;i++){
				this.$set(this.nav1CurrImg,i,this.datasource[i].titleImg)
			}
		},
		initNav2CurrImg(){//初始化nav2CurrImg属性（如果存在，nav2CurrImg数组成员全部置成datasource中的subData中的textImg）
			for(let i = 0;i<this.datasource.length;i++){
				if(this.datasource[i].subData){
					let itemNum = this.datasource[i].subData.length;
					for(let j = 0;j<itemNum;j++){
						this.$set(this.nav2CurrImg[i],j,this.datasource[i].subData[j].textImg);
					}
				}
			}
		},		

		//事件触发的相关方法				
		titleClick(groupNum){//一级导航点击事件触发
			if(!this.selItemArr[groupNum]){
				this.initSelTitleArr();
				this.$set(this.selTitleArr,groupNum,true);
				this.initNav1CurrImg();
				this.$set(this.nav1CurrImg,groupNum,this.datasource[groupNum].titleSelImg);	
				this.titleCurrImg = this.nav1CurrImg[groupNum];				
				if(this.keeponegroup){
					this.initGroupShow();
					this.initGroupArrowArr();
				}
				this.initSelItemArr();
				this.initNav2CurrImg();
				this.$emit("item-click",this.datasource[groupNum]);
			}else{				
				if(this.groupShow[groupNum]){
					this.$set(this.groupShow,groupNum,false);
					this.$set(this.groupArrowArr,groupNum,"md-arrow-dropup");
				}else{					
					if(this.keeponegroup){
						this.initGroupShow();
						this.initGroupArrowArr();
					}
					this.$set(this.groupShow,groupNum,true);
					this.$set(this.groupArrowArr,groupNum,"md-arrow-dropdown");
				}
			}		
		},
		itemClick(groupNum,itemNum){/**更新二维数组时vue的坑，下面这样调用$set,不调用$forceUpdate的话页面没变化 */
			this.initSelItemArr();
			this.$set(this.selItemArr[groupNum],itemNum,true);
			this.initSelTitleArr();
			this.$set(this.selTitleArr,groupNum,true);	
			this.initNav1CurrImg();
			this.$set(this.nav1CurrImg,groupNum,this.datasource[groupNum].titleSelImg);
			this.initNav2CurrImg();
			this.$set(this.nav2CurrImg[groupNum],itemNum,this.datasource[groupNum]["subData"][itemNum].textSelImg);
			this.itemCurrImg = this.nav2CurrImg[groupNum][itemNum];
			this.$forceUpdate();
			this.$emit("item-click",this.datasource[groupNum],this.datasource[groupNum]["subData"][itemNum]);
		},
		titleMouseEnter(groupNum){
			this.titleCurrImg = this.nav1CurrImg[groupNum];
			this.$set(this.nav1CurrImg,groupNum,this.datasource[groupNum].titleHoverImg);
		},
		titleMouseLeave(groupNum){
			this.$set(this.nav1CurrImg,groupNum,this.titleCurrImg);			
		},
		itemMouseEnter(groupNum,itemNum){
			this.itemCurrImg = this.nav2CurrImg[groupNum][itemNum];
			this.$set(this.nav2CurrImg[groupNum],itemNum,this.datasource[groupNum]["subData"][itemNum].textHoverImg);
			this.$forceUpdate();
		},
		itemMouseLeave(groupNum,itemNum){
			this.$set(this.nav2CurrImg[groupNum],itemNum,this.itemCurrImg);
			this.$forceUpdate();
		},

		//组件created相关操作
		generateDataContent(){//根据传入的datasource生成相关数据的初始值（selTitleArr、selItemArr、groupShow、groupArrowArr、nav1CurrImg、nav2CurrImg）
			let groupNum = this.datasource.length;
			for(let i = 0;i<groupNum;i++){
				this.selTitleArr.push('');
				this.nav1CurrImg.push(this.datasource[i].titleImg);
				if(this.datasource[i].subData){
					this.groupShow[i] = false;
					this.groupArrowArr[i] = "md-arrow-dropup";
					let itemNum = this.datasource[i].subData.length;
					this.selItemArr[i] = [];
					this.nav2CurrImg[i] = [];
					for(let j = 0;j<itemNum;j++){
						this.selItemArr[i].push("");
						this.nav2CurrImg[i].push(this.datasource[i].subData[j].textImg)
					}
				}			
			}
		},
		selItemHandler(){//根据selitem计算[g,i]，用于传给setSelItem
			let cn = this,cnds = this.datasource;
			let selItem = String(cn.selitem);		
			let selItemArr = selItem.split("");
			if(selItemArr.length===2||selItemArr.length<1||selItemArr.length>3){
				return [null,null];
			}else if(selItemArr.length===1){
				if(!Number(selItem)||Number(selItem)<1||Number(selItem)>cnds.length||cnds[selItemArr[0]-1].subData){
					return [null,null];
				}else{
					return [selItem-1,null];
				}
			}else if(selItemArr.length===3){
				if(!Number(selItemArr[0])||!Number(selItemArr[2])
					||Number(selItemArr[0])<1||Number(selItemArr[0])>cnds.length					
					||cnds[selItemArr[0]-1].subData?
					Number(selItemArr[2])<1
					||Number(selItemArr[2])>cnds[selItemArr[0]-1].subData.length:
					true
				){
					return [null,null];
				}else{
					return [selItemArr[0]-1,selItemArr[2]-1];
				}
			}
		},
		setSelItem(g,i){//设置选中项
			if(g===null){
				return;
			}
			if(i===null){
				this.$set(this.selTitleArr,g,true);
				this.$set(this.nav1CurrImg,g,this.datasource[g].titleSelImg);
				return;
			}
			this.$set(this.selTitleArr,g,true);
			this.$set(this.nav1CurrImg,g,this.datasource[g].titleSelImg);
			this.$set(this.groupShow,g,true);
			this.$set(this.groupArrowArr,g,"md-arrow-dropdown");
			this.$set(this.selItemArr[g],i,true);
			this.$set(this.nav2CurrImg[g],i,this.datasource[g].subData[i].textSelImg);
			this.$forceUpdate();
		},
		openAllGroup(){//打开所有组
			for(let i = 0,l=this.groupShow.length;i<l;i++){
				if(this.groupShow[i]==false){
					this.$set(this.groupShow,i,true);
					this.$set(this.groupArrowArr,i,"md-arrow-dropdown");
				}
			}
		},
		closeAllGroup(){//关闭所有组
			for(let i = 0,l=this.groupShow.length;i<l;i++){
				if(this.groupShow[i]==true){
					this.$set(this.groupShow,i,false);
					this.$set(this.groupArrowArr,i,"md-arrow-dropup");
				}
			}
		},
	},
	created(){
		this.generateDataContent();//先生成相关数据初始值用于template使用
		if(this.selitem){//如果传了selitem
			let [g,i] = this.selItemHandler();
			this.setSelItem(g,i);
		}		
		if(this.allGroupOpen){//如果传了allGroupOpen，则一上来就打开所有一级导航
			this.openAllGroup();
		}
		if(this.allGroupClose){//如果传了allGroupClose，则一上来就关闭所有一级导航
			this.closeAllGroup();
		}		
	},
	watch:{
		selitem:function (n,o) {
			if(n !== o){
				this.initSelItemArr();
				this.initSelTitleArr();
				let [g,i] = this.selItemHandler();
				this.setSelItem(g,i);
			}
		}
	},
    template:`
		<div class="f">
			<ul :class="[classname]">
				<li v-for="(item,index) in datasource">
					<span v-if="item.title" :class="['menu-title',{'select-title': selTitleArr[index]}]" 
					@click="titleClick(index)"
					@mouseenter="titleMouseEnter(index)"
					@mouseleave="titleMouseLeave(index)"
					>
						<img v-if="item.titleImg" :src="nav1CurrImg[index]"/>
						{{item.title}}<span class="item-badge">{{item.titleNum}}</span>
						<Icon v-if="item.subData" :type="groupArrowArr[index]" />
					</span>
					<ul v-if="item.subData" v-show="groupShow[index]" class="sub-menu">
						<li v-if="item1.text" v-for="(item1,index1) in item.subData" 
						:class="{'select-item': selItemArr[index][index1]}" 
						@click="itemClick(index,index1)"
						@mouseenter="itemMouseEnter(index,index1)"
						@mouseleave="itemMouseLeave(index,index1)"
						>
							<img v-if="item1.textImg" :src="nav2CurrImg[index][index1]"/>
							{{item1.text}}<span class="item-badge">{{item1.textNum}}</span>
						</li>
					</ul>
				</li>
			</ul>
		</div>
    `
}) 