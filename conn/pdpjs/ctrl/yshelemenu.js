Vue.component('ysh-ele-menu',{
	props: {
		rawData:{//数据库查出来的二维数组
			type: Array
		},		
		mode:{
			type: String,
			default: 'vertical'
		},
		collapse:{
			type: Boolean,
			default: false,
		},
		defaultActive:{
			type: String,
		},
		defaultOpeneds:{
			type: Array,
		},
		uniqueOpened:{
			type: Boolean,
			default: false,
		},
		menuTrigger:{
			type: String,
			default: 'hover',
		},
		router:{
			type: Boolean,
			default: false,
		},
		collapseTransition:{
			type: Boolean,
			default: true,
		},
	},
	computed:{
		data(){//根据rawData转成的对象数组
			return YshEleMenu.getData(this.rawData);
		},
	},
	methods:{
		menuSelect(index,indexPath){
			let _vm = this;
			let elseAttrs=null, url=null;
			for(let item of _vm.rawData){
				if(item[2] === index){
					elseAttrs = JSON.parse(item[5]);
					url = elseAttrs.url;
				}
			}
			this.$emit("menu-select",url);
		},
		menuOpen(index){
			this.$emit("menu-open",index)
		},
		menuClose(index){
			this.$emit("menu-close",index)
		},		
	},
	template:`
		<el-menu 
			:mode="mode"
			:collapse="collapse"
			:defaultActive="defaultActive"
			:defaultOpeneds="defaultOpeneds"
			:uniqueOpened="uniqueOpened"
			:menuTrigger="menuTrigger"
			:router="router"
			:collapseTransition="collapseTransition"
			@select = "menuSelect"
			@open = "menuOpen"
			@close = "menuClose"
		>
			<template v-for="(item,index) in data">
				<el-submenu v-if="item.subData" 
										:index="item.index" 
										:popper-class="item.elseAttrs['popper-class']"
										:show-timeout="item.elseAttrs['show-timeout'] || 300"
										:hide-timeout="item.elseAttrs['hide-timeout'] || 300"
										:disabled="item.elseAttrs['disabled'] || false"
										:popper-append-to-body="item.elseAttrs['popper-append-to-body']===undefined ? true : item.elseAttrs['popper-append-to-body']"
				>
					<template slot="title">
						<template v-if="item.elseAttrs['icon']">
							<div v-if="item.elseAttrs['icon'].includes('/i/')" class='el-icon-custom-img-icon'>
								<img :src="item.elseAttrs['icon']" />
							</div>
							<i v-else-if="item.elseAttrs['icon'].includes('ivu-icon-')" :class="item.elseAttrs['icon']+' ivu-icon'"></i>
							<i v-else :class="item.elseAttrs['icon']"></i>
						</template>	
						<span>{{item.title}}</span>
					</template>	
					<template v-for="(item1,index1) in item.subData">
						<el-submenu v-if="item1.subData" 
												:index="item1.index" 
												:popper-class="item1.elseAttrs['popper-class']"
												:show-timeout="item1.elseAttrs['show-timeout'] || 300"
												:hide-timeout="item1.elseAttrs['hide-timeout'] || 300"
												:disabled="item1.elseAttrs['disabled'] || false"
												:popper-append-to-body="item1.elseAttrs['popper-append-to-body'] || false"
						>
							<template slot="title">
								<span>{{item1.title}}</span>
							</template>
							<template v-for="(item2,index2) in item1.subData">
								<el-submenu v-if="item2.subData" 
														:index="item2.index" 
														:popper-class="item2.elseAttrs['popper-class']"
														:show-timeout="item2.elseAttrs['show-timeout'] || 300"
														:hide-timeout="item2.elseAttrs['hide-timeout'] || 300"
														:disabled="item2.elseAttrs['disabled'] || false"
														:popper-append-to-body="item2.elseAttrs['popper-append-to-body'] || false"
								>
									<template slot="title">
										<span>{{item2.title}}</span>
									</template>								
								</el-submenu>
								<el-menu-item v-else 
															:index="item2.index"
															:route = "item2.elseAttrs['route']"
															:url = "item2.elseAttrs['url']"
															:disabled="item2.elseAttrs['disabled'] || false"
								>
									<span>{{item2.title}}</span>
								</el-menu-item>
							</template>									
						</el-submenu>
						<el-menu-item v-else 
													:index="item1.index"
													:route = "item1.elseAttrs['route']"
													:url = "item1.elseAttrs['url']"
													:disabled="item1.elseAttrs['disabled'] || false"
						>
							<span>{{item1.title}}</span>
						</el-menu-item>
					</template>								
				</el-submenu>
				<el-menu-item v-else 
											:index="item.index"
											:route = "item.elseAttrs['route']"
											:url = "item.elseAttrs['url']"
											:disabled="item.elseAttrs['disabled'] || false"
				>
					<template v-if="item.elseAttrs['icon']">
						<div v-if="item.elseAttrs['icon'].includes('/i/')" class='el-icon-custom-img-icon'>
							<img :src="item.elseAttrs['icon']" />
						</div>
						<i v-else-if="item.elseAttrs['icon'].includes('ivu-icon-')" :class="item.elseAttrs['icon']+' ivu-icon'"></i>
						<i v-else :class="item.elseAttrs['icon']"></i>
					</template>					
					<span slot="title">{{item.title}}</span>
				</el-menu-item>
			</template>			
		</el-menu>
	`
})