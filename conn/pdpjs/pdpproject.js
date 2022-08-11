/*v=1.20.1109.1*/
const YshConfig = {
    contextmenuExport: true,//表格表头右键导出功能是否开启（true:开启，false:关闭）,
    ModalFuncVersion: 2,//Iview的Modal组件相关扩展功能版本（1：老版本，2：新版本）
}
var ProjectSGC = {
    LINE: { ID: 0, NAME: 1, DCC: 6, GRID: 7, VOLTAGE: 8, START_ST: 9, END_ST: 10, OPERATE_DATE: 11, STATE: 12, LENGTH: 13 },
    GRID: { ID: 0, NAME: 1, PID: 2, LEVEL: 3 },
    DCC: { ID: 0, NAME: 1, PID: 2, LEVEL: 3 },
    Array: {
        groupSum: function (array2d, gIdx, nameIdx, sIdx, order) {
            var o = {};
            for (var i = 0; i < array2d.length; i++) {
                var item = array2d[i];
                var g = item[gIdx];
                if (!o[g])
                    o[g] = { name: item[nameIdx], value: 0 };
                o[g].value += Ysh.String.toFloat(item[sIdx], 0);
            }
            var ret = [];
            for (var g in o) {
                var d = o[g];
                ret.push([d.name, d.value]);
            }
            switch (order) {
                case "asc":
                    ret.sort(function (x, y) { return x[1] - y[1]; });
                    break;
                case "desc":
                    ret.sort(function (x, y) { return y[1] - x[1]; });
                    break;
            }
            return ret;
        },
        top: function (array2d, valueIdx, count, cols) {
            var arrNew = Ysh.Object.clone(array2d);
            arrNew.sort(function (x1, x2) { return Ysh.String.toFloat(x2[valueIdx], 0) - Ysh.String.toFloat(x1[valueIdx], 0) });
            var ret = [];
            var length = Math.min(count, arrNew.length);
            for (var i = 0; i < length; i++) {
                var item = arrNew[i];
                var row = [];
                for (var j = 0; j < cols.length; j++) {
                    row.push(item[cols[j]]);
                }
                ret.push(row);
            }
            return ret;
        },
        sum: function (array2d, valueIdx, fSkip) {
            var s = 0;
            for (var i = 0; i < array2d.length; i++) {
                var item = array2d[i];
                if (fSkip)
                    if (fSkip(item, i))
                        continue;
                s += Ysh.String.toFloat(item[valueIdx], 0);
            }
            return s;
        },
        sumInt: function (array2d, valueIdx, fSkip) {
            var s = 0;
            for (var i = 0; i < array2d.length; i++) {
                var item = array2d[i];
                if (fSkip)
                    if (fSkip(item, i))
                        continue;
                s += Ysh.String.toInt(item[valueIdx], 0);
            }
            return s;
        },
        filter: function (array2d, vIdx, values) {
            var lst = [];
            for (var i = 0; i < array2d.length; i++) {
                var row = array2d[i];
                if (values.indexOf(row[vIdx]) < 0)
                    continue;
                lst.push(row);
            }
            return lst;
        },
        filterName: function (array2d, nameIdx, filterString) {
            if (!filterString) return array2d;
            var lst = [];
            for (var i = 0; i < array2d.length; i++) {
                var row = array2d[i];
                var name = row[nameIdx];
                if (name.indexOf(filterString) < 0)
                    continue;
                lst.push(row);
            }
            return lst;
        },
        pick: function (array2d, f) {
            var lst = [];
            for (var i = 0; i < array2d.length; i++) {
                var row = array2d[i];
                if (f(row))
                    lst.push(row);
            }
            return lst;
        },
        edit: function (array1, array2, f) {
            if (!array1)
                return [[], [], array2 || []];
            if (!array2)
                return [array1, [], []];
            var arrDelete = [];
            var arrModify = [];
            var temp = [];
            for (var i = 0; i < array2.length; i++) temp.push(array2[i]);
            for (var i = 0; i < array1.length; i++) {
                var o1 = array1[i];
                var bDeal = false;
                for (var j = 0; j < temp.length; j++) {
                    var o2 = temp[j];
                    var n = f(o1, o2);//0 不同 1 相同  2 状态不同
                    if (!n)
                        continue;
                    if (n == 2) {
                        arrModify.push([o1, o2]);
                    }
                    temp.splice(j, 1);
                    bDeal = true;
                    break;
                }
                if (!bDeal) {
                    arrDelete.push(o1);
                }
            }
            return [arrDelete, arrModify, temp];
        }
    },
    Const: {
        DCC_GD: "0021990100",
        GRID_GD: "0101990100",
        OWNER_GD: "990100"
    },
    Config: {
        OpenModeType: { GENERAL: 0, MULTI_SCREEN: 1, NO_LIST: 2 },
        OpenMode: 0 //0 - 默认，1 - window.open 
    },
    Data: {
        DateCurve: {
            Hour: {
                createArray: function (names) {
                    var result = [];
                    for (var i = 0; i < 24; i++) {
                        var row = [ProjectSGC.String.toHourStr(i, 0)];
                        for (var d = 0; d < names.length; d++)
                            row.push("");
                        result.push(row);
                    }
                    return { names: names, data: result };
                },
                fill: function (results, ds, idxDataStart) {
                    for (var i = 0; i < ds.length; i++) {
                        var row = ds[i];
                        for (var r = 0; r < results.length; r++) {
                            var result = results[r];
                            if (!result.getName)
                                continue;
                            var name = result.getName(row);
                            if (name === null)
                                continue;
                            var idx = result.names.indexOf(name);
                            if (idx < 0)
                                continue;
                            for (var c = 0; c < 24; c++) {
                                result.data[c][idx + 1] = row[idxDataStart + c];
                            }
                        }
                    }
                }
            },
            getDiff: function (v1, v0) {
                if (v0 === 0) return v1; if (!v0) return ""; v0 = parseFloat(v0); if (v1 === 0) return 0 - v0; if (!v1) return ""; return parseFloat(v1) - v0;
            },
            appendDiff: function (array2d, idx0, idx1, f) {
                for (var i = 0; i < array2d.length; i++) {
                    var row = array2d[i];
                    var v = (f || this.getDiff)(row[idx1], row[idx0]);
                    row.push(v);
                }
            }
        },
        createTimeCurve: function (dates) {
            var ret = {
                idxDate: 0,
                idxData: 1,
                dates: dates,
                result: [],
                fGetDate: function (row) { return null; },
                init: function (dates) {
                    var result = [];
                    var count = 24;
                    for (var i = 0; i < count; i++) {
                        var row = [ProjectSGC.String.toMinuteStr(i, 0)];
                        for (var d = 0; d < dates.length; d++)
                            row.push("");
                        result.push(row);
                    }
                    this.result = result;
                },
                read: function (ds) {
                    this.result = {};
                    for (var i = 0; i < ds.length; i++) {
                        var row = ds[i];
                        var dt = this.fGetDate(row);
                        if (dt === null)
                            continue;
                    }
                }
            };
            return ret;
        },
        loadYearData: function (sqls, args, yearIndex, startIndex, endIndex, f, sync) {
            var lst = [];
            var start = args[startIndex];
            var end = new Date(args[endIndex]);
            var tm = new Date(Ysh.Time.parseDate(start));
            while (tm <= end) {
                var nextYear = Ysh.Time.getTimeStart(Ysh.Time.add('y', 1, tm), 'y');
                var newArgs = Ysh.Object.clone(args);
                newArgs[startIndex] = tm;
                newArgs[yearIndex] = tm.getFullYear();
                if (end <= nextYear) {
                    newArgs[endIndex] = end;
                    Ysh.Array.each(sqls, function (sql) { lst.push({ type: 'read', db: 'SGC', sql: sql, args: newArgs, silent: true }); });
                    break;
                }
                newArgs[endIndex] = nextYear;
                Ysh.Array.each(sqls, function (sql) { lst.push({ type: 'read', db: 'SGC', sql: sql, args: newArgs, silent: true }); });
                tm = nextYear;
            }
            if (lst.length == 0)
                return;
            PDP.exec(lst, function (ret) {
                var data = [];
                if (ret.check("获取数据", true)) {
                    ret = ret.value;
                    for (var i = 0; i < ret.length; i++) {
                        var d = ret[i] || [];
                        for (var j = 0; j < d.length; j++)
                            data.push(d[j]);
                    }
                }
                f(data);
            }, sync);
        }
    },
    Dict: {
        create: function (desc, fGetOne, sql, args, idCol) {
            idCol = idCol || "id";
            return {
                all: [],
                state: 0,
                load: function () {
                    if (this.state == 1)
                        return;
                    var v = PDP.read("SGC", sql, args || []);
                    var o = this;
                    if (v.check("获取" + desc, true)) {
                        v = v.value;
                        o.state = 1;
                        var lst = [];
                        for (var i = 0; i < v.length; i++) {
                            var o = fGetOne(v[i]);
                            if (o == null)
                                continue;
                            lst.push(o);
                            this[o[idCol]] = o;
                        }
                        this.all = lst;
                    }
                }
            }
        }
    },
    getWarnImg: function (level) {
        return ["/i/sgc/tq/warn-red.png",
            "/i/sgc/tq/warn-orange.png",
            "/i/sgc/tq/warn-yellow.png",
            "/i/sgc/tq/warn-blue.png",
            "/i/sgc/tq/warn-white.png"][(level || 1) - 1];
    },
    getNumber: function (n) {
        if (n < 100) return n;
        return "99+";
    },
    toDictionary: function (arr, idxID) {
        var ret = {};
        for (var i = 0; i < arr.length; i++) {
            ret[arr[i][idxID]] = arr[i];
        }
        return ret;
    },
    timeLeftJoin: function (tmStart, tmEnd, interval, offset, array2d, colCount, timeIndex) {
        var arrRet = [];
        var idx = 0;
        for (var tm = tmStart; tm < tmEnd; tm = Ysh.Time.add(interval, offset, tm)) {
            var strCur = Ysh.Time.toString(tm);
            var bFind = false;
            for (; idx < array2d.length; idx++) {
                var row = array2d[idx];
                var strTime = row[timeIndex];
                if (strCur < strTime)
                    break;
                if (strCur == strTime) {
                    bFind = true;
                    arrRet.push(row);
                    idx++;
                    break;
                }
            }
            if (!bFind) {
                var arrNew = Ysh.Array.initN(colCount, "");
                arrNew[timeIndex] = strCur;
                arrRet.push(arrNew);
            }
        }
        return arrRet;
    },
    Number: {
        i: function (v) { if (v === "") return v; if (isNaN(v)) return v; return v.toFixed(); },
        f: function (v, n) { if (isNaN(v)) return v; return v.toFixed(n); },
        ff: function (n) { return function (v) { if (isNaN(v)) return v; return v.toFixed(n); } },
        percent: function (n1, n2) { if (!n2) return "-"; if (!n1) return 0; return (n1 / n2 * 100.0).toFixed(2); }
    },
    Map: {
        getDistance: function (lonA, latA, lonB, latB) {
            if ((lonA == lonB) && (latA == latB)) return 0;
            return Math.acos(Math.sin(latA * Math.PI / 180) *
                Math.sin(latB * Math.PI / 180) * Math.cos(lonA * Math.PI / 180 -
                    lonB * Math.PI / 180) + Math.cos(latA * Math.PI / 180) *
                Math.cos(latB * Math.PI / 180)) * 6371;
        },
        inst: null,
        window: null,
        getMainObject: function (id, def) {
            return ProjectSGC.Global.getMainObject(id, def);
        },
        getInst: function () {
            if (this.inst) return this.inst;
            this.inst = {
                locate: function () { }, postMessage: function () { }
            }
            var p = (window.opener ? window.opener : window);
            try {
                p.location.href;
            } catch (err) {
                p = window;
            }
            while (true) {
                var map = p.MessageInst;
                if (map) {
                    this.inst = map;
                    this.window = p;
                    break;
                }
                if (p == p.parent) {
                    p = p.opener;
                } else {
                    p = p.parent;
                }
                if (p == null)
                    break;
            }
            return this.inst;
        },
        locate: function (type, id, dest, keepHeight, f) {
            if (!type)
                type = ProjectSGC.Meta.getTypeById(id);
            if (!type)
                return;
            this.getInst().locate(type, id, dest, keepHeight, f);
        },
        fly: function (lon, lat) {
            this.getInst().postMessage({ eventType: "fly", type: 1, data: { longitude: lon, latitude: lat } });
        },
        postMessage: function (data) {
            this.getInst().postMessage(data);
        },
        locatePlantStation: function (lst, keepHeight) {
            var m = this.getMainObject("MapOpeInst");
            if (!m) return;
            m.postMessage({ locateType: 0 });
            m.postMessage({ locateType: 3, locateItem: lst, flyType: (keepHeight ? 1 : 0) });
        },
        isLineTower: function () {
            var bTower = true;
            var us = this.getMainObject("userSettings");
            for (var i = 0; i < us.all.length; i++) {
                var cfg = us.all[i];
                if (cfg.id == "towerCount") {
                    bTower = cfg.value != "1";
                    break;
                }
            }
            return bTower;
        },
        locateLine: function (lst, keepHeight) {
            var m = this.getMainObject("MapOpeInst");
            if (!m) return;
            var model = this.getMainObject("ModelList");
            if (!model) return;
            var bTower = this.isLineTower();
            for (var i = 0; i < lst.length; i++) {
                var item = lst[i];
                var id = item.data.id;
                var line = model.getLine(id);
                if (!line)
                    continue;
                if (bTower) {
                    item.longitude = line[2];
                    item.latitude = line[3];
                } else {
                    item.longitude = line[4];
                    item.latitude = line[5];
                }
            }
            m.postMessage({ locateType: 0 });
            m.postMessage({ locateType: 3, locateItem: lst, flyType: (keepHeight ? 1 : 0) });
        },
        highLight: function (lines, stations, clr, stopDynamic, bAdd) {
            var m = this.getMainObject("MapOpeInst");
            if (!m) return;
            clr = clr || "#ffffff";
            //m.postMessage({ eventType: 'menuope', menuname: 'ShowStationLineByInfo', selstate: true, data: { lstStationInfo: items, lstLineInfo: [] } });
            //return;
            if (!bAdd) {
                m.postMessage({ eventType: "menuope", menuname: "GlowMeshLine", selstate: 0, data: {} });
                m.postMessage({ eventType: "menuope", menuname: "ShaderGlowMeshForStation", selstate: 0, data: {} }, "*");
            }
            if (stations.length > 0)
                m.postMessage({ eventType: "menuope", menuname: "ShaderGlowMeshForStation", selstate: 1, data: { stopDynamic: stopDynamic, stationIDs: stations, glowInfo: { glowColor: clr } } });
            if (lines.length > 0)
                m.postMessage({ eventType: "menuope", menuname: "GlowMeshLine"/*"ShaderGlowMeshForLine"*/, selstate: 1, data: { lineIDs: lines, glowColor: clr, stopDynamic: stopDynamic } });
        },
        locateLineStaRange: function (lineids, stationids, f) {
            if ((lineids.length < 1) && (stationids.length < 1)) return;
            var m = ProjectSGC.Map.getMainObject("ModelList");
            if (!m) return;
            m.require(["station", "line"], function () {
                var maxLon = 0, minLon = 9999999, maxLat = 0, minLat = 9999999;
                var vols = [];
                for (var i = 0; i < lineids.length; i++) {
                    var lineid = lineids[i];
                    var line = m.getLine(lineid);
                    if (!line) continue;
                    vols.push(line[ProjectSGC.LINE.VOLTAGE]);
                    var start_st_id = line[ProjectSGC.LINE.START_ST];
                    var end_st_id = line[ProjectSGC.LINE.END_ST];
                    var start_st_obj = m.getStation(start_st_id) || {};
                    var end_st_obj = m.getStation(end_st_id) || {};
                    if (start_st_obj.LONGITUDE) { maxLon = Math.max(maxLon, start_st_obj.LONGITUDE); minLon = Math.min(minLon, start_st_obj.LONGITUDE); }
                    if (end_st_obj.LONGITUDE) { maxLon = Math.max(maxLon, end_st_obj.LONGITUDE); minLon = Math.min(minLon, end_st_obj.LONGITUDE); }
                    if (start_st_obj.LATITUDE) { maxLat = Math.max(maxLat, start_st_obj.LATITUDE); minLat = Math.min(minLat, start_st_obj.LATITUDE); }
                    if (end_st_obj.LATITUDE) { maxLat = Math.max(maxLat, end_st_obj.LATITUDE); minLat = Math.min(minLat, end_st_obj.LATITUDE); }
                }
                for (var i = 0; i < stationids.length; i++) {
                    var start_st_obj = m.getStation(stationids[i]);
                    if (!start_st_obj) continue;
                    vols.push(start_st_obj.code);
                    if (start_st_obj.LONGITUDE) { maxLon = Math.max(maxLon, start_st_obj.LONGITUDE); minLon = Math.min(minLon, start_st_obj.LONGITUDE); }
                    if (start_st_obj.LATITUDE) { maxLat = Math.max(maxLat, start_st_obj.LATITUDE); minLat = Math.min(minLat, start_st_obj.LATITUDE); }
                }
                var offset = 100;
                var msg = { locateType: 13, range: { maxLng: maxLon, minLng: minLon, maxLat: maxLat, minLat: minLat }, padding: [offset, offset, offset, offset], volcode: vols, isRangeInfo: true, stationIDs: stationids, lineIDs: lineids };
                if (f) f(msg);
                ProjectSGC.Map.postMessage(msg);
            });
        },
        locateRange: function (lineids, stationids, isRectInfo, isRangeInfo) {
            this.locateLineStaRange(lineids, stationids, function (msg) {
                msg.isRectInfo = isRectInfo;
                msg.isRangeInfo = isRangeInfo;
            });
            if ((lineids.length < 1) && (stationids.length < 1)) return;
            var m = ProjectSGC.Map.getMainObject("ModelList");
            if (!m) return;
            m.require(["station", "line"], function () {
                var maxLon = 0, minLon = 9999999, maxLat = 0, minLat = 9999999;
                var vols = [];
                for (var i = 0; i < lineids.length; i++) {
                    var lineid = lineids[i];
                    var line = m.getLine(lineid);
                    if (!line) continue;
                    vols.push(line[ProjectSGC.LINE.VOLTAGE]);
                    var start_st_id = line[ProjectSGC.LINE.START_ST];
                    var end_st_id = line[ProjectSGC.LINE.END_ST];
                    var start_st_obj = m.getStation(start_st_id);
                    var end_st_obj = m.getStation(end_st_id);
                    if (start_st_obj.LONGITUDE) { maxLon = Math.max(maxLon, start_st_obj.LONGITUDE); minLon = Math.min(minLon, start_st_obj.LONGITUDE); }
                    if (end_st_obj.LONGITUDE) { maxLon = Math.max(maxLon, end_st_obj.LONGITUDE); minLon = Math.min(minLon, end_st_obj.LONGITUDE); }
                    if (start_st_obj.LATITUDE) { maxLat = Math.max(maxLat, start_st_obj.LATITUDE); minLat = Math.min(minLat, start_st_obj.LATITUDE); }
                    if (end_st_obj.LATITUDE) { maxLat = Math.max(maxLat, end_st_obj.LATITUDE); minLat = Math.min(minLat, end_st_obj.LATITUDE); }
                }
                for (var i = 0; i < stationids.length; i++) {
                    var start_st_obj = m.getStation(stationids[i]);
                    if (start_st_obj.LONGITUDE) { maxLon = Math.max(maxLon, start_st_obj.LONGITUDE); minLon = Math.min(minLon, start_st_obj.LONGITUDE); }
                    if (start_st_obj.LATITUDE) { maxLat = Math.max(maxLat, start_st_obj.LATITUDE); minLat = Math.min(minLat, start_st_obj.LATITUDE); }
                }
                var offset = 100;
                ProjectSGC.Map.postMessage({ locateType: 13, range: { maxLng: maxLon, minLng: minLon, maxLat: maxLat, minLat: minLat }, padding: [offset, offset, offset, offset], isRectInfo: isRectInfo, isRangeInfo: isRangeInfo, volcode: vols });
            });
        },
        Icon: {
            states: {},
            hide: function (type) {
                var m = ProjectSGC.Global.getMainObject("MapOpeInst");
                if (!m) return;
                m.menu("showImageIcon", false, { type: type });
                m.menu("ShaderGlowMeshForStation", false, { type: type });
                this.states[type] = false;
            },
            initOptions: function (options) {
                if (!options.getIcon)
                    options.getIcon = function (row) { return this.icon; }
                if (!options.getWidth)
                    options.getWidth = function (row) { return this.width || this.size; }
                if (!options.getHeight)
                    options.getHeight = function (row) { return this.height || this.size; }
            },
            showIconsNoTip: function (type, map, data, options) {
                var infos = Ysh.Group.create();
                Ysh.Array.each(data, function (row, idx) {
                    var icon = options.getIcon(row);
                    if (!icon) return;
                    var info = options.fGetInfo(row);
                    if (!info) return;
                    infos.add(icon, info);
                });
                if (this.states[type]) {
                    Ysh.Array.each(infos.result, function (info, idx) {
                        //map.menu("ShowMutipleIcons", true, { type: type, url: info.name, locateData: info.data });
                        map.menu("showImageIcon", true, { stopLight: true, time: 0, type: type, images: { imgCode: idx, imgUrl: info.name, height: options.height, width: options.width }, isBeauty: 1, locateData: info.data });
                    });
                }
            },
            showIconsForTip: function (type, map, data, options) {
                var groups = {};
                var icons = [];
                Ysh.Array.each(data, function (row, idx) {
                    var icon = options.getIcon(row);
                    if (!icon) return;
                    var info = options.fGetInfo(row);
                    if (!info) return;
                    if (!groups[icon]) {
                        groups[icon] = Ysh.Group.create();
                        icons.push(icon);
                    }
                    groups[icon].add([info.longitude, info.latitude], info);
                });
                if (this.states[type]) {
                    Ysh.Array.each(icons, function (icon, idx) {
                        var infos = groups[icon];
                        Ysh.Array.each(infos.result, function (info) {
                            //map.menu("ShowMutipleIcons", true, { type: type, url: icon, locateData: info.data });
                            map.menu("showImageIcon", true, { stopLight: true, time: 0, type: type, images: { imgCode: idx, imgUrl: info.name }, isBeauty: 1, locateData: info.data });
                        });
                    });
                }
            },
            getStationInfo: function (model, options, row) {
                var id = options.getId(row);
                if (!id) return null;
                var ps = model.getStation(id);
                if (!ps) return null;
                var lon = ps.LONGITUDE;
                var lat = ps.LATITUDE;
                var vol = ps.VOLTAGE_TYPE;
                var pstype = ps.PlantStationType;
                var height = options.getHeight(row, ps);
                var width = options.getHeight(row, ps);
                return { height: height, width: width, stationid: id, longitude: lon, latitude: lat, voltage: vol, stationType: pstype, data: { data: row } };
            },
            showIconsByLonLat: function (type, map, model, data, x, y, options) {
                var infos = Ysh.Group.create();
                if (!options.showTips) {
                    Ysh.Array.each(data, function (row, idx) {
                        var icon = options.getIcon(row);
                        if (!icon) return;
                        infos.add(icon).push()
                        var info = this.getStationInfo(model, options, row);
                        if (!info) return;
                        info.push({ height: sz, width: sz, longitude: lon, latitude: lat, voltage: vol, stationType: pstype, data: { data: row } });
                    });
                } else {
                    var groups = Ysh.Group.create();
                    Ysh.Array.each(data, function (row, idx) {
                        var id = row.objid;
                        if (!id)
                            return;
                        var otype = ProjectSGC.Meta.getTypeById(id);
                        if (!otype)
                            return;
                        var name, lon, lat, vol, pstype;
                        var ps = model.getStation(id);
                        if (!ps)
                            return;
                        name = ps.NAME;
                        lon = ps.LONGITUDE;
                        lat = ps.LATITUDE;
                        vol = ps.VOLTAGE_TYPE;
                        pstype = ps.PlantStationType;
                        groups.add([lon, lat, vol, pstype], row);
                    });
                    groups = groups.result;
                    Ysh.Array.each(groups, function (g) {
                        info.push({ height: sz, width: sz, longitude: g.name[0], latitude: g.name[1], voltage: g.name[2], stationType: g.name[3], data: { data: g.data } });
                    });
                }
                if (this.states[type]) {
                    Ysh.Array.each(infos.result, function (info, idx) {
                        map.menu("ShowMutipleIcons", true, { type: type, url: info.name, locateData: info.data });
                    });
                }
            },
            showIconsByFunc: function (type, map, model, data, func, options) {
                var infos = Ysh.Group.create();
                if (!options.showTips) {
                    Ysh.Array.each(data, function (row, idx) {
                        var icon = options.getIcon(row);
                        if (!icon) return;
                        infos.add(icon).push()
                        var info = this.getStationInfo(model, options, row);
                        if (!info) return;
                        info.push({ height: sz, width: sz, longitude: lon, latitude: lat, voltage: vol, stationType: pstype, data: { data: row } });
                    });
                } else {
                    var groups = Ysh.Group.create();
                    Ysh.Array.each(data, function (row, idx) {
                        var id = row.objid;
                        if (!id)
                            return;
                        var otype = ProjectSGC.Meta.getTypeById(id);
                        if (!otype)
                            return;
                        var name, lon, lat, vol, pstype;
                        var ps = model.getStation(id);
                        if (!ps)
                            return;
                        name = ps.NAME;
                        lon = ps.LONGITUDE;
                        lat = ps.LATITUDE;
                        vol = ps.VOLTAGE_TYPE;
                        pstype = ps.PlantStationType;
                        groups.add([lon, lat, vol, pstype], row);
                    });
                    groups = groups.result;
                    Ysh.Array.each(groups, function (g) {
                        info.push({ height: sz, width: sz, longitude: g.name[0], latitude: g.name[1], voltage: g.name[2], stationType: g.name[3], data: { data: g.data } });
                    });
                }
                if (this.states[type]) {
                    Ysh.Array.each(infos.result, function (info, idx) {
                        map.menu("ShowMutipleIcons", true, { type: type, url: info.name, locateData: info.data });
                    });
                }
            },
            showStationsIcon: function (type, map, model, data, options) {
                options.fGetInfo = function (row) {
                    return ProjectSGC.Map.Icon.getStationInfo(model, options, row);
                }
                if (options.showTips)
                    this.showIconsForTip(type, map, data, options);
                else
                    this.showIconsNoTip(type, map, data, options);
                return;
                var infos = Ysh.Group.create();
                if (!options.showTips) {
                    Ysh.Array.each(data, function (row, idx) {
                        var icon = options.getIcon(row);
                        if (!icon) return;
                        infos.add(icon).push()
                        var info = this.getStationInfo(model, options, row);
                        if (!info) return;
                        info.push({ height: sz, width: sz, longitude: lon, latitude: lat, voltage: vol, stationType: pstype, data: { data: row } });
                    });
                } else {
                    var groups = Ysh.Group.create();
                    Ysh.Array.each(data, function (row, idx) {
                        var id = options.getId(row);
                        if (!id)
                            return;
                        var otype = ProjectSGC.Meta.getTypeById(id);
                        if (!otype)
                            return;
                        var name, lon, lat, vol, pstype;
                        var ps = model.getStation(id);
                        if (!ps)
                            return;
                        name = ps.NAME;
                        lon = ps.LONGITUDE;
                        lat = ps.LATITUDE;
                        vol = ps.VOLTAGE_TYPE;
                        pstype = ps.PlantStationType;
                        groups.add([lon, lat, vol, pstype], row);
                    });
                    groups = groups.result;
                    Ysh.Array.each(groups, function (g) {
                        info.push({ height: sz, width: sz, longitude: g.name[0], latitude: g.name[1], voltage: g.name[2], stationType: g.name[3], data: { data: g.data } });
                    });
                }
                if (this.states[type]) {
                    Ysh.Array.each(infos.result, function (info, idx) {
                        map.menu("ShowMutipleIcons", true, { type: type, url: info.name, locateData: info.data });
                    });
                }
            },
            /*
             * options 配置：
             * type:类型，目前支持file和其他
             * file:type="file"时有效，要展示的动态文件名称
             * showTips:其他类型时有效，根据每行数据展示点击图标时提示的数据
             * icon:要显示的图标文件路径，可被getIcon覆盖
             * getIcon:根据数据获取要显示的图标文件路径函数，默认取icon
             * size:图标要显示的大小，可被width和height覆盖
             * width:图标要显示的宽度，可被getWidth覆盖
             * getWidth:根据数据获取要显示的图标的宽度，默认取width
             * height:图标要显示的高度，可被getHeight覆盖
             * pos:坐标获取方式，ps(字符串) -- 厂站，[x,y](数组) -- 列索引，func(函数) -- 根据函数获取
             */
            showMultiple: function (type, data, options) {
                var m = ProjectSGC.Map.getMainObject("MapOpeInst");
                if (!m) return;
                var model = ProjectSGC.Map.getMainObject("ModelList");
                if (!model) return;
                this.initOptions(options);
                var float = ProjectSGC.Map.getMainObject("floatDataInst");
                if (float) {
                    if (options.type == "file")
                        float.registerShowFile(type, options.file);
                    else
                        float.registerShowData(type, options.showTips);
                }
                this.states[type] = true;

                if (Ysh.Type.isArray(options.pos)) {
                    this.showIconsByLonLat(type, m, model, float, data, options.pos[0], options.pos[1], options);
                } else if (Ysh.Type.isFunction(options.pos)) {
                    this.showIconsByFunc(type, m, model, float, data, options.pos, options);
                } else if (options.pos == "ps") {
                    var o = this;
                    model.useAll(function () {
                        o.showStationsIcon(type, m, model, data, options);
                        return;
                        var info = [];
                        if (!options.showTips) {
                            //应该能根据id进行合并
                            Ysh.Array.each(data, function (row, idx) {
                                var id = row.objid;
                                if (!id)
                                    return;
                                var otype = ProjectSGC.Meta.getTypeById(id);
                                if (!otype)
                                    return;
                                var name, lon, lat, vol, pstype;
                                var ps = model.getStation(id);
                                if (!ps)
                                    return;
                                name = ps.NAME;
                                lon = ps.LONGITUDE;
                                lat = ps.LATITUDE;
                                vol = ps.VOLTAGE_TYPE;
                                pstype = ps.PlantStationType;
                                info.push({ height: sz, width: sz, stationid: id, longitude: lon, latitude: lat, voltage: vol, stationType: pstype, data: { data: row } });
                            });
                        } else {
                            var groups = Ysh.Group.create();
                            Ysh.Array.each(data, function (row, idx) {
                                var id = row.objid;
                                if (!id)
                                    return;
                                var otype = ProjectSGC.Meta.getTypeById(id);
                                if (!otype)
                                    return;
                                var name, lon, lat, vol, pstype;
                                var ps = model.getStation(id);
                                if (!ps)
                                    return;
                                name = ps.NAME;
                                lon = ps.LONGITUDE;
                                lat = ps.LATITUDE;
                                vol = ps.VOLTAGE_TYPE;
                                pstype = ps.PlantStationType;
                                groups.add([lon, lat, vol, pstype], row);
                            });
                            groups = groups.result;
                            Ysh.Array.each(groups, function (g) {
                                info.push({ height: sz, width: sz, longitude: g.name[0], latitude: g.name[1], voltage: g.name[2], stationType: g.name[3], data: { data: g.data } });
                            });
                        }
                        if (o.showIconState[type]) {
                            m.menu("ShowMutipleIcons", true, { type: type, url: icon, locateData: info });
                        }
                    });
                } else {
                    return;
                }
            },
        },
        showIconState: {},
        showIcon: function (type, icon, data, fShowTip, sz, imgType) {
            var m = this.getMainObject("MapOpeInst");
            if (!m) return;
            var model = this.getMainObject("ModelList");
            if (!model) return;
            var float = this.getMainObject("floatDataInst");
            if (float) float.registerShowData(type, fShowTip);
            var bTower = this.isLineTower();
            this.showIconState[type] = true;
            var o = this;
            model.useAll(function () {
                var info = [];
                if (!fShowTip) {
                    //应该能根据id进行合并
                    Ysh.Array.each(data, function (row, idx) {
                        var id = row.objid;
                        if (!id)
                            return;
                        var otype = ProjectSGC.Meta.getTypeById(id);
                        if (!otype)
                            return;
                        var name, lon, lat, lineid, stationid;
                        switch (otype) {
                            case "CONVERSUBSTATION":
                            case "SUBSTATION":
                            case "PLANT":
                            case "HVDCGROUNDSTATIO":
                                stationid = id;
                                var ps = model.getStation(id);
                                if (!ps)
                                    return;
                                name = ps.NAME;
                                lon = ps.LONGITUDE;
                                lat = ps.LATITUDE;
                                break;
                            case "ACLINE":
                            case "DCLINE":
                                lineid = id;
                                /*
                                var line = model.getLine(id);
                                if (!line)
                                    return;
                                name = line[1];
                                if (bTower) {
                                    lon = line[2];
                                    lat = line[3];
                                } else {
                                    lon = line[4];
                                    lat = line[5];
                                }*/
                                break;
                        }
                        if (lineid)
                            info.push({ height: sz, width: sz, lineid: lineid, longitude: lon, latitude: lat, data: { data: row } });
                        else
                            info.push({ height: sz, width: sz, stationid: stationid, longitude: lon, latitude: lat, data: { data: row } });
                    });
                } else {
                    var groups = Ysh.Group.create();
                    Ysh.Array.each(data, function (row, idx) {
                        var id = row.objid;
                        if (!id)
                            return;
                        var otype = ProjectSGC.Meta.getTypeById(id);
                        if (!otype)
                            return;
                        var name, lon, lat, lineid;
                        switch (otype) {
                            case "CONVERSUBSTATION":
                            case "SUBSTATION":
                            case "PLANT":
                            case "HVDCGROUNDSTATIO":
                                var ps = model.getStation(id);
                                if (!ps)
                                    return;
                                name = ps.NAME;
                                lon = ps.LONGITUDE;
                                lat = ps.LATITUDE;
                                break;
                            case "ACLINE":
                            case "DCLINE":
                                /*var line = model.getLine(id);
                                if (!line)
                                    return;
                                name = line[1];
                                if (bTower) {
                                    lon = line[2];
                                    lat = line[3];
                                } else {
                                    lon = line[4];
                                    lat = line[5];
                                }*/
                                lineid = id;
                                break;
                        }
                        if (lineid)
                            groups.add([-1, lineid], row);
                        else
                            groups.add([lon, lat], row);
                    });
                    groups = groups.result;
                    Ysh.Array.each(groups, function (g) {
                        var lon = g.name[0];
                        var lat = g.name[1];
                        if (lon == -1)
                            info.push({ height: sz, width: sz, lineid: lat, data: { data: g.data } });
                        else
                            info.push({ height: sz, width: sz, longitude: lon, latitude: lat, data: { data: g.data } });
                    });
                }
                if (o.showIconState[type]) {
                    m.menu("showImageIcon", true, { stopLight: true, time: 0, type: type, images: { height: sz, width: sz, imgCode: 0, imgUrl: icon, imgType: imgType }, locateData: info });
                }
            });
        },
        showMultipleIcon: function (type, icon, data, fShowTip, sz) {
            var m = this.getMainObject("MapOpeInst");
            if (!m) return;
            var model = this.getMainObject("ModelList");
            if (!model) return;
            var float = this.getMainObject("floatDataInst");
            if (float) float.registerShowData(type, fShowTip);
            var bTower = this.isLineTower();
            this.showIconState[type] = true;
            var o = this;
            model.useAll(function () {
                var info = [];
                if (!fShowTip) {
                    //应该能根据id进行合并
                    Ysh.Array.each(data, function (row, idx) {
                        var id = row.objid;
                        if (!id)
                            return;
                        var otype = ProjectSGC.Meta.getTypeById(id);
                        if (!otype)
                            return;
                        var name, lon, lat, vol, pstype;
                        var ps = model.getStation(id);
                        if (!ps)
                            return;
                        name = ps.NAME;
                        lon = ps.LONGITUDE;
                        lat = ps.LATITUDE;
                        vol = ps.VOLTAGE_TYPE;
                        pstype = ps.PlantStationType;
                        info.push({ height: sz, width: sz, longitude: lon, latitude: lat, voltage: vol, stationType: pstype, data: { id: id, data: row } });
                    });
                } else {
                    var groups = Ysh.Group.create();
                    Ysh.Array.each(data, function (row, idx) {
                        var id = row.objid;
                        if (!id)
                            return;
                        var otype = ProjectSGC.Meta.getTypeById(id);
                        if (!otype)
                            return;
                        var name, lon, lat, vol, pstype;
                        var ps = model.getStation(id);
                        if (!ps)
                            return;
                        name = ps.NAME;
                        lon = ps.LONGITUDE;
                        lat = ps.LATITUDE;
                        vol = ps.VOLTAGE_TYPE;
                        pstype = ps.PlantStationType;
                        groups.add([lon, lat, vol, pstype], row);
                    });
                    groups = groups.result;
                    Ysh.Array.each(groups, function (g) {
                        info.push({ height: sz, width: sz, longitude: g.name[0], latitude: g.name[1], voltage: g.name[2], stationType: g.name[3], data: { data: g.data } });
                    });
                }
                if (o.showIconState[type]) {
                    m.menu("ShowMutipleIcons", true, { type: type, url: icon, locateData: info });
                    //m.menu("ShaderGlowMeshForStation", true, { type: type, Info: info });
                }
            });
        },
        showPointIcon: function (type, icon, data, idxLon, idxLat, fShowTip, w, h) {
            var m = this.getMainObject("MapOpeInst");
            if (!m) return;
            var float = this.getMainObject("floatDataInst");
            if (float) float.registerShowData(type, fShowTip);
            var info = [];
            if (fShowTip) {
                var groups = Ysh.Array.groupBy(data, [idxLon, idxLat]);
                Ysh.Array.each(groups, function (g) {
                    info.push({ longitude: g.name[0], latitude: g.name[1], data: { data: g.data } });
                });
            } else {
                Ysh.Array.each(data, function (row) {
                    var lon = row[idxLon];
                    var lat = row[idxLat];
                    info.push({ longitude: lon, latitude: lat, data: { data: row } });
                });
            }
            m.menu("showImageIcon", true, { stopLight: true, time: 0, type: type, images: { imgCode: 0, imgUrl: icon, height: h, width: w }, locateData: info });
        },
        showPointIcons: function (type, fIcon, data, idxLon, idxLat, fShowTip, sz, fPos) {
            var m = this.getMainObject("MapOpeInst");
            if (!m) return;
            var float = this.getMainObject("floatDataInst");
            if (float) float.registerShowData(type, fShowTip);
            var infos = [];
            var icons = [];
            var arrows = [];
            var getDegree = function (row) { if (!fPos) return undefined; return ProjectSGC.Helper.getDegree(fPos(row)); }
            var getSize = function (sz, row) {
                if (Ysh.Type.isFunction(sz)) return sz(row);
                if (sz.width) return sz;
                return { width: sz, height: sz };
            }
            var arrow_icon = "/i/sgc/icon/fire/arrow.png";
            if (fShowTip) {
                var dataGroup = [];
                Ysh.Array.each(data, function (row) {
                    var icon = fIcon(row);
                    var idx = icons.indexOf(icon);
                    if (idx < 0) {
                        icons.push(icon);
                        infos.push([]);
                        dataGroup.push([]);
                        idx = icons.length - 1;
                    }
                    dataGroup[idx].push(row);
                });
                for (var i = 0; i < icons.length; i++) {
                    var d = dataGroup[i];
                    var groups = Ysh.Array.groupBy(d, [idxLon, idxLat]);
                    Ysh.Array.each(groups, function (g) {
                        var degree = getDegree(g.data[0]);
                        var sz1 = getSize(sz, g.data[0]);
                        infos[i].push({ height: sz1.height, width: sz1.width, longitude: g.name[0], latitude: g.name[1], data: { data: g.data }, extendImage: { rotation: degree, imgUrl: arrow_icon, width: 6, height: 6 } });
                        //if (typeof degree != "undefined")
                        //    arrows.push({ rotation: degree, longitude: g.name[0], latitude: g.name[1], data: {} });
                    });
                }
            } else {
                Ysh.Array.each(data, function (row) {
                    var lon = row[idxLon];
                    var lat = row[idxLat];
                    var icon = fIcon(row);
                    var idx = icons.indexOf(icon);
                    if (idx < 0) {
                        icons.push(icon);
                        infos.push([]);
                        idx = icons.length - 1;
                    }
                    var degree = getDegree(row);
                    var sz1 = getSize(sz, row);
                    infos[idx].push({ height: sz1.height, width: sz1.width, longitude: lon, latitude: lat, data: { data: row }, extendImage: { rotation: degree, imgUrl: arrow_icon, width: 6, height: 6 } });
                    //if (typeof degree != "undefined")
                    //    arrows.push({ rotation: degree, longitude: lon, latitude: lat, data: {} });
                });
            }
            for (var i = 0; i < icons.length; i++)
                m.menu("showImageIcon", true, { stopLight: true, time: 0, type: type, images: { imgCode: 0, imgUrl: icons[i] }, locateData: infos[i] });
            //if (arrows.length > 0)
            //    m.menu("showImageIcon", true, { type: type, images: { imgCode: 0, imgUrl: "/i/sgc/icon/fire/arrow.png", z_index: 1, height: 8, width: 8 }, locateData: arrows });
        },
        hideIcon: function (type) {
            var m = this.getMainObject("MapOpeInst");
            if (!m) return;
            m.menu("showImageIcon", false, { type: type });
            m.menu("ShaderGlowMeshForStation", false, { type: type });
            this.showIconState[type] = false;
        },
        getTipsHtml: function (type, id, head, contents) {
            var html = "<div class='map-tip-all'>";
            html += "<img src='/i/sgc/close.gif' class='u-icon-delete'>";
            html += "<div class='map-tip'";
            if (type)
                html += " onclick='ToPostStringMsg(\"" + type + "\",\"" + id + "\")'";
            html += "><div class='head'>" + head + "</div>";
            html += "<div class='sep'></div>"
            Ysh.Array.each(contents, function (content) {
                html += "<div class='" + (content.type || "") + "'>" + (content.html || "") + "</div>";
            });
            html += "</div>";
            html += '<div style = "position:relative;height:16px;" ><div class="map-tip-arrow"></div></div>';
            return html;
        },
        Glow: {
            state: false,
            getColorFunction: function (values, colors) {
                return function (v) {
                    for (var i = 0; i < values.length; i++) {
                        var v0 = values[i];
                        if (i == 0) {
                            if (v <= v0)
                                return colos[i];
                            continue;
                        }
                        if (v < v0)
                            return colos[i];
                    }
                    return colors[values.length];
                };
            },
            getMeasDataFunction: function (colCount, bRate) {
                return bRate ? function (data) {
                    var result = [];
                    colCount = colCount || 60;
                    for (var i = 0; i < data.length; i++) {
                        var row = data[i];
                        var mva = row[colCount + 3];
                        if (!mva) continue;
                        mva = parseFloat(mva);
                        if (!mva) continue;
                        for (var j = colCount - 1; j >= 0; j--) {
                            var v = row[j + 3];
                            if (v === "")//无数据
                                continue;
                            v = parseFloat(v) / mva;
                            result.push({ row: row, value: v });
                            break;
                        }
                    }
                    return result;
                } : function (data) {
                    var result = [];
                    colCount = colCount || 60;
                    for (var i = 0; i < data.length; i++) {
                        var row = data[i];
                        for (var j = colCount - 1; j >= 0; j--) {
                            var v = row[j + 3];
                            if (v === "")//无数据
                                continue;
                            v = parseFloat(v);
                            result.push({ row: row, value: v });
                            break;
                        }
                    }
                    return result;
                }
            },
            hide: function () {
                this.state = false;
                ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showGlowColor", selstate: false });
            },
            show: function (fGetMsg, info, f) {
                this.state = true;
                var msg = fGetMsg();
                if ((msg.length > 0) && this.state)//可能取完数据准备发消息的时候，已经离开了页面，或者关闭了
                //ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showGlowColor", selstate: true, data: msg });
                {
                    var mapmsg = { eventType: "menuope", menuname: "showGlowColor", selstate: true, data: { locateInfo: msg, gradient: info } };
                    if (f)
                        f(mapmsg);
                    ProjectSGC.Map.postMessage(mapmsg);
                }
            },
            getRecentMsg: function (name, sql, fColor, bRate) {
                var data = PDP.read("SGC", sql, []);
                if (!data.check("获取" + name + "数据", true))
                    return [];
                data = data.value;
                var result = data;
                var msg = [];
                for (var i = 0; i < result.length; i++) {
                    var item = result[i];
                    var row = item;
                    var v = parseFloat(row[3]);
                    var id = row[0];
                    var lon = row[1];
                    var lat = row[2];
                    var clr = (Ysh.Type.isFunction(fColor) ? fColor(v, row) : fColor.getColor(v, row));
                    if (clr == "skip")
                        continue;
                    var m = { stationid: id, longitude: lon, latitude: lat, glowColor: clr, data: { value: v } };
                    msg.push(m);
                }
                return msg;
            },
            showRecent: function (name, sql, fColor, bRate, info, f) {
                this.show(function () { return ProjectSGC.Map.Glow.getRecentMsg(name, sql, fColor, bRate); }, info, f);
            },
            getMsgBySQL: function (name, maxTimeSQL, timeDataSQL, fGetData, fColor, bRate) {
                if (!fGetData)
                    fGetData = this.getMeasDataFunction(60, bRate);
                var year = (new Date()).getFullYear();
                var exes = [
                    { type: 'read', db: 'SGC', sql: maxTimeSQL, args: [year] }
                    , { type: 'read', db: 'SGC', sql: timeDataSQL, args: [{ ref: 0, value: 0 }, year] }
                ];
                var data = PDP.exec(exes);
                if (!data.check("获取" + name + "数据", true))
                    return [];
                data = data.value[1];
                var result = fGetData(data);
                var msg = [];
                for (var i = 0; i < result.length; i++) {
                    var item = result[i];
                    var row = item.row;
                    var v = item.value;
                    var id = row[0];
                    var lon = row[1];
                    var lat = row[2];
                    var clr = (Ysh.Type.isFunction(fColor) ? fColor(v, row) : fColor.getColor(v, row));
                    if (clr == "skip")
                        continue;
                    var m = { stationid: id, longitude: lon, latitude: lat, glowColor: clr, data: { value: v } };
                    msg.push(m);
                }
                return msg;
            },
            showBySQL: function (name, maxTimeSQL, timeDataSQL, fGetData, fColor, bRate, info) {
                this.show(function () { return ProjectSGC.Map.Glow.getMsgBySQL(name, maxTimeSQL, timeDataSQL, fGetData, fColor, bRate); }, info);
            },
            showBySQLs: function (name, sqls, fColor, bRate) {
                this.state = true;
                var fGetData = this.getMeasDataFunction(bRate);
                var year = (new Date()).getFullYear();
                var exes = [];
                for (var n = 0; n < sqls.length; n += 2) {
                    exes.push({ type: 'read', db: 'SGC', sql: sqls[n], args: [year] });
                    exes.push({ type: 'read', db: 'SGC', sql: sqls[n + 1], args: [{ ref: n, value: 0 }, year] });
                }
                var data = PDP.exec(exes);
                if (!data.check("获取" + name + "数据", true))
                    return;
                for (var n = 0; n < sqls.length; n += 2) {
                    var data_n = data.value[n + 1];
                    var result = fGetData(data_n);
                    var msg = [];
                    for (var i = 0; i < result.length; i++) {
                        var item = result[i];
                        var row = item.row;
                        var v = item.value;
                        var id = row[0];
                        var lon = row[1];
                        var lat = row[2];
                        var clr = (Ysh.Type.isFunction(fColor) ? fColor(v, row) : fColor.getColor(v, row));
                        if (clr == "skip")
                            continue;
                        var m = { stationid: id, longitude: lon, latitude: lat, glowColor: clr, data: { value: v } };
                        msg.push(m);
                    }
                }
                if (this.state)//可能取完数据准备发消息的时候，已经离开了页面，或者关闭了
                    ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showGlowColor", selstate: true, data: msg });
            },
            showForData: function (name, vm, maxTimeSQL, timeDataSQL, fGetColor) {
                var ud = { d: null, getColor: function (v) { return this.d.getColor(v); } };
                this.showBySQL(name, maxTimeSQL, timeDataSQL, function (data) {
                    var unitRecentData = {
                        colors: ["#FF0000", "#FF507B", "#FF823C", "#FF893C", "#FFFF3C", "#9AFF3C", "#00FFDE", "#00DEFF", "#4DB4FF", "#4D91FF", "#4D4DFF", "#9132FF"],
                        result: null,
                        max: 0,
                        min: 0,
                        diff: 0,
                        setAllData: function (data) {
                            this.result = [];
                            var first = true;
                            for (var i = 0; i < data.length; i++) {
                                var row = data[i];
                                for (var j = 60 - 1; j >= 0; j--) {
                                    var v = row[j + 3];
                                    if (v === "")//无数据
                                        continue;
                                    v = parseFloat(v);
                                    if (first) {
                                        this.max = this.min = v;
                                        first = false;
                                    } else {
                                        if (v > this.max)
                                            this.max = v;
                                        else if (v < this.min)
                                            this.min = v;
                                    }
                                    this.result.push({ row: row, value: v });
                                    break;
                                }
                            }
                            this.diff = (this.max - this.min) / this.colors.length;
                        },
                        getColor: function (v) {
                            return this.colors[parseInt((v - this.min) / this.diff, 10)];
                        },
                        getLegendContent: function () {
                            var arr = [];
                            for (var i = 0; i < this.colors.length; i++) {
                                var start = this.min + i * this.diff;
                                var end = Ysh.Number.toFixed(start + this.diff, 2);
                                start = Ysh.Number.toFixed(start, 2);
                                var color = this.colors[i];
                                arr.push({ color: color, text: start + " - " + end });
                            }
                            return arr;
                        }
                    };
                    ud.d = unitRecentData;
                    unitRecentData.setAllData(data);
                    return unitRecentData.result;
                }, fGetColor || ud);
                if (ud.d)
                    vm.legendContent = ud.d.getLegendContent();
            }
        },
        getLineStationBorder: function (m, lineIds, stationIds) {
            var sMaxMin = {
                mmLon: null, mmLat: null,
                mm: function () {
                    return {
                        min: null, max: null, add: function (v) {
                            v = parseFloat(v);
                            if (this.min === null) { this.min = this.max = v; return; }
                            if (this.max < v) this.max = v;
                            else if (v < this.min) this.min = v;
                        }
                    }
                },
                add: function (s) {
                    if (!s) return;
                    if (s.LONGITUDE && s.LATITUDE) {
                        if (!this.mmLon) this.mmLon = this.mm();
                        this.mmLon.add(s.LONGITUDE);
                        if (!this.mmLat) this.mmLat = this.mm();
                        this.mmLat.add(s.LATITUDE);
                    }
                }, vols: []
            }
            for (var i = 0; i < lineIds.length; i++) {
                var line = m.getLine(lineIds[i]);
                if (!line) continue;
                sMaxMin.vols.push(line[ProjectSGC.LINE.VOLTAGE]);
                sMaxMin.add(m.getStation(line[ProjectSGC.LINE.START_ST]));
                sMaxMin.add(m.getStation(line[ProjectSGC.LINE.END_ST]));
            }
            for (var i = 0; i < stationIds.length; i++) {
                var s = m.getStation(stationIds[i]);
                if (!s) continue;
                sMaxMin.vols.push(s["code"]);
                sMaxMin.add(s);
            }
            if (sMaxMin.mmLon == null) return false;
            return { maxLng: sMaxMin.mmLon.max, minLng: sMaxMin.mmLon.min, maxLat: sMaxMin.mmLat.max, minLat: sMaxMin.mmLat.min, vols: sMaxMin.vols };
        },
        showStationLines: function (lineids, stationids) {
            ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: 'ShowStationLineById', selstate: false, data: { lstStationId: [], lstLineId: [] } });
            if ((lineids.length < 1) && (stationids.length < 1)) return;
            var m = ProjectSGC.Map.getMainObject("ModelList");
            if (!m) return;
            var stations = [];
            var lines = [];
            var lineobjs = [];
            for (var i = 0; i < lineids.length; i++) {
                var lineid = lineids[i];
                var line = m.getLine(lineid);
                if (!line) continue;
                var start_st_id = line[ProjectSGC.LINE.START_ST];
                var end_st_id = line[ProjectSGC.LINE.END_ST];
                var start_st_obj = m.getStation(start_st_id);
                if (start_st_obj) {
                    var start_st = Ysh.Object.clone(start_st_obj);
                    delete start_st.data.owner;
                    stations.push(start_st);
                }
                var end_st_obj = m.getStation(end_st_id);
                if (end_st_obj) {
                    var end_st = Ysh.Object.clone(end_st_obj);
                    delete end_st.data.owner;
                    stations.push(end_st);
                }
                var l = m.getShowLine(line[0]);
                if (l) {
                    l = Ysh.Object.clone(l);
                    delete l.data.owner;
                    lines.push(l);
                    lineobjs.push(line);
                }
            }
            for (var i = 0; i < stationids.length; i++) {
                var stid = stationids[i];
                var s = m.getStation(stid);
                if (!s) continue;
                var station = Ysh.Object.clone(s);
                delete station.data.owner;
                stations.push(station);
            }
            ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: 'ShowStationLineById', selstate: true, data: { lstStationId: stations, lstLineId: lines } });
            return [lineobjs, stations];
        }
    },
    EChart: {
        Colors: {
            BG: "#585858",
            AXIS_LABEL: "#BBBBBB",
            AXIS_NAME: "#BBBBBB",
            TEXT: "white"
        },
        Size: { MARGIN: 20 },
        setSingleAxisOption: function (axis) {
            if (axis.name) {
                if (!axis.nameTextStyle)
                    axis.nameTextStyle = {};
                axis.nameTextStyle.color = ProjectSGC.EChart.Colors.AXIS_NAME;
            }
            if (!axis.axisLabel)
                axis.axisLabel = {};
            if (axis.axisLabel.show !== false) {
                axis.axisLabel.color = ProjectSGC.EChart.Colors.AXIS_LABEL;
            }
        },
        doForArrayOrOne: function (o, f) {
            if (!o)
                return;
            if (o instanceof Array) {
                for (var i = 0; i < o.length; i++)
                    f(o[i]);
            } else {
                f(o);
            }
        },
        setCommonOption: function (option) {
            if (!option.backgroundColor)
                option.backgroundColor = this.Colors.BG;
            this.doForArrayOrOne(option.xAxis, this.setSingleAxisOption);
            this.doForArrayOrOne(option.yAxis, this.setSingleAxisOption);
            this.doForArrayOrOne(option.series, function (s) { s.hoverAnimation = false; });
            return option;
        },
        getTemperatureLabel: function (offset) {
            return {
                show: true, position: "top", offset: offset || [0, 0]
                , formatter: function (v) {
                    return v.value + "°";
                }
            };
        },
        getPieOption: function (title, name, data, typeIdx, valueIdx) {
            if (typeof typeIdx == "undefined") typeIdx = 0;
            if (typeof valueIdx == "undefined") valueIdx = typeIdx + 1;
            var types = [];
            var sData = [];
            for (var i = 0; i < data.length; i++) {
                var row = data;
                types.push(row[typeIdx]);
                sData.push({ value: row[valueIdx], name: row[typeIdx] });
            }
            var option = {
                "legend": { "show": false },
                "tooltip": {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                "grid": {}, "xAxis": [{ "type": "category" }], "yAxis": [{ "type": "value" }],
                "series": [{
                    "name": "所有厂站", "type": "pie", minAngle: 5, avoidLabelOverlap: true, "label": { "formatter": "{d}% {b}", "fontSize": SGC.FONTSIZE * 0.8 }
                    , "radius": ["48%", "71%"],
                    "itemStyle": {
                        normal: {

                            labelLine: {
                                show: true,
                                length: 0.1
                            }
                        }
                    }
                }]
            };
            return option;
        }
    },
    Weather: {
        getImg: function (type, time) {
            var path = "/i/sgc/tq/";
            switch (type) {
                case '':
                case '晴':
                    return path + "qing.png";
                case '多云':
                    return path + "duoyun.png";
                case '小雨':
                    return path + "xiaoyu.png";
                case '雨':
                case '阵雨':
                case '雷阵雨':
                case '冻雨':
                case '中雨':
                case '大雨':
                case '暴雨':
                case '大暴雨':
                case '特大暴雨':
                    return path + "yu.png";
                case '阴':
                case '冰雹':
                case '雨夹雪':
                case '雷暴':
                case '雪':
                case '阵雪':
                case '小雪':
                case '中雪':
                case '大雪':
                case '暴雪':
                case '雾霾':
                case '雾':
                case '霾':
                case '沙尘':
                case '沙尘暴':
                case '浮尘':
                case '扬沙':
                case '强沙尘暴':
                case '风':
                case '大风':
                case '狂风':
                case '龙卷风':
                case '台风':
                case '飙线风':
                default:
                    return path + "yin.png";
            }
        },
        getOption24: function () {
            var xtime = [];
            var arrTemperature = [];
            var arrType = [];
            var arrAir = [];
            var arrWind = [];
            var arrZero = [];
            for (var i = 0; i < 24; i++) {
                xtime.push(((i < 10) ? "0" : "") + i);
                arrTemperature.push(parseInt(100 * Math.random(), 10) % 30);
                arrType.push(parseInt(100 * Math.random(), 10) % 10);
                arrAir.push(parseInt(100 * Math.random(), 10) % 100);
                arrWind.push(parseInt(100 * Math.random(), 10) % 12);
                arrZero.push(0);
            }

            var timeData = xtime;

            return ProjectSGC.EChart.setCommonOption({
                axisPointer: {
                    link: { xAxisIndex: 'all' },
                    label: {
                        backgroundColor: '#777'
                    }
                },
                grid: [{//180
                    left: 50,
                    right: ProjectSGC.EChart.Size.MARGIN,
                    top: 10,
                    height: 80
                }, {
                    left: 50,
                    right: ProjectSGC.EChart.Size.MARGIN,
                    bottom: 60,
                    height: 30
                }, {
                    left: 50,
                    right: ProjectSGC.EChart.Size.MARGIN,
                    bottom: 30,
                    height: 30
                }],
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: timeData,
                        show: false
                    },
                    {
                        gridIndex: 1,
                        type: 'category',
                        show: true,
                        data: timeData,
                        boundaryGap: false,
                        name: '空气',
                        nameLocation: 'start',
                        axisLabel: { show: false },
                        axisLine: { show: false },
                        axisTick: { show: false }
                    },
                    {
                        gridIndex: 2,
                        type: 'category',
                        boundaryGap: false,
                        data: timeData,
                        position: 'left',
                        name: '风力',
                        nameLocation: 'start',
                        axisLine: { show: false },
                        axisTick: { show: false },
                        axisLabel: { color: "white" }
                    }
                ],
                yAxis: [
                    {
                        name: '',
                        type: 'value',
                        axisLine: { show: false },
                        axisTick: { show: false },
                        splitLine: { show: false }
                    },
                    {
                        gridIndex: 1,
                        name: '空气',
                        type: 'value',
                        min: 0,
                        max: 0.2,
                        show: false
                    },
                    {
                        gridIndex: 2,
                        name: '风力',
                        type: 'value',
                        min: 0,
                        max: 0.2,
                        show: false
                    }
                ],
                series: [
                    {
                        name: '温度',
                        type: 'line',
                        symbolSize: 0,
                        data: arrTemperature,
                        color: '#D4D4D4',
                        smooth: true
                    },
                    {
                        name: '空气',
                        color: '#8C6A2A',
                        type: 'scatter',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        symbol: 'rect',
                        symbolSize: [20, 4],
                        data: arrZero,
                        label: {
                            show: true,
                            position: 'top',
                            distance: 1,
                            color: ProjectSGC.EChart.Colors.TEXT,
                            formatter: function (params) {
                                return arrAir[params.dataIndex];
                            }
                        }
                    },
                    {
                        name: '风力',
                        color: '#4A6A74',
                        type: 'scatter',
                        xAxisIndex: 2,
                        yAxisIndex: 2,
                        symbol: 'rect',
                        symbolSize: [20, 4],//function (value, params) {                            return [arrWind[params.dataIndex], 8];                        },
                        data: arrZero,
                        label: {
                            show: true,
                            position: 'top',
                            distance: 1,
                            color: ProjectSGC.EChart.Colors.TEXT,
                            formatter: function (params) {
                                return arrWind[params.dataIndex] + "级";
                            }
                        }
                    }
                ]
            });
        },
        getOption15: function () {
            var xtime = [];
            var arrMaxTemp = [];
            var arrMaxType = [];
            var arrMinTemp = [];
            var arrMinType = [];
            var arrWindD = [];
            var arrWindP = [];
            var arrZero = [];
            var arrZero0 = [];
            arrMinType = arrMaxType = ["晴", "多云", "阴", "雨", "阵雨", "雷阵雨", "冰雹", "雨夹雪", "雨", "阵雨", "雷阵雨", "冰雹", "雨夹雪", "冻雨", "小雨"];
            arrMaxTemp = [14, 15, 13, 17, 29, 24, 30, 16, 18, 12, 34, 20, 11, 30, 20];
            arrMinTemp = [4, 5, 3, 7, 9, 4, 0, 6, 8, 2, 4, 2, 1, 3, 2];
            var arrMaxType1 = [];
            var arrMinType1 = [];
            for (var i = 0; i < 15; i++) {
                xtime.push("2019-05-" + ((i < 9) ? "0" : "") + (i + 1));
                arrWindD.push(["西南风", "东南风", "西北风"][i % 3]);
                arrWindP.push(["3", "5", "2"][i % 3]);
                arrZero.push(0);
                arrMaxType1.push({ value: 0, symbol: "image://" + ProjectSGC.Weather.getImg(arrMaxType[i]) });
                arrMinType1.push({ value: 0, symbol: "image://" + ProjectSGC.Weather.getImg(arrMinType[i]) });
            }

            var timeData = xtime;

            return ProjectSGC.EChart.setCommonOption({
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        animation: false
                    }
                },
                axisPointer: {
                    link: { xAxisIndex: 'all' },
                    label: {
                        backgroundColor: '#777'
                    }
                },
                grid: [{//180
                    left: ProjectSGC.EChart.Size.MARGIN,
                    right: ProjectSGC.EChart.Size.MARGIN,
                    top: 130,
                    height: 100
                }, {
                    left: ProjectSGC.EChart.Size.MARGIN,
                    right: ProjectSGC.EChart.Size.MARGIN,
                    top: 0,
                    height: 100
                }, {
                    left: ProjectSGC.EChart.Size.MARGIN,
                    right: ProjectSGC.EChart.Size.MARGIN,
                    top: 280,
                    height: 100
                }],
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: timeData,
                        show: false
                    },
                    {
                        gridIndex: 1,
                        type: 'category',
                        boundaryGap: false,
                        data: timeData,
                        show: false
                    },
                    {
                        gridIndex: 2,
                        type: 'category',
                        boundaryGap: false,
                        data: timeData,
                        show: false
                    }
                ],
                yAxis: [
                    {
                        name: '高',
                        type: 'value',
                        show: false
                    },
                    {
                        gridIndex: 1,
                        name: '温度',
                        type: 'value',
                        min: 0,
                        max: 0.2,
                        show: false
                    },
                    {
                        gridIndex: 2,
                        name: '低',
                        type: 'value',
                        min: 0,
                        max: 0.2,
                        show: false,
                        inverse: true
                    }
                ],
                series: [
                    {
                        name: '',
                        type: 'line',
                        symbolSize: 4,
                        data: arrMaxTemp,
                        color: '#D7A75D',
                        smooth: true
                    },
                    {
                        name: '',
                        type: 'line',
                        symbolSize: 4,
                        data: arrMinTemp,
                        color: '#1B8DC4',
                        smooth: true
                    },
                    {
                        name: '高',
                        color: '#8C6A2A',
                        type: 'scatter',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        symbolSize: [20, 20],
                        data: arrMaxType1,
                        label: {
                            show: true,
                            position: 'top',
                            distance: 1,
                            color: 'white',
                            formatter: function (params) {
                                var n = params.dataIndex;
                                return Ysh.Time.formatString(xtime[n], "周[w]\n[m]/[d]") + "\n" + arrMaxType[n];
                            }
                        }
                    },
                    {
                        name: '低',
                        color: '#4A6A74',
                        type: 'scatter',
                        xAxisIndex: 2,
                        yAxisIndex: 2,
                        symbolSize: [20, 20],
                        data: arrMinType1,
                        label: {
                            show: true,
                            position: 'bottom',
                            distance: 1,
                            color: 'white',
                            formatter: function (params) {
                                var n = params.dataIndex;
                                return arrMinType[n] + "\n" + arrWindD[n] + "\n" + arrWindP[n] + "级";
                            }
                        }
                    }
                ]
            });
        },
        test: function () {
            var xtime = [];
            var arrTemperature = [];
            var arrType = [];
            var arrAir = [];
            var arrWind = [];
            var arrZero = [];
            for (var i = 0; i < 24; i++) {
                xtime.push(((i < 10) ? "0" : "") + i);
                arrTemperature.push(parseInt(100 * Math.random(), 10) % 30);
                arrType.push(parseInt(100 * Math.random(), 10) % 10);
                arrAir.push(parseInt(100 * Math.random(), 10) % 100);
                arrWind.push(parseInt(100 * Math.random(), 10) % 12);
                arrZero.push(0);
            }
            /*
        {
            type : 'category',
            boundaryGap : false,
            axisLine: {onZero: true},
            data: timeData
        },
        {
            gridIndex: 1,
            type : 'category',
            boundaryGap : false,
            axisLine: {onZero: true},
            data: timeData,
            position: 'top'
        }
             */
            return {
                xAxis: [{
                    type: 'category', data: xtime, boundaryGap: false,
                    axisLine: { onZero: true }, axisTick: { show: true, inside: false, alignWithLabel: true }
                },
                //{ gridIndex: 1, name: "空气", boundaryGap: false, data: arrAir, axisTick: { show: false } },
                {
                    gridIndex: 1, name: "风力", boundaryGap: false,
                    axisLine: { onZero: true }, data: arrWind, axisTick: { show: false }
                }],
                axisPointer: {
                    link: { xAxisIndex: 'all' }
                },
                grid: [{
                    left: 50,
                    right: 50,
                    height: '35%'
                }, {
                    left: 50,
                    right: 50,
                    top: '55%',
                    height: '35%'
                }],
                yAxis: [{ name: "" }],
                series: [{
                    data: arrTemperature,
                    type: 'line',
                    //lineStyle: { opacity: 0 },
                    // }, {
                    //        data: arrZero,
                    //        type:'scatter'
                }, {
                    data: arrZero,
                    type: 'scatter'
                }]
            };
        }
    },
    Index: {
        showJxp: function (dts) {
            var lst = null;
            if (dts instanceof Array) {
                lst = PDP.read("SGC", "sgc/jx:GetRangeList", dts);
            } else {
                dts = [dts || Ysh.Time.formatString(new Date(), "111000")];
                lst = PDP.read("SGC", "sgc/jx:GetDayList", dts);
            }
            if (!lst.check("获取检修申请数据", true))
                return;
            lst = lst.value;
            var data = [];
            for (var i = 0; i < lst.length; i++) {
                var row = lst[i];
                var id = row[0];
                var stime = row[1];
                var etime = row[2];
                var content = row[3];
                var rstime = row[7];
                var retime = row[8];
                var devid = row[9];
                var devtype = row[10];
                var devname = row[11];
                var staid = row[12];
                var lat = parseFloat(row[13]);
                var lon = parseFloat(row[14]);
                var contents = [{ type: "time", html: "计划时间：" + Ysh.Time.getRangeString(stime, etime) }];
                if (rstime != "")
                    contents.push({ type: "time", html: "实际时间：" + Ysh.Time.getRangeString(rstime, retime) });
                var html = ProjectSGC.Map.getTipsHtml("showJxp", id, devname + ":" + content, contents);
                if ((devtype == "ACLINE") || (devtype == "DCLINE")) {
                    data.push({ lineid: devid, html: html });
                } else {
                    data.push({ stationid: staid, longitude: lon, latitude: lat, html: html });
                }
            }
            ProjectSGC.Map.postMessage({
                eventType: "menuope"
                , menuname: "showWarnInfo"
                , data: data
            });
        },
        showYjNotice: function (dts) {
            var lst = null;
            if (dts instanceof Array) {
                lst = lst = PDP.dll("SGCLib:SGCLib.WarnNotice.GetRangeList", dts);
            } else {
                dts = [dts || Ysh.Time.formatString(new Date(), "111000")];
                lst = lst = PDP.dll("SGCLib:SGCLib.WarnNotice.GetDayList", dts);
            }
            if (!lst.check("获取风险预警通知单数据", true))
                return;
            lst = lst.value[0];
            var data = [];
            for (var i = 0; i < lst.length; i++) {
                var row = lst[i];
                var id = row[0];
                var stime = row[1];
                var etime = row[2];
                var zt = row[3];
                var type = row[4];
                var objid = row[5];
                var html = "<div class='map-tip-all'>";
                html += "<img src='/i/sgc/close.gif' class='u-icon-delete'>";
                html += "<div class='map-tip' onclick='ToPostStringMsg(\"showYjNotice\",\"" + id + "\")'><div class='head'>" + zt + "</div>";
                html += "<div class='sep'></div>"
                html += "<div class='time'>时间：" + Ysh.Time.getRangeString(stime, etime) + "</div>";
                html += "</div>";
                html += '<div style = "position:relative;height:16px;" ><div class="map-tip-arrow"></div></div>';
                if (type == "LINE") {
                    data.push({ lineid: objid, html: html });
                } else {
                    data.push({ stationid: objid, html: html });
                }
            }
            ProjectSGC.Map.postMessage({
                eventType: "menuope"
                , menuname: "showWarnInfo"
                , data: data
            });
        },
        showTingDian: function (show, t, v) {
            ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showTingdianTrack", selstate: false, data: { trackType: "tingdian" } });
            ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "changeLineColor", selstate: false, data: { type: "tingdian", lineIDs: [] } });
            if (!t)
                SearchCommon.CloseSearch();
            if (!show) {
                return;
            }
            if (!t) {
                $("#divContent").show();
                $("#divContentClose").show();
                SearchCommon.showContentCloseImage();
                var jq = $(".RDiv").children().clone();
                $("#divContent").prepend(jq);
                var $robotReply = getRecentReply();
                $robotReply.find(".RSayContent").html("<a target='_blank' href='http://iesweb.dcloud.sd.dc.sgcc.com.cn:8081/tingdian.html' style='color:blue;text-decoration:underline;'>打开停电详情</a>");
                $('#divContent').scrollTop(0);
            }
            var dts = Ysh.Time.formatString(new Date(), "111000");
            var lst;
            switch (t) {
                case "vol":
                    lst = PDP.read("SGC", "sgc/tingdian:GetTingDianByVol", [dts, v]);
                    break;
                case "org":
                    lst = PDP.read("SGC", "sgc/tingdian:GetTingDianByOrg", [dts, v]);
                    break;
                default:
                    lst = PDP.read("SGC", "sgc/tingdian:GetTingDianData", [dts, dts + " 23:59:59"]);
                    break;
            }
            if (!lst.check("获取停电数据", true))
                return;
            var bTower = ProjectSGC.Map.isLineTower();
            lst = lst.value;
            var dataFault = [];
            var dataPlan = [];
            var lineids = [];
            for (var i = 0; i < lst.length; i++) {
                var data = lst[i];
                lineids.push(data[1]);
                this.getLinePosition(data, bTower);
                if (data[0] == "0" || data[0] == "3") {//计划
                    dataPlan.push({ longitude: parseFloat(data[2]), latitude: parseFloat(data[3]), volvalue: "500", data: { lineid: data[1], type: "showTingDian" } });
                }
                else if (data[0] == "1" || data[0] == "2") {//故障
                    dataFault.push({ longitude: parseFloat(data[2]), latitude: parseFloat(data[3]), volvalue: "500", data: { lineid: data[1], type: "showTingDian" } });
                }
            }

            if (dataFault.length > 0) {
                //ProjectSGC.Map.postMessage({locateType: 11, plantstationtype: "highrisk", locateItem: dataFault});
                ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showTingdianTrack", selstate: true, data: { locateItem: dataFault, plantstationtype: "highrisk", trackType: "tingdian" } });
            }
            if (dataPlan.length > 0) {
                //ProjectSGC.Map.postMessage({locateType: 11, plantstationtype: "repair", locateItem: dataPlan});
                ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showTingdianTrack", selstate: true, data: { locateItem: dataPlan, plantstationtype: "repair", trackType: "tingdian" } });
            }
            if (lineids.length > 0)
                ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "changeLineColor", selstate: true, data: { type: "tingdian", lineIDs: lineids } });
        },
        getLinePosition: function (data, bTower) {
            if (bTower) {
                data[2] = data[4];
                data[3] = data[5];
            }
        }
    },
    Service: {
        getResult: function (ret, field) {
            var v = {};
            eval("v = " + ret);
            //var v = JSON.parse(ret);
            if (v.code !== undefined) {
                if (v.code != 200) {
                    alert(v.message);
                } else {
                    return v[field || "result"];
                }
            }
        },
        to2d: function (objList, fields) {
            var lst = [];
            if (!objList)
                return lst;
            if (!(fields instanceof Array))
                fields = fields.split(',');
            for (var i = 0; i < objList.length; i++) {
                var item = objList[i];
                var row = [];
                for (var j = 0; j < fields.length; j++) {
                    var field = fields[j];
                    if (field == "_index_")
                        row.push(i);
                    else if (field instanceof Function) {
                        row.push(field(item, i));
                    } else
                        row.push(item[fields[j]]);
                }
                lst.push(row);
            }
            return lst;
        },
        ret: function (desc, v) {
            if (v.check(desc, true)) {
                return this.getResult(v.value[0]);
            }
        },
        get: function (desc, type, query, f) {
            var dll = "SGCLib:SGCLib.Service.Get";
            if (f) {
                var o = this;
                PDP.dll(dll, [type, query], function (ret) {
                    var v = o.ret(desc, ret);
                    if (v !== undefined)
                        f(v);
                }, false);
            } else {
                return this.ret(desc, PDP.dll(dll, [type, query]));
            }
        }
    },
    String: {
        toHourStr: function (h) { return ((h < 10) ? '0' : '') + h; },
        toMinuteStr: function (h, m) { return ((h < 10) ? '0' : '') + h + ':' + ((m < 10) ? '0' : '') + m; }
    },
    Meta: {
        all: {
            "1405": { type: "ACFILTER" },
            "1201": { type: "ACLINE" },
            "1210": { type: "ACLINEEND" },
            "1202": { type: "ACLINESEG" },
            "1325": { type: "ARCSUPPRESSIONCO" },
            "1328": { type: "ARRESTER" },
            "0121": { type: "BAY" },
            "1321": { type: "BREAKER" },
            "1512": { type: "BRIDGEREACTOR" },
            "1301": { type: "BUSBAR" },
            "0411": { type: "BUSGROUP" },
            "1513": { type: "CHOPPER" },
            "0712": { type: "COMPCABINET" },
            "0711": { type: "COMPROOM" },
            "0403": { type: "CONNECTIONLINE" },
            "1315": { type: "CONTRANSFM" },
            "1316": { type: "CONTRANSFMWD" },
            "0402": { type: "CONTROLAREA" },
            "0113": { type: "CONVERSUBSTATION" },
            "0154": { type: "CONVERTER" },
            "1549": { type: "CONVERTER" },
            "1501": { type: "CONVVALVE" },
            "1313": { type: "CT" },
            "1514": { type: "DAMPER" },
            "0705": { type: "DATANET" },
            "0715": { type: "DATANETNODE" },
            "1506": { type: "DCBREAKER" },
            "1505": { type: "DCCT" },
            "1507": { type: "DCDIS" },
            "1511": { type: "DCFILTER" },
            "1530": { type: "DCGROUND" },
            "1508": { type: "DCGROUNDDIS" },
            "1208": { type: "DCGROUNDLINE" },
            "1206": { type: "DCLINE" },
            "1211": { type: "DCLINEEND" },
            "1207": { type: "DCLINESEG" },
            "0153": { type: "DCPOLE" },
            "1504": { type: "DCPT" },
            "1510": { type: "DCWAVETRAPPER" },
            "3403": { type: "DEV_VERSION" },
            "1322": { type: "DIS" },
            "0405": { type: "DISTRIBUTEDST" },
            "0412": { type: "ELECTRICALPROJECT" },
            "3402": { type: "EQUIP_DEV" },
            "1101": { type: "GENERATOR" },
            "0410": { type: "GENTRANGROUP" },
            "1323": { type: "GROUNDDIS" },
            "1324": { type: "GROUNDIMPEDANCE" },
            "1329": { type: "HANDCART" },
            "0114": { type: "HVDCGROUNDSTATION" },
            "0152": { type: "HVDCGROUNDSYS" },
            "0151": { type: "HVDCPOLESYS" },
            "0150": { type: "HVDCSYS" },
            "0155": { type: "INGROUDST" },
            "1104": { type: "INVERTER" },
            "2104": { type: "IRRADIATOR" },
            "0408": { type: "LOAD" },
            "3401": { type: "MAIN_AUX" },
            "0701": { type: "MASTERAS" },
            "0713": { type: "MSNODE" },
            "0111": { type: "PLANT" },
            "1520": { type: "POLEBUSBAR" },
            "1314": { type: "PT" },
            "0101": { type: "PWRGRID" },
            "1311": { type: "PWRTRANSFM" },
            "0409": { type: "RUNMODE" },
            "0406": { type: "SAMETOWERLINE" },
            "0401": { type: "SECTION" },
            "1327": { type: "SERIESCAPACITOR" },
            "1331": { type: "SERIESPWRTRANSFM" },
            "1326": { type: "SERIESREACTOR" },
            "1332": { type: "SERIESTRANSFMWD" },
            "1402": { type: "SHUNTCAPACITOR" },
            "1401": { type: "SHUNTREACTOR" },
            "0702": { type: "SLAVEAS" },
            "1503": { type: "SMOOTHREACTOR" },
            "0714": { type: "SSNODE" },
            "0112": { type: "SUBSTATION" },
            "1403": { type: "SVC" },
            "1404": { type: "SVG" },
            "1406": { type: "SYNCCONDENSER" },
            "1333": { type: "TBS" },
            "1204": { type: "TLINE" },
            "1212": { type: "TLINEEND" },
            "1203": { type: "TNODE" },
            "1209": { type: "TOWER" },
            "0404": { type: "TRANSCHANNEL" },
            "1312": { type: "TRANSFMWD" },
            "0407": { type: "UHVPROJECT" },
            "1334": { type: "UPFCACSWITCH" },
            "1521": { type: "UPFCBUSBAR" },
            "0158": { type: "UPFCCONVERTER" },
            "1509": { type: "UPFCDCSWITCH" },
            "0156": { type: "UPFCSYS" },
            "0157": { type: "UPFCUNIT" },
            "1502": { type: "VSCONVVALVE" },
            "2103": { type: "WINDTOWER" }
        },
        getTypeById: function (id) {
            var o = this.all[id.substring(0, 4)];
            if (o)
                return o.type;
            return "";
        }
    },
    Global: {
        main: {},
        getMainObject: function (id, def) {
            if (!this.main[id]) {
                this.main[id] = def;
                var p = (window.opener ? window.opener : window);
                try {
                    p.location.href;
                } catch (err) {
                    p = window;
                }
                while (true) {
                    var o = p[id];
                    if (o) {
                        this.main[id] = o;
                        break;
                    }
                    if (p == p.parent) {
                        p = p.opener;
                    } else {
                        p = p.parent;
                    }
                    if (p == null)
                        break;
                }
            }
            return this.main[id];
        },
        getVoltages: function () {
            return this.getMainObject("menuData").getSelectedVoltageCodes();
        },
        getGrid: function () {
            var isOutZone = this.getMainObject("userSettings").itemShowInNet.value;
            if (isOutZone == "1") return ProjectSGC.Const.GRID_GD;
            return this.getMainObject("SelectCityInst").getLocateGrid();
        },
        getDcc: function () {
            var isOutZone = this.getMainObject("userSettings").itemShowInNet.value;
            if (isOutZone == "1") return ProjectSGC.Const.DCC_GD;
            return this.getMainObject("SelectCityInst").getLocateDcc();
        },
        getOwner: function () {
            var isOutZone = this.getMainObject("userSettings").itemShowInNet.value;
            if (isOutZone == "1") return ProjectSGC.Const.OWNER_GD;
            return this.getMainObject("SelectCityInst").getLocateOwner();
        },
        getStates: function () {
        },
        getPSTypes: function () {
        },
        addTreeData: function (ids, tree, data, isRoot, bOwner) {
            if (data.Level == "1005")
                return;
            if (data.Level != "1004") {
                if (!data.Children) return;
                if (data.Children.length == 0)
                    return;
            }
            ids.push(data.ID);
            tree.push([data.ID, data.Name, isRoot ? "" : data.ParentID, data.Level]);
            if ((!data.Children) || bOwner) return;
            for (var i = 0; i < data.Children.length; i++) {
                this.addTreeData(ids, tree, data.Children[i]);
            }
        },
        getGridTreeData: function (pgid) {
            var s = ProjectSGC.Global.getMainObject("SelectCityInst");
            var tree = [];
            var ids = [];
            var shows = [["华北", "北京", "天津", "冀北", "河北", "山西", "山东", "蒙西"]
                , ["华东", "上海", "江苏", "浙江", "安徽", "福建"]
                , ["华中", "湖北", "湖南", "河南", "江西"]
                , ["东北", "辽宁", "吉林", "黑龙江", "蒙东"]
                , ["西北", "陕西", "甘肃", "青海", "宁夏", "新疆"]
                , ["西南", "四川", "重庆", "西藏"]
            ];
            if (pgid == "0101990100") {
                var grids = s.data;
                ids = ["0101990100"];
                tree = [["0101990100", "国家电网", "", "1001"]];
                //for (var i = 0;i < grids.length;i++)
                //  this.addTreeData(ids,tree,grids[i]);
                for (var i = 0; i < shows.length; i++) {
                    var depts = shows[i];
                    for (var j = 0; j < depts.length; j++) {
                        var dept = depts[j];
                        this.addTreeData(ids, tree, s.getCityByName(dept), false, j == 0);
                    }
                }
            } else {
                var city = s.findCity(s.data, pgid);
                if (city.Level == "1002") {
                    for (var i = 0; i < shows.length; i++) {
                        var depts = shows[i];
                        var name = depts[0];
                        if (city.Name.substr(0, name.length) != name)
                            continue;
                        for (var j = 0; j < depts.length; j++) {
                            var dept = depts[j];
                            this.addTreeData(ids, tree, s.getCityByName(dept), j == 0, j == 0);
                        }
                    }
                } else
                    this.addTreeData(ids, tree, city, true);
            }
            var options = {
                expand: true, autoselect: false, fExpand: function (node) {
                    node.checked = true;
                    var level = "";
                    if (node.__data)
                        level = node.__data[3];
                    return (level == "1001") || (level == "1002");
                }
            };
            return [options, tree, ids];
        }
    },
    getVolValue: function (vol) {
        var v;
        if (vol.substr(0, 1) == "±") {
            v = -parseInt(vol.substr(1, vol.length - 3), 10);
        } else
            v = parseInt(vol.substr(0, vol.length - 2), 10);
        if (isNaN(v))
            return 0;
        return v;

    },
    require: function (type) {
        if (Ysh.Type.isArray(type)) {
            for (var i = 0; i < type.length; i++)
                this.require(type[i]);
            return;
        }
        var t = type.toLowerCase();
        if (this[t])
            return;
        this[t] = true;
        switch (t) {
            case "voltage":
                this.Voltage = Ysh.Object.combine(ProjectSGC.Dict.create("电压等级",
                    function (v) {
                        var vol = v[1];
                        if (!vol.endsWith("kV"))
                            return null;
                        var vv = ProjectSGC.getVolValue(vol);
                        if (vv == 0)
                            return null;
                        return { id: v[0], key: v[0], isDc: (vv < 0), value: Math.abs(vv), text: vol, name: vol };
                    }, "sgc/sgc:GetVoltage"),
                    {
                        isInGroup: function (v, g) {
                            switch (g) {
                                case 1://DC
                                    return v.isDc;
                                case 2://UHV
                                    if (v.isDc)
                                        return (v.value == 1100) || (v.value == 800);
                                    return v.value == 1000;
                                case 3://EHV
                                    if (v.isDc)
                                        return true;
                                    return v.value >= 500;
                                case 4://220kV++
                                    if (v.isDc)
                                        return true;
                                    return v.value >= 220;
                                case 5://110kV-
                                    if (v.isDc)
                                        return false;
                                    return v.value <= 110;
                            }
                            return false;
                        },
                        getName: function (code) { var vol = this[code]; return (vol ? vol.name : ""); }
                    });
                this.Voltage.load();
                return;
            case "grid":
                this.Grid = Ysh.Object.combine(ProjectSGC.Dict.create("电网",
                    function (g) { return { id: g[0], key: g[0], text: g[1], name: g[1], pid: g[2], level: g[3] } }, "sgc/main:GetPwrGrid"),
                    {
                        getName: function (id) { var o = this[id]; return (o ? o.name : ""); }
                    });
                this.Grid.load();
                return;
            case "gridlevel":
                this.GridLevel = Ysh.Object.combine(ProjectSGC.Dict.create("电网等级",
                    function (l) { return { code: l[0], name: l[1] } }, "sgc/sgc:GetGridLevel", null, "code"),
                    {
                        getName: function (code) { var o = this[code]; return (o ? o.name : ""); }
                    });
                this.GridLevel.load();
        }
    },
    toSelectList: function (dict, idList, name, scol, dtype, stype) {
        name = name || "name";
        var ret = [];
        for (var i = 0; i < idList.length; i++) {
            var id = idList[i];
            var s = Ysh.Object.a(dict[id], name);
            if (!s)
                continue;
            ret.push([id, s]);
        }
        if (typeof scol != undefined) {
            var f = Ysh.Compare.getComparison(dtype);
            var n = (stype == "desc") ? -1 : 1;
            ret.sort(function (x, y) { return n * f(x[scol], y[scol]) });
        }
        return ret;
    },
    Assist: {
        Owner: {
            isEqual: function (o1, o2) {
                if (o1.length < 4) return false;
                if (o2.length < 4) return false;
                return o1.substr(4) == o2.substr(4);
            }
        },
        Station: {
            isOwner: function (station, owner) {
                if (!station) return false;
                for (var i = 0; i < station.data.owner.length; i++) {
                    var o = station.data.owner[i];
                    if (ProjectSGC.Assist.Owner.isEqual(o, owner)) return true;
                }
                return false;
            },
        },
        Line: {
            isOwner: function (m, line, owner) {
                var start_st_id = line[ProjectSGC.LINE.START_ST];
                if (start_st_id) {
                    if (ProjectSGC.Assist.Station.isOwner(m.getStation(start_st_id), owner))
                        return true;
                }
                var end_st_id = line[ProjectSGC.LINE.END_ST];
                if (!end_st_id) return false;
                return ProjectSGC.Assist.Station.isOwner(m.getStation(end_st_id), owner);
            }
        },
        Ganta: {
            getNo: function (no) {
                if (!no) return no;
                no = no.toString();
                if (no.endsWith(".00")) return no.substr(0, no.length - 3);
                return no;
            }
        }
    },
    Helper: {
        getDegree: function (pos) {
            switch (pos) {
                case "东": return 90;
                case "南": return 180;
                case "西": return 270;
                case "北": return 0;
                case "东南": return 135;
                case "东北": return 45;
                case "西南": return 225;
                case "西北": return 315;
                default:
                    return -1;
            }
        },
        getGrid: function (gridid) {
            var m = ProjectSGC.Global.getMainObject("ModelList");
            return {
                node: m.grids.tree.find(gridid),
                m: m,
                l: {},
                s: {},
                hasLine: function (id) {
                    var b = this.l[id];
                    if (b === true) return true;
                    if (b === false) return false;
                    b = false;
                    var line = m.getLine(id);
                    if (line) {
                        var g = line[ProjectSGC.LINE.GRID];
                        b = this.node.contains(g);
                    }
                    this.l[id] = b;
                    return b;
                },
                hasStation: function (id) {
                    var b = this.s[id];
                    if (b === true) return true;
                    if (b === false) return false;
                    b = false;
                    var station = m.getStation(id);
                    if (station) {
                        var g = station.data.owner[1];
                        b = this.node.contains(g);
                    }
                    this.s[id] = b;
                    return b;
                },
                filter: function (lst, field) {
                },
                filterLine: function (lstLine, field) {
                    var lst = [];
                    if (!lstLine) return lst;
                    for (var i = 0; i < lstLine.length; i++) {
                        var row = lstLine[i];
                        if (this.hasLine(row[field]))
                            lst.push(row);
                    }
                    return lst;
                },
                filterStation: function (lstStation, field) {
                    var lst = [];
                    if (!lstStation) return lst;
                    for (var i = 0; i < lstStation.length; i++) {
                        var row = lstStation[i];
                        if (this.hasStation(row[field]))
                            lst.push(row);
                    }
                    return lst;
                }
            };
        }
    },
    Card: {
        getDeviceCard: function (id) {
            var type = ProjectSGC.Meta.getTypeById(id);
            switch (type) {
                case "DCLINE":
                    return "dclinecard";
                case "ACLINE":
                    return "aclinecard";
                case "PWRTRANSFM":
                    return "pwrtransfmcard";
                case "BREAKER":
                    return "breakercard";
                case "GENERATOR":
                    return "generatorcard";
                case "TOWER":
                    return "towercard";
                case "BUSBAR":
                    return "busbarcard";
                case "DIS":
                    return "disconnectcard";
                case "GROUNDDIS":
                    return "grounddiscard";
                default:
                    return "";
            }
        },
        getLineCard: function (lineid) {
            switch (ProjectSGC.Meta.getTypeById(lineid)) {
                case "HVDCSYS":
                    return "gethvdcsystemcardcon";
                case "DCLINE":
                    return "dclinecard";
                default:
                    return "aclinecard";
            }
        },
        getStationCard: function (staid) {
            switch (ProjectSGC.Meta.getTypeById(staid)) {
                case "SUBSTATION": return "getsubstationcard";
                case "CONVERSUBSTATION": return "getconstationcard";
                case "HVDCGROUNDSTATION": return "gethvdcgroudcard";
                default: return "getplantcard";
            }
        },
        getCardName: function (card, id) {
            if (Ysh.Type.isFunction(card))
                return card(id);
            switch (card) {
                case "line":
                    return this.getLineCard(id);
                case "station":
                    return this.getStationCard(id);
                case "device":
                    return this.getDeviceCard(id);
                default:
                    return card;
            }
        },
        showCard: function (card, id) {
            var cardUrlInst = ProjectSGC.Global.getMainObject("cardUrlInst");
            if (!cardUrlInst) return;
            cardUrlInst.show(this.getCardName(card, id), id);
        }
    },
    Event: {
        Message: function (f) {
            Ysh.Web.Event.attachEvent(window, "message", function (event) {
                if (!event.data)
                    return;
                var data = event.data;
                f(data.type, data.data, data.eventType, data);
            });
        }
    },
    Statistics: {
        countByVoltage: function (data, vIdx) {
            var s = this.count(data, vIdx);
            s.sort(function (x, y) {
                return -Ysh.Compare.compareVoltage(x[0], y[0]);
            });
            return s;
        },
        count: function (data, vIdx) {
            var o = {};
            for (var i = 0; i < data.length; i++) {
                var v = Ysh.Type.isFunction(vIdx) ? vIdx(data[i]) : data[i][vIdx];
                if (Ysh.Type.isArray(v)) {
                    for (var j = 0; j < v.length; j++)
                        o[v[j]] = (o[v[j]] || 0) + 1;
                } else
                    o[v] = (o[v] || 0) + 1;
            }
            var s = [];
            for (v in o) {
                s.push([v, o[v]]);
            }
            return s;
        }
    },
    modalToBig: function(e,vm){
        if(YshConfig.ModalFuncVersion === 2){
            if(vm.modalConfig){
                $(".modalreduction").show();
                $(".modalsobig").hide();
                //根据id找对应得modal框,一定得配上id
                if(!e.path[4].id){
                    console.error('Modal框id不存在！请为Modal框配置正确的id属性！')
                }
                IviewModal.toFullscreen({...vm.modalConfig[e.path[4].id]})
            }
            return
        }
        var dh = document.documentElement.clientHeight,dw = document.documentElement.clientWidth;
        var cMC/*currentModalComponent**/,tc,ec=[],dc
       for(k in vm.$refs){
            if(vm.$refs[k]){
                if(vm.$refs[k].$el == e.path[4]){
                    cMC = vm.$refs[k];
                }
            }            
       }
       if(!cMC) return;       
       cMC.draggable = false;
       vm.modalfullscreen = true;
       $(".modalreduction").show();
       $(".modalsobig").hide();
       cMC.$children.forEach(function(value){
            var tag = Ysh.Vue.getTag(value);
            if(tag == "scrolltable"||tag == "i-table"||tag == "pagetable"){
                tc = value;
            }
            if(tag == "esimplechart"){
                if(!vm.viewshow||vm.viewshow&&vm.viewshow!=="none")
                ec.push(value);
            }
            if(tag == "dynfile"){
                dc = value;
            }
       })
       if(tc){
            if(ec.length){
                vm.h1 = dh - 59 - 32 - 300;
                vm.w1 = dw - 32;
                vm.$nextTick(function(){
                    ec.forEach(function(value){
                        value.echart.resize();
                    })                    
                    tc.resize();
                })
            }else{
                if(vm.$refs["tableHeader0"]){
                    var th1 = vm.$refs["tableHeader1"]? vm.$refs["tableHeader1"].clientHeight : 0;
                    vm.h1 = dh - 59 - 32 -vm.$refs["tableHeader0"].clientHeight-th1;
                }else{
                     vm.h1 = dh - 59 - 32;
                }
                vm.$nextTick(function(){
                    tc.resize();
                })
            }
       }else if(dc){
            dc.args.subfileTableHeight = dh - 59 - 32 - 40;
            vm.$nextTick(function(){
                    dc.$children[0].$children[0].resize();
            })
       }else if(vm.modalToBigHandler){
            vm.modalToBigHandler();
       }else{
            return false;
       }          
    }, 
    modalToSmall: function(e,vm,v,invoke){
        if(YshConfig.ModalFuncVersion === 2){
            if(vm.modalConfig){
                $(".modalreduction").hide();
                $(".modalsobig").show();
                if(invoke === 'close'){
                    //根据id找对应得modal框,一定得配上id
                    if(!e.path[5].id){
                        console.error('Modal框id不存在！请为Modal框配置正确的id属性！')
                    }
                    IviewModal.toReduction({...vm.modalConfig[e.path[5].id]})
                }else{
                //根据id找对应得modal框,一定得配上id
                if(!e.path[4].id){
                    console.error('Modal框id不存在！请为Modal框配置正确的id属性！')
                }
                IviewModal.toReduction({...vm.modalConfig[e.path[4].id]})
            }
                
            }
            return
        }
        var dh = document.documentElement.clientHeight,dw = document.documentElement.clientWidth;
        var cMC/*currentModalComponent**/,tc,ec=[],dc
        if(v){
            for(k in vm.$refs){
                if(vm.$refs[k]){
                    if(vm.$refs[k].$el == e.path[5]){
                        cMC = vm.$refs[k];
                    }
                }
           }
        }else{
           for(k in vm.$refs){
                if(vm.$refs[k]){
                    if(vm.$refs[k].$el == e.path[4]){
                        cMC = vm.$refs[k];
                    }
                }
           }
       }
       if(!cMC) return;    
       cMC.draggable = true;   
       vm.modalfullscreen = false;
       $(".modalreduction").hide();
       $(".modalsobig").show();
       cMC.$children.forEach(function(value){
            var tag = Ysh.Vue.getTag(value);
            if(tag == "scrolltable"||tag == "i-table"||tag == "pagetable"){
                tc = value;
            }
            if(tag == "esimplechart"){
                if(!vm.viewshow||vm.viewshow&&vm.viewshow!=="none")
                ec.push(value);
            }
            if(tag == "dynfile"){
                dc = value;
            }
       })
       if(tc){
            if(ec.length){
                vm.h1 = 300;
                vm.w1 = 965;
                vm.$nextTick(function(){
                    ec.forEach(function(value){
                        value.echart.resize();
                    })                    
                    tc.resize();
                })
            }else{
                vm.h1 = 300;
                vm.$nextTick(function(){
                    tc.resize();
                })
            }
       }else if(dc){
            dc.args.subfileTableHeight = 300;
            vm.$nextTick(function(){
                    dc.$children[0].$children[0].resize();
            })
       }else if(vm.modalToSmallHandler){
            vm.modalToSmallHandler();
       }else{
            return false;
       }            
    },
    modalToClose: function(e,vm,v,toSmall){
        if(toSmall){
            ProjectSGC.modalToSmall(e,vm,v,'close');
        }
    },
}

if (typeof vMain == "undefined")
    vMain = top.vMain;

Vue.component('ysh-card', {
    props: ["id", "text", "card"],
    methods: {
        showCard: function () {
            console.log("显示卡片：" + this.card + "," + this.id);
            ProjectSGC.Card.showCard(this.card, this.id);
        }
    },
    template: '<a> <span @click.stop="showCard"><slot> {{text}} </slot></span> </a>'
});

Vue.component('ysh-cards', {
    props: ["id", "text", "card", "idsplit", "textsplit"],
    computed: {
        all: function () {
            if (this.idsplit && this.id) {
                var ret = [];
                var arrId = this.id.split(this.idsplit);
                var arrText = this.text.split(this.textsplit);
                for (var i = 0; i < arrId.length; i++) {
                    ret.push({ id: arrId[i], text: arrText[i] || "" });
                }
                return ret;
            }
            return [{ id: this.id, text: this.text }];
        }
    },
    methods: {
        showCard: function (item) {
            ProjectSGC.Card.showCard(this.card, item.id);
        }
    },
    template: '<span><span v-for="(item,index) in all"><a><span @click.stop="showCard(item)">{{item.text}}</span></a><span v-if="index!=all.length-1">{{textsplit}}</span></span></span>'
});

var ProjectMap = {
    data: {
        highLights: { lines: [], stations: [] },
        twinkles: { lines: [], stations: [] },
        removeHighLight: function (type) {
            var o = { lines: this.highLights.lines, stations: this.highLights.stations };
            this.highLights = { lines: [], stations: [] };
            this.twinkles = { lines: [], stations: [] };
            return o;
        },
        removeTwinkle: function () {
            var o = { lines: this.twinkles.lines, stations: this.twinkles.stations };
            this.twinkles = { lines: [], stations: [] };
            return o;
        },
        setHighLight: function (type, lines, stations) {
            this.highLights.lines = lines;
            this.highLights.stations = stations;
        },
        setTwinkle: function (type, lines, stations) {
            this.twinkles.lines = lines;
            this.twinkles.stations = stations;
        }
    },
    locateRange: function (lineids, stationids, f) {
        return ProjectSGC.Map.locateLineStaRange(lineids, stationids, f);
    },
    highLight: function (type, lines, stations, f) {
        this.removeTwinkle(type);
        ProjectSGC.Map.highLight(lines, stations, "", true);
        if (f) this.locateRange(lines, stations, f);
        this.data.setHighLight(type, lines, stations);
    },
    twinkle: function (type, lines, stations, f) {
        this.removeTwinkle(type);
        ProjectSGC.Map.highLight(lines, stations, "", false, true);
        if (f) this.locateRange(lines, stations, f);
        this.data.setTwinkle(type, lines, stations);
    },
    removeHighLight: function (type) {
        var o = this.data.removeHighLight(type);
        if ((o.lines.length == 0) && (o.stations.length == 0)) return;
        ProjectSGC.Map.highLight([], []);
    },
    removeTwinkle: function (type) {
        var o = this.data.removeTwinkle(type);
        if ((o.lines.length == 0) && (o.stations.length == 0)) return;
        ProjectSGC.Map.highLight(o.lines, o.stations, "", true, true);//先高亮，再去掉高亮
        ProjectSGC.Map.highLight([], []);
    },
    clear: function (type) {
        this.removeTwinkle(type);
        ProjectSGC.Map.highLight([], []);
    },
    create: function () {
        return {
            _show: null,
            _hide: null,
            setShow: function (f) { },
            setHide: function (f) { },
        }
    }
}

Vue.component('group_voltage_statistics', {
    props: {
        list: {
            type: Array, "default": []
        },
        vcolumn: {
            type: Number, "default": 1
        },
        dcolumn: {
            type: Number, "default": 0
        },
        totalname: {
            type: String, "default": "总计"
        }
    },
    data: function () {
        return { vSelected: "", count: 0, statistics: [] };
    },
    methods: {
        click: function (s) {
            this.vSelected = s ? s[0] : "";
            var list = this.filter(this.vSelected);
            this.$emit("volchanged", list, this.vSelected, true);
        },
        filter: function (v) {
            if (!v)
                return this.list;
            var c = this.vcolumn;
            return ProjectSGC.Array.pick(this.list, function (row) {
                return row[c] == v;
            });
        },
        doStatistics: function () {
            var cVol = this.vcolumn;
            var cId = this.dcolumn;
            var ids = [];
            var bVolExist = false;
            var vSelected = this.vSelected;
            var s = ProjectSGC.Statistics.countByVoltage(this.list, function (row) {
                var id = row[cId];
                if (ids.indexOf(id) >= 0)
                    return [];
                ids.push(id);
                var vol = row[cVol]
                if (!bVolExist)
                    bVolExist = (vol == vSelected);
                return vol;
            });
            this.count = ids.length;
            if (!bVolExist)
                this.vSelected = "";
            this.statistics = s;
            var list = this.filter(this.vSelected);
            this.$emit("volchanged", list, this.vSelected, false);
        }
    },
    watch: {
        list: {
            immediate: true,
            handler: function () {
                this.doStatistics();
            }
        }
    },
    template: `<div style="background-color:#585858;padding:5px">
                <div style="width:100%">
                    <div style="display:inline-block;vertical-align:top;width:115px">
                        <span style="cursor:pointer" @click="click(null)">
                            {{totalname}}：<span style="color:#f77850;margin-right:5px">{{ count }}</span>
                        </span>
                    </div>
                    <div style="display:inline-block;width:calc(100% - 120px)">
                        <template v-for="(item_statistics,index) in statistics">
                            <span v-if="index">、</span>
                            <span style="cursor:pointer" @click="click(item_statistics)">
                                <span :style="{'color':(item_statistics[0]==vSelected)?'#46d4d2':'','font-size':(item_statistics[0]==vSelected)?'16px':''}">{{ item_statistics[0] }}</span>
                                (<span style="color:#f77850">{{ item_statistics[1] }}</span>)
                            </span>
                        </template>
                    </div>
                </div>
            </div>`
});

Vue.component('group_statistics', {
    props: {
        list: {
            type: Array, "default": []
        },
        scolumn: {
            "default": 1
        },
        dcolumn: {
            type: Number | String, "default": 0
        },
        showtext: {
            type: Function, "default": function (v) { return v; }
        },
        link: {
            type: Boolean, "default": true
        }
    },
    data: function () {
        return { sSelected: "", count: 0, statistics: [] };
    },
    computed: {
        linkStyle: function () {
            if (this.link) return { cursor: "pointer" };
            return {};
        }
    },
    methods: {
        click: function (s) {
            if (!this.link) return;
            this.sSelected = s ? s[0] : "";
            var list = this.filter(this.sSelected);
            this.$emit("changed", list, this.sSelected);
        },
        filter: function (v) {
            if (!v)
                return this.list;
            var c = this.scolumn;
            return ProjectSGC.Array.pick(this.list, function (row) {
                return row[c] == v;
            });
        },
        doStatistics: function () {
            var cStat = this.scolumn;
            var cId = this.dcolumn;
            var ids = [];
            var bStatExist = false;
            var sSelected = this.sSelected;
            var s = ProjectSGC.Statistics.count(this.list, function (row) {
                var id = row[cId];
                if (ids.indexOf(id) >= 0)
                    return [];
                ids.push(id);
                var stat = Ysh.Type.isFunction(cStat) ? cStat(row) : row[cStat];
                if (!bStatExist)
                    bStatExist = (stat == sSelected);
                return stat;
            });
            this.count = ids.length;
            if (!bStatExist)
                this.sSelected = "";
            this.statistics = s;
            var list = this.filter(this.sSelected);
            this.$emit("changed", list, this.sSelected);
        }
    },
    watch: {
        list: function () {
            this.doStatistics();
        }
    },
    template: `<div style="background-color:#585858;padding:5px">
                <div style="width:100%">
                    <div style="display:inline-block;vertical-align:top;width:115px">
                        <span :style="linkStyle" @click="click(null)">
                            总计：<span style="color:#f77850;margin-right:5px">{{ count }}</span>
                        </span>
                    </div>
                    <div style="display:inline-block;width:calc(100% - 120px)">
                        <template v-for="(item_statistics,index) in statistics">
                            <span v-if="index">、</span>
                            <span :style="linkStyle" @click="click(item_statistics)">
                                <span :style="{'color':(item_statistics[0]==sSelected)?'#46d4d2':'','font-size':(item_statistics[0]==sSelected)?'16px':''}">{{ showtext(item_statistics[0]) }}</span>
                                (<span style="color:#f77850">{{ item_statistics[1] }}</span>)
                            </span>
                        </template>
                    </div>
                </div>
            </div>`
});
$(document).ready(function(){
    $(".ivu-modal-content").prepend("<img class='modalsobig' src='../../i/PDPImg/modalsobig.png' onclick='ProjectSGC.modalToBig(event,pdp)'>");
    $(".ivu-modal-content").append("<img class='modalreduction' src='../../i/PDPImg/modalreduction.png' onclick='ProjectSGC.modalToSmall(event,pdp,0)'>");
})

//全局事件
window.addEventListener('unhandledrejection', function(event) {
    event.preventDefault();
    // 这个事件对象有两个特殊的属性：
    console.log(event.promise); // [object Promise] - 生成该全局 error 的 promise
    console.log(event.reason); // Error: Whoops! - 未处理的 error 对象
});

window.onerror = function(message, url, line, col, error) {
    console.log(`${message}\n At ${line}:${col} of ${url}`);
};

Vue.config.errorHandler = function (err, vm, info) {
    console.log(err, vm, info)
    // handle error
    // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
    // 只在 2.2.0+ 可用
}