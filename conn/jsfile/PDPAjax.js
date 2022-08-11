﻿// PDP = JqPro.regClass('/ajaxpro/PDP,PDP2.0.ashx', ['Read', 'Execute'], [['strConn', 'strXml', 'arrArgs'], ['args']], '2018-06-14 20:50:00'); // -->
PDP = JqPro.regClass('/conn/ashx/PDP,PDP2.0.ashx', ['Read', 'Execute'], [['strConn', 'strXml', 'arrArgs'], ['args']], JqPro.getTime()); // -->
PDP.GetBkData = function (o) {
    var d0 = {
        isOK: true
        , errCode: 0
        , errMsg: ""
        , value: null
        , time: ""
        , check: function (strOperate, silent) {
            if (this.isOK) {
                if ((typeof (silent) != "undefined") && (silent))
                    return true;
                if (typeof (strOperate) != "undefined")
                    alert(strOperate + "成功");
                //Ysh.Web.alerts(strOperate + "成功", 500);
                return true;
            }
            if (this.errCode == 1) {
                top.location.href = "/ErrorPage.aspx?e=1";
            }
            else {
                if (this.errCode === "jwt_error") {
                    top.location.href = "/login.html";
                }
                alert((typeof (strOperate) == "undefined") ? this.errMsg : strOperate + "失败:" + this.errMsg);
                if ((this.errCode == -2146823279) || (this.errCode == -2146827286)) { /* XXX 未定义,或者语法错误 */
                    top.location.href = "/ErrorPage.aspx?e=2&tm=" + this.time;
                }
            }
            return false;
        }
    }
    var d1 = o.value;
    d0.isOK = d1[0];
    if (d0.isOK) {
        d0.value = d1[1];
    } else {
        d0.errCode = d1[1];
        d0.errMsg = d1[2];
    }
    return d0;
}
PDP.changeArgs = function (args) {
    for (var i = 0; i < args.length; i++) {
        var v = args[i];
        if (typeof v == "undefined") {
            args[i] = null;
            continue;
        }
        if (v instanceof Date) {
            args[i] = v.getFullYear() + "-" + (v.getMonth() + 1) + "-" + v.getDate() + " " + v.getHours() + ":" + v.getMinutes() + ":" + v.getSeconds();
            continue;
        }
        if (v instanceof String)
            args[i] = escape(v);
        else if (v instanceof Array)
            this.changeArgs(v);
        else if (v instanceof Object) {
            if (v.args)
                this.changeArgs(v.args);
        }
    }
    return args;
}
PDP.ExecuteBack = function (f) { var data; try { data = this.GetBkData(f()); } catch (E) { data = this.GetBkData({ value: [false, E.number, E.message] }); }; data.time = new Date(); return data; }
PDP.read = function (strConn, strXml, arrArgs, callback, sync) {
    if (!callback)
        return this.ExecuteBack(function () { return PDP.Read(strConn, strXml, PDP.changeArgs(arrArgs)); });
    if (sync) {
        callback(this.ExecuteBack(function () { return PDP.Read(strConn, strXml, PDP.changeArgs(arrArgs)); }));
        return;
    }
    PDP.Read.async(strConn, strXml, PDP.changeArgs(arrArgs)).start(function (data) {
        var ret = PDP.ExecuteBack(function () { return { value: data }; });
        callback(ret);
    });
}
PDP.exec = function (args, callback, sync) {
    if (!callback)
        return this.ExecuteBack(function () { return PDP.Execute(PDP.changeArgs(args)); });
    if (sync) {
        callback(this.ExecuteBack(function () { return PDP.Execute(PDP.changeArgs(args)); }));
        return;
    }
    PDP.Execute.async(PDP.changeArgs(args)).start(function (data) {
        var ret = PDP.ExecuteBack(function () { return { value: data }; });
        callback(ret);
    });
}
PDP.dll = function (dll, args, callback, sync) { return this.exec([{ type: "dll", "dll": dll, "args": PDP.changeArgs(args) }], callback, sync); }
