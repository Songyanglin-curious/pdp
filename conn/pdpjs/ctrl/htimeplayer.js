
Vue.component('htimeplayer', {
    data: function () {
        return {
            state: 0, timerId: 0, display: 0, width: 0, itemWidth: 40, perWidth: 0, perStep: 1, showTime: false, start: "", drag: false, startX: 0, isDragged: false
        };
    },
    props: {
        "value": {
            "default": ""
        }, "step": {
            type: Number,
            "default": 1
        }, "type": {
            "default": "y"
        }, "min": {
            "default": ""
        }, "max": {
            "default": ""
        }, "autoplay": {
            type: Number,
            "default": 2
        }, "selectstart": {
            type: Boolean,
            "default": true
        }
    },
    computed: {
        minTime: function () { if (!this.start) return null; return new Date(Ysh.Time.parseDate(this.start)); },
        maxTime: function () { if (!this.max) return null; return new Date(Ysh.Time.parseDate(this.max)); },
        valueTime: function () { if (!this.value) return null; return new Date(Ysh.Time.parseDate(this.value)); },
        canUse: function () { if (!this.minTime) return false; if (!this.maxTime) return false; if (this.width < 1) return false; if (!this.itemWidth) return false; return true; },
        playImg: function () {
            return (this.state == 1) ? "/i/ctrl/pause.png" : "/i/ctrl/play.png";
        },
        disstyle: function () {
            switch (this.type) {
                case 'y': return "100000";
                case 'm': return "110000";
                case 'd': return "111000";
                default: return "111100";
            }
        },
        showstyle: function () {
            switch (this.type) {
                case 'y': return "100000";
                case 'm': return "010000";
                case 'd': return "001000";
                default: return "110";
            }
        },
        typename: function () {
            switch (this.type) {
                case 'y':
                    return "年份";
                case 'm':
                    return "月份";
                case 'd':
                    return "日期";
                default://h
                    return "时间";
            }
        },
        scaleList: function () {
            if (!this.canUse) {
                return [];
            }
            var maxCount = parseInt(this.width / this.itemWidth, 10);
            if (maxCount < 1)
                return [];
            var itemCount = this.getItemCount();
            if (itemCount == 0)
                return [];
            itemCount--;//前后都要显示一个时间，最多分成的份数少一
            var t = parseInt(itemCount / maxCount - 0.001, 10) + 1;
            var per = itemCount / t;
            var showCount = parseInt(per, 10);
            var w = this.width / per;
            this.perWidth = w;
            this.perStep = t;
            var ret = [];
            var format = this.showstyle;
            var tmPrev = null;
            for (var i = 0; i <= showCount; i++) {
                var tmThis = Ysh.Time.add(this.type, t * i * this.step, this.minTime);
                ret.push({ time: Ysh.Time.formatString(tmThis, format), pos: (w * i) + "px", ext: this.getExtend(tmThis, tmPrev) });
                tmPrev = tmThis;
            }
            //if (ret.length > 0)
            //    ret[0].time = this.getTypeName();
            return ret;
        },
        curPosition: function () {
            var idx = 0;
            if (this.perWidth)
                idx = Ysh.Time.diff(this.type, this.minTime, this.valueTime) / this.perStep;
            return (idx * this.perWidth - 10) + "px";
        }
    },
    methods: {
        onMouseDown: function (event) {
            this.drag = true;
            this.startX = event.offsetX;
            this.isDragged = false;
        },
        onMouseUp: function (event) {
            this.drag = false;
        },
        onMouseOut: function () {
            this.drag = false;
        },
        onMouseMove: function (event) {
            if (!this.drag)
                return;
            var offset = event.offsetX - this.startX;
            if (Math.abs(offset) > this.itemWidth) {
                this.startX = event.offsetX;
                var start = Ysh.Time.add(this.type, offset > 0 ? -1 : 1, Ysh.Time.parseDate(this.start));
                if (start >= this.maxTime)
                    return;
                this.start = Ysh.Time.toString(start);
                this.isDragged = true;
            }
        },
        changeStartTime: function (v) {
            //this.value = v;
            if (this.value < v)
                this.value = v;
            this.$emit("startchanged", v);
        },
        getTypeName: function () {
            switch (this.type) {
                case 'y':
                    return "年份";
                case 'm':
                    return "月份";
                case 'd':
                    return "日期";
                default://h
                    return "时间";
            }
        },
        getExtend: function (tm, tmPrev) {
            switch (this.type) {
                case 'y':
                    if (tmPrev == null)
                        return "";
                    return "";
                case 'm':
                    if (tmPrev != null) {
                        if (tm.getFullYear() == tmPrev.getFullYear())
                            return "";
                    }
                    return Ysh.Time.formatString(tm, "1100000").substr(2);
                case 'd':
                    if (tmPrev != null) {
                        if ((tm.getFullYear() == tmPrev.getFullYear()) && (tm.getMonth() == tmPrev.getMonth()))
                            return "";
                    }
                    return Ysh.Time.formatString(tm, "1010000");
                default://h
                    if (tmPrev != null) {
                        if (tm.getDate() == tmPrev.getDate())
                            return "";
                    }
                    return Ysh.Time.formatString(tm, "[d]日");
            }
        },
        selectTime: function () { },
        getItemCount: function () {
            if (!this.canUse) return 0;
            var diff = Ysh.Time.diff(this.type, this.minTime, this.maxTime) / this.step;
            return diff + 1;
        },
        clickPlayer: function (e) {
            if (this.isDragged) return;
            var x = e.offsetX;
            if (x < 0) return;
            if (this.state == 1)
                this.play();
            var n = parseInt(this.getItemCount() * x / this.width, 10);
            this.value = Ysh.Time.toString(Ysh.Time.add(this.type, n, this.minTime));
        },
        play: function () {
            //0 停止 1 - 播放中
            if (this.state == 1) {
                this.pause();
            } else {
                this.state = 1;
                this.doPlay(true);
            }
        },
        pause: function () {
            if (this.state == 1) {
                this.state = 0;
                window.clearTimeout(this.timerId);
            }
        },
        doPlay: function (back) {
            var v = Ysh.Time.add(this.type, this.step, this.valueTime);
            if (v > this.maxTime) {
                if (back) {
                    v = this.minTime;
                } else {
                    //超出范围，停止播放
                    this.state = 0;
                    window.clearTimeout(this.timerId);
                    return;
                }
            }
            this.$emit("input", Ysh.Time.formatString(v, "111111"));
            vm = this;
            this.timerId = window.setTimeout(function () { vm.doPlay(); }, this.autoplay * 1000);
        },
        resetStartTime: function () {
            var s = (this.start ? new Date(Ysh.Time.parseDate(this.start)) : new Date());
            this.start = Ysh.Time.toString(Ysh.Time.getTimeStart(s, this.type));
        },
        redraw: function () {
            this.width = $(this.$el).width() - 50 - 40 - 40;
        },
        resize: function () {
            if (!this.$el)
                return;
            this.$nextTick(function () {
                this.redraw();
            });
        }
    },
    watch: {
        type: function () { this.resetStartTime(); },
        min: function () { this.start = this.min; this.resetStartTime(); },
        value: function () {
            //this.changeValue();
            this.$emit('input', this.value);
            this.$emit('change', this.value);
        }
    },
    created: function () {
        this.start = this.min;
        this.resetStartTime();
    },
    mounted: function () {
        //this.min = "1950-01-01";
        //this.max = "2020-01-01";
        Ysh.Web.Event.attachEvent(document, "onkeydown", function () {
            if (!event) return;
            if (event.keyCode == Ysh.Key.LeftArrow) {

            } else if (event.keyCode == Ysh.Key.rightArrow) {

            }
        });
    },
    template: '#htimeplayer_template'
});