/*v=1.20.819.1*/
Vue.component('scrolltable', {
    mixins: [Ysh.Vue.IView.table],
    props: {
        columns: {
            type: Array,
            "default": []
        },
        data: {
            type: Array,
            "default": []
        },
        width: {
            type: Number | String
        },
        //每行的高度，不设置时自动计算
        itemHeight: {
            type: Number | String
        },
        //表头高度，不设置时获取页面表头高度，有时获取到的高度不对
        headerHeight: {
            type: Number | String,
            default: 0
        },
        //设置需要对比和合并的单元格，格式为[[对比列1,对比列2],[合并列1,合并列2]]，都设置为icol的key
        mergecol: {
            type: Array | String,
            default: function () {
                return [];
            }
        },
        /*设置需要多个对比和合并的单元格，格式为：
        [{compareCol: [对比列1,对比列2],mergeCol: [合并列1,合并列2]}
        ,{compareCol: [对比列3,对比列4],mergeCol: [合并列5]}]
        都设置为icol的key*/
        mergecolmulti: {
            type: Array | String,
            default: function () {
                return [];
            }
        },
        //设置对比列的方法
        fCompare: {
            type: Function,
            default: function (v1, v2, col) {
                return v1 == v2;
            }
        },
        //设置宽度不够时显示省略号和tooltip的列,格式为[列1,列2]
        ellipsisCols: {
            type: Array | String,
            default: function () {
                return [];
            }
        },
        //设置指定的行高，对应ellipsisCols能显示几行文字，格式为[2, 2]
        ellipsisLineClamps: {
            type: Array | String,
            default: function () {
                return [];
            }
        },
        indexdiff: {
            type: Number,
            "default" : 0
        },
        //设置复选框默认选中的方法
        fSetChecked: {
            type: Function,
            default: function (row) {
                if (this.highlightField == "")
                    return false;
                for (var i = 0; i < this.selection.length; i++) {
                    if (this.selection[i][this.highlightField] == row[this.highlightField])
                        return true;
                }
                return false;
            }
        }
    },
    template: "#scrolltable_template",
    data: function () {
        return {
            tableWidth: 100, //表格宽度
            tableHeight: 100, //表格整体高度
            dataHeight: 0, //所有数据高度
            divScroll: null, //滚动div
            dom: null, //this.$el
            parentDom: null, //this.$el.parent
            scrollTop: 0,
            currData: [],
            currPos: -1,
            iTable: null,
            rowHeight: {},
            lastLoadRowIndex: -1,
            tableDataHeight: 0,
            bCalcRowHeight: false,
            itemheight: 0,
            fScroll: null,
            fSetTr: null,
            timer: null,
            mergeCols: [],
            mergeColMulti: [],
            ellipsisColsIndex: [],
            scrollbarWidth: 17, //滚动条的宽度
            selection: [],
            yStart:-1 //touch时候的起始y坐标
        };
    },
    computed: {
        showData: function () {
            var ret = this.filterData(this.data);
            this.$emit("data-changed", ret);
            return ret;
        },
        itemNum: function () {
            return Math.floor((this.tableDataHeight) / this.itemheight) - 1;
        },
        bMerge: function () {
            return this.mergeCols.length === 2 || this.mergeColMulti.length > 0;
        },
        rowHeightAdd: function () {//剩下的高度均分给每一行的高度
            if (this.showData.length < (this.itemNum + 1))
        		return 0;
            return Math.floor((this.tableDataHeight - (this.itemNum + 1) * this.itemheight) / (this.itemNum + 1));
        },
        rowHeightEx: function () {//分给每一行以后剩下的高度，前n行高度+1
            if (this.showData.length < (this.itemNum + 1))
        		return 0;
            return (this.tableDataHeight - (this.itemNum + 1) * this.itemheight) % (this.itemNum + 1) - 1;
        },
        currData1: function () {
            if (this.isFirstFilterRow) {
                return [this.getFilterRowData()].concat(this.currData);
            }
            this.removeFilterCheckBox();
            return this.currData;
        }
    },
    methods: {
        filterEnd: function () {
            this.divScroll.scrollTop(0);
        },
        locate: function (f) {
            var index = -1;//find Index
            if (this.highlightField == "index") {
                index = parseInt(f, 10);
            } else {
                for (var i = 0; i < this.showData.length; i++) {
                    var row = this.showData[i];
                    if (typeof f == 'function') { // 传入的是函数
                        if (f(row)) {
                            index = i;
                            break;
                        }
                    } else { // 传入是数值
                        if (f == row[this.highlightField]) {
                            index = i;
                            break;
                        }
                    }

                }
            }
            if (index < 0)
                return;
            this.highlightId = this.showData[index][this.highlightField];
            //如果现在已经显示，就别跳了
            if ((index >= this.currPos) && (index < this.currPos + this.currData.length))
                return;
            var h = 0;
            var arr = this.rowHeight;
            for (var i = 1; i < index + 1; i++) {
                h += arr[i] || this.itemheight;
            }
            this.scrollTop = h;//index * this.itemheight;
            this.divScroll.scrollTop(this.scrollTop);
        },/*
        matchFilter: function (r) {
            for (var i = 0; i < this.filters.length; i++) {
                var key = this.filters[i].key;
                var values = this.filters[i]._filterChecked;
                if (!values.includes(r[key]))
                    return false;
            }
            return true;
        },*/
        scroll: function () {
            this.scrollTop = this.divScroll.scrollTop();
            this.bindData();
            if (typeof (this.fScroll) === "function")
                this.fScroll(this.iTable.$refs.tbody.$el.rows);
        },
        scrollTable: function () {
            this.scrollTop = this.scrollTop - event.wheelDelta;
            if (this.scrollTop < 0){
                this.scrollTop = 0;
            }
            else if (this.scrollTop + this.tableHeight > this.dataHeight){
                this.scrollTop = this.dataHeight - this.tableHeight;
            }else{
                event.preventDefault();
            }
            this.divScroll.scrollTop(this.scrollTop);
        },
        moveStart: function () {
            this.yStart = event.changedTouches[0].pageY;
        },
        moveIng: function () {
            
        },
        moveEnd: function () {
            var yEnd = event.changedTouches[0].pageY;
            var delta = yEnd - this.yStart;
            this.yStart = -1;
            this.scrollTop = this.scrollTop - delta;
           
            if (this.scrollTop < 0){
                this.scrollTop = 0;
            }else if (this.scrollTop + this.tableHeight > this.dataHeight){
                this.scrollTop = this.dataHeight - this.tableHeight;
            }else{
                event.preventDefault();
            }
            this.divScroll.scrollTop(this.scrollTop);
        },
        getPos: function () {
            var pos = -1;
            if (Math.ceil(this.scrollTop + this.tableHeight) >= this.dataHeight) {
                pos = Math.max(this.showData.length - 1 - this.itemNum, 0);
                return this.calcTableHeight(this.showData.length - 1, pos, false);
            }
            pos = Math.floor(this.scrollTop / this.itemheight);
            return this.calcScrollHeight(0, pos);
        },
        getRowNum: function () {
            var endIndex = this.currPos + this.itemNum;
            if (endIndex >= this.showData.length)
                endIndex = this.showData.length - 1;
            if (endIndex > this.lastLoadRowIndex - 1)
                return endIndex;
            return this.calcTableHeight(this.currPos, endIndex, true);
        },
        calcTableHeight: function (start, end, bInc) {
            if (!this.bCalcRowHeight)
                return end;
            var height = 0;
            var fSet = bInc ? function (i) { return i + 1; } : function (i) { return i - 1; };
            var fJudge = bInc ? function (i, j) { return i <= j; } : function (i, j) { return i >= j; };
            for (var i = start; fJudge(i, end); i = fSet(i)) {
                var h = this.rowHeight[i + 1] === undefined ? this.itemheight : this.rowHeight[i + 1];
                height += h;
                if (height > this.tableDataHeight)
                    return bInc ? i - 1 : i + 1;
            }
            return end;
        },
        calcScrollHeight: function (start, end) {
            if (!this.bCalcRowHeight)
                return end;
            var height = 0;
            for (var i = start; i <= end; i++) {
                var h = this.rowHeight[i + 1] === undefined ? this.itemheight : this.rowHeight[i + 1];
                if (i > 0)
                    height += h;
                if (height > this.scrollTop)
                    return i - 1;
            }
            return end;
        },
        bindData: function (bForce) {
            //if (this.data.length == 0)
            //    return;
            if (this.tableDataHeight == 0 || bForce === true) {
                this.rowHeight = {};
                var tblHeader = this.dom.find(".ivu-table-header");
                this.dataHeight = this.itemheight * this.showData.length + Math.floor(tblHeader.height());
                this.tableWidth = this.parentDom.width() - (this.dataHeight > this.tableHeight ? this.scrollbarWidth + 1 : 1);
                this.tableDataHeight = this.tableHeight - (this.headerHeight > 0 ? this.headerHeight : tblHeader.height()) - ((tblHeader.children("table").width() > this.parentDom.width()) ? this.scrollbarWidth : 0);
                if (this.tableDataHeight < 0)
                    this.tableDataHeight = 0;
                this.divScroll = this.dom.find(".divScroll");
            }
            var pos = this.getPos();
            //if (pos == this.currPos)
            //    return false;
            this.currPos = pos;
            var dataIndex = this.getRowNum();
            if (dataIndex > this.showData.length)
                this.currPos = Math.max(0, this.showData.length - this.itemNum);
            var arrData = [];
            for (var i = this.currPos; i <= dataIndex && i < this.showData.length; i++) {
                this.showData[i]["index"] = i + 1 + this.indexdiff;
                arrData.push(this.showData[i]);
            }
            this.currData = arrData;
            //if (typeof (this.fScroll) == "function")
            //    this.fScroll();
            //if (dataIndex > this.lastLoadRowIndex) {
            this.$nextTick(this.resetHeight);
        //}
        },
        resetHeight: function () {
            var tableData = $(this.iTable.$refs.tbody.$el);
            var _this = this;
            var bReBind = false;
            var currHeight = 0;
            if (typeof (_this.fSetTr) == "function")
                this.fSetTr(this.iTable.$refs.tbody.$el.rows);
            var startRow = -1;
            var arrRowOpe = [];
            if (this.iTable.$refs.fixedRightBody)
                arrRowOpe = $(this.iTable.$refs.fixedRightBody).children("table").children("tbody").children("tr");
            tableData.children("tbody").children("tr").each(function (i, tr) {
                var trHeight = _this.itemheight + _this.rowHeightAdd + (i < _this.rowHeightEx ? 1 : 0);
                var rowIndex = _this.setMergeCols(i, tr, startRow);
                if (rowIndex !== undefined)
                    startRow = rowIndex;
                if (!_this.bCalcRowHeight) {
                    $(tr).height(trHeight);
                    if (arrRowOpe.length > 0 && arrRowOpe[i])
                        $(arrRowOpe[i]).height(trHeight);
                    return;
                }
                var rowData = _this.currData[i];
                if (!rowData)
                    return;
                var index = rowData["index"];
                if (_this.rowHeight[index] !== undefined) {
                    currHeight += _this.rowHeight[index];
                    return;
                }
                var height = $(tr).height();
                if (index > _this.lastLoadRowIndex)
                    _this.lastLoadRowIndex = index;
                if ((height != _this.itemheight)&&(height > 0))
                    bReBind = true;
                if (height > 0)
                    _this.rowHeight[index] = height;
                currHeight += height;
            });
            tableData.children("tbody").children("tr").each(function (i, tr) {
                var trHeight = _this.itemheight + _this.rowHeightAdd + (i < _this.rowHeightEx ? 1 : 0);
                _this.setEllipsisColLineClamp(tr, trHeight);
            });

            if (typeof (_this.fSetTr) == "function")
                this.fSetTr(this.iTable.$refs.tbody.$el.rows);
            if (!this.bCalcRowHeight || (!bReBind && currHeight == this.tableDataHeight))
                return false;
            if (!bReBind && currHeight < this.tableDataHeight) {//剩余高度分配到每一行
                var rowHeightAdd = Math.floor((this.tableDataHeight - currHeight) / (this.currData.length));
                var rowHeightEx = (this.tableDataHeight - currHeight) % (this.currData.length);
                tableData.children("tbody").children("tr").each(function (i, tr) {
                    var rowData = _this.currData[i];
                    if (!rowData)
                        return;
                    var index = rowData["index"];
                    if (_this.rowHeight[index] === undefined) {
                        return;
                    }
                    var trHeight = _this.rowHeight[index] + rowHeightAdd + (i < rowHeightEx ? 1 : 0);
                    $(tr).height(trHeight);
                    if (arrRowOpe.length > 0 && arrRowOpe[i])
                        $(arrRowOpe[i]).height(trHeight);
                });
                return false;
            }
            var scrollHeight = 0; //根据显示表行的高度，重新计算高度
            for (var index in this.rowHeight) {
                scrollHeight += this.rowHeight[index] - this.itemheight;
            }
            this.dataHeight = this.itemheight * this.showData.length + scrollHeight;
            this.tableWidth = this.parentDom.width() - (this.dataHeight > this.tableHeight ? this.scrollbarWidth + 1 : 1);
            this.currPos = -1;
            this.bindData();
        },
        resize: function () {
            this.resetColumns($(this.$el).width());
            this.doResize();
            this.$nextTick(function () {
                this.iTable = this.$children[0];
                this.dom = $(this.$el);
                this.parentDom = $(this.$el).parent();
                this.height = +this.height;
                this.headerHeight = +this.headerHeight;
                this.tableHeight = (!isNaN(this.height) && this.height != 0) ? this.height : this.parentDom.height();
                if (this.tableHeight <= 0) {
                    this.tableHeight = this.parentDom.parent().height();
                    this.parentDom.height(this.tableHeight);
                }
                if (this.itemHeight === undefined) {
                    this.bCalcRowHeight = true;
                    this.itemheight = 32;
                }
                else {
                    this.bCalcRowHeight = false;
                    this.itemheight = parseInt(this.itemHeight);
                    if (isNaN(this.itemheight)) {
                        this.bCalcRowHeight = true;
                        this.itemheight = 32;
                    }
                }
                this.scrollbarWidth = this.getScrollbarWidth();
                var tblHeader = this.dom.find(".ivu-table-header");
                this.dataHeight = this.itemheight * this.showData.length + Math.floor(tblHeader.height());
                this.tableWidth = this.parentDom.width() - (this.dataHeight > this.tableHeight ? this.scrollbarWidth + 1 : 1);
                this.divScroll = this.dom.find(".divScroll");
                this.$nextTick(function () { this.bindData(true); });
            });
        },
        initMergeCol: function () {
            if (typeof (this.mergecol) === "string")
                this.mergeCols = eval(this.mergecol);
            else
                this.mergeCols = this.mergecol;
            if (this.mergeCols.length > 0) {
                //0是要比较的列，1是要合并的列
                if (this.mergeCols.length === 1)
                    this.mergeCols.push(this.mergeCols[0]);
                for (var i = 0; i < this.mergeCols[1].length; i++) {
                    var index = this.getColIndex(this.mergeCols[1][i]);
                    if (index === -1) {
                        alert("没有找到需要合并的表列！");
                        this.mergeCols = [];
                        break;
                    }
                    this.mergeCols[1][i] = index;
                }
            }
            if (typeof (this.mergecolmulti) === "string")
                this.mergeColMulti = eval(this.mergecolmulti);
            else
                this.mergeColMulti = this.mergecolmulti;
            for (var i = 0; i < this.mergeColMulti.length; i++) {
                var col = this.mergeColMulti[i];
                if (col.mergeCol === undefined)
                    col.mergeCol = col.compareCol;
                for (var j = 0; j < col.mergeCol.length; j++) {
                    var index = this.getColIndex(col.mergeCol[j]);
                    if (index === -1) {
                        alert("没有找到需要合并的表列！");
                        this.mergeColMulti = [];
                        break;
                    }
                    col.mergeCol[j] = index;
                }
                col.startRow = -1;
            }
        },
        getColIndex: function (key) {
            for (var i = 0; i < this.columns.length; i++) {
                if (this.columns[i].key === key)
                    return i;
            }
            return -1;
        },
        setMergeCols: function (i, tr, startRow) {
            if (!this.bMerge)
                return;
            var arrComCols = this.mergeCols.length > 0 ? this.mergeCols[0] : [];
            var arrMergeCols = this.mergeCols.length > 1 ? this.mergeCols[1] : [];

            if (i === 0) {
                for (var m = 0; m < arrMergeCols.length; m++) {
                    tr.cells[arrMergeCols[m]].rowSpan = 1;
                }
                for (var m = 0; m < this.mergeColMulti.length; m++) {
                    var col = this.mergeColMulti[m];
                    for (var n = 0; n < col.mergeCol.length; n++) {
                        tr.cells[col.mergeCol[n]].rowSpan = 1;
                    }
                    col.startRow = 0;
                }

                return 0;
            }
            var prevData = this.currData[i - 1];
            var data = this.currData[i];
            for (var m = 0; m < this.mergeColMulti.length; m++) {
                var col = this.mergeColMulti[m];
                var rowIndex = this.setMergeColsOpe(col.compareCol, col.mergeCol, prevData, data, col.startRow, tr);
                if (rowIndex !== undefined)
                    col.startRow = rowIndex;
            }
            if (arrComCols.length > 0) {
                return this.setMergeColsOpe(arrComCols, arrMergeCols, prevData, data, startRow, tr);
            }
        },
        setMergeColsOpe: function (arrComCols, arrMergeCols, prevData, data, startRow, tr) {
            if(prevData == undefined || data == undefined)
                return;
            var bSame = true;
            for (var m = 0; m < arrComCols.length; m++) {
                if (!this.fCompare(prevData[arrComCols[m]], data[arrComCols[m]])) {
                    bSame = false;
                    break;
                }
            }
            if (bSame) {
                var prevRow = $(tr).parent().children()[startRow];
                for (var m = 0; m < arrMergeCols.length; m++) {
                    prevRow.cells[arrMergeCols[m]].rowSpan++;
                    tr.cells[arrMergeCols[m]].style.display = "none";
                }
                return;
            }
            else {
                for (var m = 0; m < arrMergeCols.length; m++) {
                    tr.cells[arrMergeCols[m]].rowSpan = 1;
                    tr.cells[arrMergeCols[m]].style.display = "";
                }
                return tr.rowIndex;
            }
        },
        initEllipsisCol: function () {
            if (typeof (this.ellipsisCols) === "string")
                this.ellipsisColsIndex = eval(this.ellipsisCols);
            else
                this.ellipsisColsIndex = this.ellipsisCols;

            var lineClamps = [];
            if (typeof (this.ellipsisLineClamps) === "string")
                lineClamps = eval(this.ellipsisLineClamps);
            else
                lineClamps = this.ellipsisLineClamps;

            for (var i = 0; i < this.ellipsisColsIndex.length; i++) {
                var index = this.getColIndex(this.ellipsisColsIndex[i]);
                if (index === -1) {
                    alert("没有找到需要省略的表列！");
                    this.ellipsisColsIndex = [];
                }
                this.ellipsisColsIndex[i] = {
                    index: index, lineClamp: lineClamps.length > i ? lineClamps[i] : 2
                };
                this.columns[index].render = this.setEllipsisCol;
            }
        },
        setEllipsisCol: function (h, params) {
            var strVal = params.row[params.column.key];
            return h('div', [h('Tooltip', { props: { maxWidth: 300, placement: 'bottom', content: strVal, whiteSpace: 'normal', wordBreak: 'break-all' }, style: {  } },
                [h('p', strVal)])]);
        },
        setEllipsisColLineClamp: function (tr, trHeight) {
            //没有太长的文字把格子撑开
            if (this.ellipsisColsIndex.length == 0 || $(tr).height() <= trHeight)
                return false;
            for (var i = 0; i < this.ellipsisColsIndex.length; i++) {
                var oEllipsis = this.ellipsisColsIndex[i];
                if (tr.cells.length <= oEllipsis.index)
                    continue;
                var td = tr.cells[oEllipsis.index];
                if (!td)
                    continue;
                $(td).find("p").attr("class", "ivu-table-cell-ellipsis-ysh").css("-webkit-line-clamp", (oEllipsis.lineClamp * td.rowSpan).toString());
            }
        },
        getScrollbarWidth: function () {
            var odiv = document.createElement('div'),//创建一个div
                styles = {
                    width: '100px',
                    height: '100px',
                    overflowY: 'scroll'//让他有滚动条
                }, i, scrollbarWidth;
            for (i in styles) odiv.style[i] = styles[i];
            document.body.appendChild(odiv);//把div添加到body中
            scrollbarWidth = odiv.offsetWidth - odiv.clientWidth;//相减
            $(odiv).remove();//移除创建的div
            return scrollbarWidth + 1;//返回滚动条宽度
        },
        getDataIndex: function (row, arrData) {
            var indexColName = "_dataIndex";
            var idColName = this.highlightField == "" ? indexColName : this.highlightField;
            var index = row[indexColName];
            if (index === undefined)
                return -1;
            if (arrData === undefined)
                return parseInt(index);
            for (var i = 0; i < arrData.length; i++) {
                if (arrData[i][idColName] == row[idColName])
                    return i;
            }
            return -1;
        },
        setData: function (row, col) {
            var index = this.getDataIndex(row);
            if (index < 0)
                return;
            this.showData[index][col] = row[col];
        },
        setSelection: function (row, checked) {
            var index = this.getDataIndex(row, this.selection);
            if (checked && index < 0) {
                this.selection.push(row);
                this.selection.sort(function (row1, row2) {
                    if (row1["_dataIndex"] === undefined)
                        return 1;
                    if (row2["_dataIndex"] === undefined)
                        return -1;
                    return parseInt(row1["_dataIndex"]) - parseInt(row2["_dataIndex"]);
                });
            }
            else if (!checked && index >= 0) {
                this.selection.splice(index, 1);
            }
        },
        setChecked: function () {
            //this.selection = [];
            for (var i = 0; i < this.showData.length; i++) {
                this.showData[i]["index"] = i + 1 + this.indexdiff;
                this.showData[i]["_dataIndex"] = i;     
                this.showData[i]["_checked"] = this.fSetChecked(this.showData[i]);
                if (this.showData[i]["_checked"])
                    this.setSelection(this.showData[i], true);
            }
        },
        //itable默认事件
        onSelect: function (selection, row) {
            var index = this.getDataIndex(row);
            if (index >= 0)
                this.showData[index]["_checked"] = true;
            this.setSelection(row, true);
            this.bindData();
            this.$emit('on-select', selection, row);
        },
        onSelectCancel: function (selection, row) {
            var index = this.getDataIndex(row);
            if (index >= 0)
                this.showData[index]["_checked"] = false;
            this.setSelection(row, false);
            this.bindData();
            this.$emit('on-select-cancel', selection, row);
        },
        onSelectAll: function (selection) {
            for (var i = 0; i < this.showData.length; i++) {
                this.showData[i]["_checked"] = true;
                this.setSelection(this.showData[i], true);
            }
            this.bindData();
            this.$emit('on-select-all', selection);
        },
        onSelectAllCancel: function (selection) {
            for (var i = 0; i < this.showData.length; i++) {
                this.showData[i]["_checked"] = false;
                this.setSelection(this.showData[i], false);
            }
            this.bindData();
            this.$emit('on-select-all-cancel', selection);
        },
        onSelectionChange: function (selection) {
            this.$emit('on-selection-change', this.selection);
        },
        onRowClick: function (row, index) {
            if (this.highlightField) {
                this.highlightId = row[this.highlightField];
            }
            this.$emit('on-row-click', row, index);
        },
        getClickClassName: function (row, index) {
            if (this.clickHighlight) {
                if (this.highlightField) {
                    return row[this.highlightField] == this.highlightId ? "itable-tr-highlight " : ""
                }
                return "";
            }
            return "";
        },
        finallyRowClassName: function (row, index) {
            return this.getClickClassName(row, index) + this.rowClassName(row, index);
        },
        onRowDblclick: function (row, index) {
            this.$emit('on-row-dblclick', row, index);
        },
        onExpand: function (row, status) {
            this.$emit('on-expand', row, status);
        },
        mergeColumn: function (d) {
            return this.spanMethod(d, this.currData);
        }
    },
    watch: {
        showData: function (oldData, newData) {
            this.setChecked();
            if (oldData.length == newData.length)
                this.bindData(true);
            else
                this.resize();
        }, data: function () {
            this.filters = [];
            //this.highlightId = "";
        }
    },
    created: function () {
        this.initMergeCol();
        this.initEllipsisCol();
    },
    mounted: function () {
        this.setChecked();
        this.resize();
    }
});