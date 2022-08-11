/*v=1.20.627.1*/
Vue.component('guddialog', {
    data: function () {
        return {
            show: false,
            icon: "/i/sgc/quit.png",
            name: "对话框",
            css: "dlg",
            file: "",
            args: [],
            hackReset: true,
            width: "",
            height: ""
        };
    },
    computed: {
        cssObject: function () {
            /*
            var w = this.splitSize(this.width,[800,"px"]);
            var h = this.splitSize(this.height,[600,"px"]);
            return {
                width: w[0] + w[1],
                height: h[0] + h[1],
                left: "calc(50% - " + (w[0] / 2) + w[1]+")",
                top: "calc(50% - " + (h[0] / 2) + h[1] + ")",
                //"margin-left": "-" + (w[0] / 2) + w[1],
                //"margin-top": "-" + (h[0] / 2) + h[1],
                //"border-radius": "5px 5px",
                "border": "solid 3px #1fa49b",
                "border-top": "0"
            }
            */
            var w = this.splitSize(this.width, ["800", "px"]);
            var h = this.splitSize(this.height, ["600", "px"]);
            var css = {
                "border": "solid 3px #1fa49b",
                "border-top": "0"
            }
            if (w[0] && w[1]) {
                css.width = w[0] + w[1];
                css.left = "calc(50% - " + (w[0] / 2) + w[1] + ")";
            }
            if (h[0] && h[1]) {
                css.height = h[0] + h[1];
                css.top = "calc(50% - " + (h[0] / 2) + h[1] + ")";
            }
            return css;
        }
    },
    methods: {
        splitSize: function (v, def) {
            if (!v) return def;
            var n = parseFloat(v);
            if (isNaN(n)) return def
            var s = n.toString();
            return [n, v.substr(s.length, v.length - s.length)];
        }, refresh: function (file) {
            this.hackReset = false;
            this.file = file;
            this.show = true;
            var o = this;
            this.$nextTick(function () { o.hackReset = true; });

        }, resetSize: function () {
            if (this.width && this.height)
                return;
            var jq = $(this.$el);
            if (!this.width)
                this.width = jq.width() + "px";
            if (!this.height)
                this.height = jq.height() + "px";
        }, close: function () {
            this.show = false;
        }
    },
    created: function () {
    },
    mounted: function () {
        this.resetSize();
    },
    updated: function () {
        this.resetSize();
    },
    template: '<div v-show="show" style="position:absolute;z-index:9999; background-color:#ffffff" v-movable="1" :style="cssObject">'
        + '<div style="height:44px;background-color:#1fa49b;line-height:41px;color:white">'
        + '<img :src="icon" style="padding-left:10px" />{{ name }}<img src="/i/sgc/close.png" style="cursor:pointer;float:right;padding:12px 10px 0 0" @click="close" />'
        + '</div><div :class="css" style="overflow-y:auto;height:calc(100% - 44px);width:100%"><dynfile :file="file" :args="args" :hackReset="hackReset" v-if="hackReset&&show"></dynfile></div></div>'
});