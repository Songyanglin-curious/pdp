/*v=1.20.820.1*/
Vue.component('dynfile', {
    data: function () {
        return { /*isReady: false,*/ html: "", files: Ysh.Refs.loads, bLoading: false, forceReset: true, loaded: false };
    },
    props: {
        "file": String, "args": Object, "hackReset": { "default": true }, "version": { "default": "" }, "hide": { "default": false }
    },
    computed: {
        ctrlName: function () { if (!this.isReady) return ""; if (!this.file) return ""; return "ysh_" + this.file; },
        isReady: function () {
            if (!this.files)
                return false;
            return this.files[this.file];
        }
    },
    methods: {
        includeRefs: function (refs) {
            Ysh.Refs.include(refs);
        },
        show: function () {
            if (this.bLoading)
                return;
            if (!this.file)
                return;
            if (this.isReady) {
                this.loaded = true;
                return;
            }
            this.bLoading = true;
            var o = this;
            Ysh.Refs.include("../html/" + this.file + "_ref.js?v=" + this.version, function () {
                var refs = Ysh.Refs["df_" + o.file];
                if (!refs) {
                    refs = [];
                }
                refs.push("../html/" + o.file + ".js?v=" + o.version);
                o.includeRefs(refs);
                o.bLoading = false;
                o.loaded = true;
            });
        },
        invoke: function (m, args) {
            if (this.$children.length == 0) return;
            var p = this.$children[0];
            if (!p) return;
            var f = p[m];
            if (!f) return;
            f.apply(p, args);
        }
    },
    created: function () { //有可能有问题，如果子文件里需要用到dom对象就会失败，但是mounted会导致控件内容里的props函数传递出问题
        if (!this.version)
            this.version = (new Date()).getTime();
        this.show();
    },
    mounted: function () {
        if (this.$el && this.$el.children && this.$el.children.length > 0)
            this.$emit("load");
        if (this.hide)
            this.$el.style.display = "none";
    },
    updated: function () {
        if (this.$el && this.$el.children && this.$el.children.length > 0)
            this.$emit("load");
    },
    watch: {
        file: function () {
            this.show();
        }, args: function () {
            //this.show();
            this.forceReset = false;
            this.$nextTick(function () {
                this.forceReset = true;
            });
        }
    }, template: '<component v-bind:is="ctrlName" v-bind="args" v-show="isReady&&(!hide)" v-if="hackReset&&forceReset&&loaded"></component>'
});