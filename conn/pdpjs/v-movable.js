﻿/*v=1.20.702.1*/
function Drag() {
    //初始化
    this.initialize.apply(this, arguments)
}

Drag.prototype = {
    //初始化
    initialize: function (drag, options) {
        this.drag = drag;
        this._x = this._y = 0;
        this._moveDrag = this.bind(this, this.moveDrag);
        this._stopDrag = this.bind(this, this.stopDrag);

        this.setOptions(options);

        this.handle = this.options.handle;
        this.maxContainer = this.options.maxContainer;

        this.maxTop = Math.max(this.maxContainer.clientHeight, this.maxContainer.scrollHeight) - this.drag.offsetHeight;
        this.maxLeft = Math.max(this.maxContainer.clientWidth, this.maxContainer.scrollWidth) - this.drag.offsetWidth;

        this.limit = this.options.limit;
        this.lockX = this.options.lockX;
        this.lockY = this.options.lockY;
        this.lock = this.options.lock;

        this.onStart = this.options.onStart;
        this.onMove = this.options.onMove;
        this.onStop = this.options.onStop;

        this.handle.style.cursor = "move";

        this.changeLayout();

        this.addHandler(this.handle, "mousedown", this.bind(this, this.startDrag))
    },
    changeLayout: function () {
        //this.drag.style.top = this.drag.offsetTop + "px";
        //this.drag.style.left = this.drag.offsetLeft + "px";
        this.drag.style.position = "absolute";
        this.drag.style.margin = "0"
    },
    noMove: function (src) {
        if (src == this.drag)
            return false;
        if (!src)
            return false;
        if (!src.getAttribute)
            return false;
        if (src.getAttribute("nomove"))
            return true;
        return this.noMove(src.parentElement);
    },
    startDrag: function (event) {
        var event = event || window.event;
        var src = event.srcElement;
        if (this.noMove(src))
            return;

        this._x = event.clientX - this.drag.offsetLeft;
        this._y = event.clientY - this.drag.offsetTop;

        this.addHandler(document, "mousemove", this._moveDrag);
        this.addHandler(document, "mouseup", this._stopDrag);

        event.preventDefault && event.preventDefault();
        this.handle.setCapture && this.handle.setCapture();

        this.onStart()
    },
    moveDrag: function (event) {
        var event = event || window.event;

        var iTop = event.clientY - this._y;
        var iLeft = event.clientX - this._x;

        if (this.lock) return;

        this.limit && (iTop < 0 && (iTop = 0), iLeft < 0 && (iLeft = 0), iTop > this.maxTop && (iTop = this.maxTop), iLeft > this.maxLeft && (iLeft = this.maxLeft));

        if (!this.lockX) {
            this.drag.style.right = "";
            this.drag.style.left = iLeft + "px"
        }
        if (!this.lockY) {
            this.drag.style.bottom = "";
            this.drag.style.top = iTop + "px"
        }

        event.preventDefault && event.preventDefault();

        this.onMove()
    },
    stopDrag: function () {
        this.removeHandler(document, "mousemove", this._moveDrag);
        this.removeHandler(document, "mouseup", this._stopDrag);

        this.handle.releaseCapture && this.handle.releaseCapture();

        this.onStop()
    },
    //参数设置
    setOptions: function (options) {
        this.options =
		{
		    handle: this.drag, //事件对象
		    limit: true, //锁定范围
		    lock: false, //锁定位置
		    lockX: false, //锁定水平位置
		    lockY: false, //锁定垂直位置
		    maxContainer: document.documentElement || document.body, //指定限制容器
		    onStart: function () { }, //开始时回调函数
		    onMove: function () { }, //拖拽时回调函数
		    onStop: function () { }  //停止时回调函数
		};
        for (var p in options) this.options[p] = options[p]
    },
    //添加绑定事件
    addHandler: function (oElement, sEventType, fnHandler) {
        return oElement.addEventListener ? oElement.addEventListener(sEventType, fnHandler, false) : oElement.attachEvent("on" + sEventType, fnHandler)
    },
    //删除绑定事件
    removeHandler: function (oElement, sEventType, fnHandler) {
        return oElement.removeEventListener ? oElement.removeEventListener(sEventType, fnHandler, false) : oElement.detachEvent("on" + sEventType, fnHandler)
    },
    //绑定事件到对象
    bind: function (object, fnHandler) {
        return function () {
            return fnHandler.apply(object, arguments)
        }
    }
};

Vue.directive('movable', {
    bind: function (el, binding, vnode) {
        var n = binding.value;
        if (!el.style.zIndex)
            el.style.zIndex = 50;
        var obj = el;
        if (n > 0)
            obj = el.children[n - 1];
        new Drag(el, { handle: obj, limit: false });
    }
});