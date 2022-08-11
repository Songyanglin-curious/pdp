/// <reference path="../jquery/jquery-1.11.1.js" />
/// <reference path="../layui/lay/modules/layer.js" />
/**
 * js通用工具
 */
jsTools = {
    loadIndex: undefined,
    /**
     * 执行jquery的ajax方法
     * @param {json} ajaxParam ajax的参数
     * action 请求action方法名称
     * data 传入后台的参数
     * type post或get  默认是post
     * dataType  默认是json
     * success(data) 执行成功后执行的方法
     * error(XMLHttpRequest, textStatus, errorThrown) errFunc(errText) 错误时执行方法
     * complete(XHR, TS) 执行完成后的方法
     * @param {bool} isLoadAction 显示加载动画
     * @param {string} loadmessage 加载提示消息  默认为：正在加载，请稍后
     * @returns {} 无返回值
     */
    $ajax: function (ajaxParam,isLoadAction,loadmessage) {
        if (!ajaxParam) return;
        if (window["layer"] && isLoadAction) {
            if (!loadmessage)
                loadmessage = "正在加载，请稍后";
             this.loadIndex= jsTools.layer.loadMessage(loadmessage);
        }
        if (!ajaxParam.data)
            ajaxParam.data = {}
        var myAjaxOption = {
            url: ajaxParam.url + (ajaxParam.url.indexOf("?") < 0 ? "?" : "&") + "randomDt=" + new Date(),
            type: ajaxParam.type ? ajaxParam.type : "post",
            dataType: ajaxParam.dataType ? ajaxParam.dataType : "json",
            async: ajaxParam.async==false?false:true,
            data: encodeURIComponent(JSON.stringify(ajaxParam.data)),
            contentType: ajaxParam.contentType ? ajaxParam.contentType : 'application/json; charset=utf-8',
            success: function (retData) {
                //出错提示
                if (retData.error) {
                    switch (retData.type) {
                    case "relogin":
                        top.location.href = retData.error;
                        return;
                    }
                    if (ajaxParam.error)
                        ajaxParam.error(retData.error);
                    else
                        alert(retData.error);
                } else {
                    if (ajaxParam.success)
                        ajaxParam.success(retData);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (ajaxParam.error) {
                    ajaxParam.error(XMLHttpRequest.responseText);
                } else {
                    alert(XMLHttpRequest.responseText);
                }
            },
            complete: function (XHR, TS) {
                if (ajaxParam.complete)
                    ajaxParam.complete(XHR, TS);
                if (jsTools.loadIndex) {
                    layer.close(jsTools.loadIndex);
                    jsTools.loadIndex = undefined;
                }
            }
        }
        //添加其他ajax配置
        for (var p in ajaxParam) {
            if (myAjaxOption[p] == undefined)
                myAjaxOption[p] = ajaxParam[p];
        }
        $.ajax(myAjaxOption);
    },
    /**
     * 以form形式提交，后台可做跳转页面
     * @param {string} url 提交地址
     * @param {string} type 默认是post
     */
    SubmitAsForm: function (url, type) {
        var form = $("<form action='" + url + "' method='" + (type ? type : 'post') + "'></form>");
        $(document.body).append(form);
        form.submit();
    },
    /**
     * 获取浏览器地址？参数
     * @param {string} name 参数名称
     * @returns {} 
     */
    GetUrlParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    /**
     * 弹出框
     */
    layer: {
        /**
        * layui弹出div
        * @param {string} id 内容div的id
        * @param {string} title 标题
        * @param {number/string} width 弹窗宽度
        * @param {number/string} height 弹窗高度
        * @param {function} successFn(layero, index) 弹窗后执行函数
        * @param {function} closeFn(index, layero) 关闭弹窗后执行
        * @param {json} options layer参数，去官网查询https://www.layui.com/doc/modules/layer.htm
        * @returns {int} layer的index
        */
        Open: function (id, title, width, height, successFn, closeFn, options) {
            var o = {};
            if (options)
                o = options;
            if (!o.type)
                o.type = o.type = 1;
            if (!o.content)
                o.content = $("#" + id);
            if (!o.zIndex)
                o.zIndex = 999;
            if (!o.area) {
                width = width ? (width + '').replace("px", "") + "px" : 'auto';
                height = height ? (height + '').replace("px", "") + "px" : 'auto';
                var docWidth = $(document).width();
                var docHeight = $(document).height();

                if (docWidth < parseInt(width.replace('px', '')))
                    width = docWidth + "px";
                if (docHeight < parseInt(height.replace('px', '')))
                    height = docHeight + "px";
                o.area = [width, height];
            }
            if (!o.resize)
                o.resize = false;
            o.title = title;
            if (!title)
                o.title = title;
            o.success = function (layero, index) {
                if (successFn)
                    successFn(layero, index);
            }
            o.cancel = function (index, layero) {
                if (closeFn)
                    closeFn(index, layero);
            }
            var index = layer.open(o);
            //将内容层超出部分显示
            $("#layui-layer" + index).find(".layui-layer-content").css("overflow", "visible");
            return index;
        },
        /**
         * layui弹出iframe
         * @param {string} url 弹出窗口地址
         * @param {string} title 标题
         * @param {string/number} width 宽
         * @param {string/number} height 高
         * @param {function} successFn(layero, index) 成功的方法
         * @param {function} closeFn(index, layero) 失败的方法
         * @param {json} options layer参数
         * @returns {int} layer的index
         */
        OpenLayuiIframeWindow: function (url, title, width, height, successFn, closeFn, options) {
            var o = {
                type: 2,
                content: url,
                shadeClose: true,
                shade: false,
                maxmin: true,
                resize: true,
                zIndex: layer.zIndex
            };
            if (options)
                $.extend(o, options);
            return jsTools.layer.Open("", title, width, height, function (layero, index) {
                layer.setTop(layero);
                if (successFn)
                    successFn(layero, index);
            }, closeFn, o);
        },
        /**
         * OpenDivOnInput返回的id
         */
        OpenDivOnInputIndex: undefined,
        /**
         * OpenDivOnInput用的id
         */
        OpenDivOnInputId: undefined,
        /**
         * OpenDivOnInput用的destId
         */
        OpenDivOnInputDestId: undefined,
        /**
         * 向上弹出div
         * @param {string} id 弹出div的id
         * @param {string} destId 目的位置div的id
         * @param {string/number} width 宽
         * @param {string/number} height 高
         * @param {function} successFn(layero, index) 成功的方法
         * @param {function} closeFn(index, layero) 失败的方法
         * @returns {int} layer的index
         */
        OpenDivOnInput: function (id, destId, width, height, successFn, closeFn) {
            if (this.OpenDivOnInputIndex > 0 && this.OpenDivOnInputDestId === destId)
                return this.OpenDivOnInputIndex;
            else if (this.OpenDivOnInputIndex != undefined && this.OpenDivOnInputDestId !== destId) {
                layer.close(this.OpenDivOnInputIndex);
                this.OpenDivOnInputIndex = 0;
            }
            this.OpenDivOnInputId = id;
            this.OpenDivOnInputDestId = destId;
            var $showDiv = $("#" + id);
            var $dest = $("#" + destId);
            if ($dest.attr("disabled") === "disabled")
                return 0;
            var offsetTop = $dest.offset().top - $(window).scrollTop() - (height ? height : $showDiv.height()) - 2;//因为弹出框下面有阴影，高出2像素一点好看
            var offsetLeft = $dest.offset().left;
            if (this.OpenDivOnInputIndex == undefined) {
                var _this = this;
                $(document).on("click", function (e) {
                    if (_this.OpenDivOnInputIndex === 0) return;
                    var selDom = $(e.target);
                    //排除自定义提示框dom节点
                    if (selDom.closest("#layui-layer" + jsTools.alertIndex).length > 0
                        || ((selDom.hasClass("layui-layer-close") || selDom.hasClass("layui-layer-btn0")) && selDom.parent().parent().length === 0)
                        || (selDom[0].nodeName === "BODY"))
                        return;
                    //排除弹出框dom
                    if (selDom.closest("#" + _this.OpenDivOnInputId).length > 0)
                        return;
                    //排除目的框的点击
                    if (selDom.closest("#" + _this.OpenDivOnInputDestId).length > 0 || e.target.id === _this.OpenDivOnInputDestId)
                        return;

                    layer.close(_this.OpenDivOnInputIndex);
                    _this.OpenDivOnInputIndex = 0;
                });
            }
            this.OpenDivOnInputIndex = jsTools.layer.Open(null, null, width, height, successFn, closeFn,
            {
                shade: false,
                title: false,
                content: $showDiv,
                offset: [offsetTop + 'px', offsetLeft + 'px']
            });
            return this.OpenDivOnInputIndex;
        },
        /**
         * layui提示，吸附在传入的对象上
         * @param {string} content 提示内容
         * @param {document/string} document 可以使doc对象，也可以是#id
         * @param {json} options layer参数
         * @returns {int} layer的index
         */
        tips: function (content, document, options) {
            var o = {};
            if (options != undefined)
                o = options;
            if (o.time == undefined)
                o.time = 0;
            o.tipsMore = true;
            o.tips = [2, '#FF5656'];
            return layer.tips(content, document, o);
        },
        /**
         * 加载中
         * @param {string} loadmessage 提示文字
         * @returns {} 
         */
        loadMessage: function (loadmessage) {
            return layer.msg(loadmessage, { icon: 16, shade: 0.3, time: 0 });
        }
    },
    /**
     * 日期转字符串,fromatter不填写则默认格式化未yyyy-mm-dd hh:mi:ss
     * @param {Date/string} date 
     * @param {string} formatter yyyy:年 mm:月 dd:日 hh:小时 mi:分钟  ss:秒
     * @returns {string} 格式化后的字符串
     */
    DateToString: function (date, formatter) {
        if (date instanceof Date) {
        } else {
            date = new Date(date.replace(/-/g, '/'));
        }
        if (!formatter)
            formatter = 'yyyy-mm-dd hh:mi:ss';
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        if (m < 10)
            m = "0"+m;
        var d = date.getDate();
        if (d < 10)
            d = "0"+d;
        var h = date.getHours();
        if (h < 10)
            h = "0"+h;
        var i = date.getMinutes();
        if (i < 10)
            i = "0"+i;
        var s = date.getSeconds();
        if (s < 10)
            s = "0"+s;
        return formatter.replace('yyyy', y).replace('mm', m).replace('dd', d).replace('hh', h).replace('mi', i).replace('ss', s);
    },
    /**
     * 添加日期
     * @param {string} interval y/m/d/w/hh/mm/ss/l  年/月/日/周/时/分/秒/毫秒
     * @param {number} number 添加的数量
     * @param {date} date 被添加的日期
     * @returns {} 
     */
    addDate: function (interval, number, date) {
        switch (interval.toLowerCase()) {
            case "y": return new Date(date.setFullYear(date.getFullYear() + number));
            case "m": return new Date(date.setMonth(date.getMonth() + number));
            case "d": return new Date(date.setDate(date.getDate() + number));
            case "w": return new Date(date.setDate(date.getDate() + 7 * number));
            case "hh": return new Date(date.setHours(date.getHours() + number));
            case "mm": return new Date(date.setMinutes(date.getMinutes() + number));
            case "ss": return new Date(date.setSeconds(date.getSeconds() + number));
            case "l": return new Date(date.setMilliseconds(date.getMilliseconds() + number));
        }
    },
    /**
     * 给select控件，添加option
     * @param {string/jquery} id 控件id或者jquery对象
     * @param {Arrary} data 填充数据
     * @param {string} valueName value列名称
     * @param {string} textName 内容列名称
     * @param {json} otherAttr 其他填充属性,例子{attrname:colname}
     * @param {bool} addEmpty 添加空项
     * @param {string} emptyText 空项显示文字
     * @returns {} 
     */
    AddSelectOption: function (id, data, valueName, textName, otherAttr, addEmpty, emptyText, emptyValue) {
        var $select;
        if (id instanceof jQuery)
            $select = id;
        else
            $select = $("#" + id);
        $select.empty();
        var hasOtherAttr = !!otherAttr;
        if (addEmpty) {
            $select.append("<option value='" + (emptyValue ? emptyValue : "") + "' >" + (emptyText ? emptyText : "") + "</option>");
        }
        if (!data) return;
        for (var i = 0; i < data.length; i++) {
            var $option = $("<option></option>");
            $option.val(data[i][valueName]);
            $option.text(data[i][textName]);

            if (hasOtherAttr) {
                for (var key in otherAttr) {
                    if (data[i][otherAttr[key]] != undefined)
                        $option.attr(key, data[i][otherAttr[key]]);
                }
            }
            $select.append($option);
        }
    },
    /**
     * 获取下拉菜单选中项
     * @param {string} id 下拉菜单id
     * @returns {json} {text:"",value:""}
     */
    GetSelectedOption: function (id) {
        var ret = { text: "", value: "" }
        var option = $("#" + id).find("option:selected");
        if (option.length) {
            ret.text = option.text();
            ret.value = option.val();
        }
        return ret;
    },
    /**
     * 设置Input控件禁用
     * @param {string} id 控件Id
     * @param {bool} isDisabled 是否禁用
     * @returns {} 
     */
    SetDomDisabled: function (id, isDisabled) {
        if (isDisabled)
            $("#" + id).attr("disabled", "disabled");
        else
            $("#" + id).removeAttr("disabled");

    },
    /**
     * 触发layui form控件的事件
     * @param {string} id 控件ID
     * @returns {} 
     */
    TriggerLayuiFormEvent: function (id) {
        var $dom = $("#" + id);
        switch ($dom[0].type) {
            case "checkbox":
                $dom.next().trigger("click");
                $dom.next().trigger("click");
                break;
            case "radiobutton":
                $dom.each(function () {
                    if ($(this).next().hasClass("layui-form-radioed")) {
                        $(this).next().trigger("click");
                        return false;
                    }
                }); break;
            case "select-one":
                $dom.next().find(".layui-this").trigger("click");
        }
    },
    /**
     * 验证文件名  文件名不能包含 \\\\/:*?\"<>| 这些非法字符
     * @param {string} val 验证文本
     * @returns {bool} 验证通过返回true  失败返回false
     */
    CheckFileName:function(val) {
        var reg = new RegExp('[\\\\/:*?\"<>|]');
        return !reg.test(val);
    },
    /**
     * 验证输入的是否有中文
     * @param {string} val 验证文本
     * @returns {bool} 有返回true  没有返回false
     */
    CheckChineseTxt: function (val) {
        var regCh = new RegExp('[\u4e00-\u9fa5]');
        return regCh.test(val);
    },
    alertIndex: 0,
    /**
     * 给script link标签加版本号
     * @param {number/string} version 版本号，不填写，则生成4位随机数
     * @returns {} 
     */
    AddScriptLinkVersion:function(version) {
        $("link,script").each(function () {
            if(version==undefined)
                version = Math.random().toFixed(4);
            if ($(this).attr("src")) {
                var $src = $(this).attr("src");
                if ($src.indexOf("ViewsJs") >= 0 || $src.indexOf("MySpOperate") >= 0 || $src.indexOf("ReportField") >= 0 || $src.indexOf("SpreadJsHelper") >= 0)//自己写的js才加版本
                    $(this).attr("src", $src + "?v=" + version);
            } else if ($(this).attr("href")) {
                var $href = $(this).attr("href");
                if ($href.indexOf("Content") >= 0 || $href.indexOf("ReportField") >= 0)//自己写的css才加版本
                    $(this).attr("href", $href + "?v=" + version);
            }
        });
    }
}
String.prototype.replaceAll = function (FindText, RepText) {
    return this.replace(new RegExp(FindText, "gm"), RepText);
}
if (window["layer"]) {
    /**
     * 自定义alert
     * @param {string/html} message 弹出框消息
     * @param {function} fn 点击确定后执行的方法
     * @returns {} 
     */
    window.alert = function (message, fn) {
        jsTools.alertIndex = layer.open({
            type: 0,
            title: '提示',
            content: message,
            anim: 5,
            isOutAnim: false,
            btn: ['确定'],
            zindex:19991023,
            btn1: function (index, layero) {
                if (fn)
                    fn(index, layero);
                layer.close(index);
                jsTools.alertIndex = 0;
            }
        });
    }
    window.laymessage = function (message, time) {
        layer.msg(message, { time: time ? time : 1000 });
    }
}
if (window["layui"]) {
    //注册formSelects控件
    layui.config({
        base: '../../Scripts/layui/other/fromSelects-v4/' //此处路径请自行处理, 可以使用绝对路径
    }).extend({
        formSelects: 'formSelects-v4'
    });
}
