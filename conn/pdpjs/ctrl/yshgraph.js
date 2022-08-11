//添加一次接线图画相关各种图（联络图、供电路径、用户集等）的组件
Vue.component("ysh-graph", {
	props: ["url", "cmdobject"],
	computed: {
			graphurl: function () { return this.url + "&app=graph_draw&id=0"; }
	},
	methods: {
			postMsg: function (msgObject) {
					if (msgObject && msgObject["command"])
							this.$refs.frmGraph.contentWindow.postMessage(msgObject, "*");
			}
	},
	watch: {
			cmdobject: {
					handler: function () {
							this.postMsg(this.cmdobject);
					},
					deep: true
			}
	},
	created: function () {
			var pdpgraph = this;
			window.addEventListener("message", function (event) {
					if (!event || !event.data)
							return false;

					if (event.data.app === "graph_draw" && event.data.eventType === "graphicOpened") {
							pdpgraph.postMsg(pdpgraph.cmdobject);
					}
			});
	},
	template: "<iframe style='border: 0px; width: 100%; height: 100%; background-color: black' :src='graphurl' ref='frmGraph'></iframe>"
});