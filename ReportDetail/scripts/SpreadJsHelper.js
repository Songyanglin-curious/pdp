/// <reference path="../lib/spread/gc.spread.sheets.all.11.1.1.min.js" />
//注意：
//1、上传格式只能是xslx格式。
//2、打印会出现网址，需要在弹出打印界面的里设置一下，去掉页眉页脚即可
//3、单元格填写html，只能在谷歌浏览器运行！！！
//4、单元格html和斜线，不能导出和打印
//使用说明：可以使用下面封装好的方法，也可以自己查询SpreadJs API 直接使用(v11版本)下面的网址
//http://help.grapecity.com/spread/SpreadSheets11/webframe.html#welcome.html
SpreadJs = function () {
    //spread对象
    var spreadMy;
    //页签对象
    var sheet;
    var spreadNS = GC.Spread.Sheets;
    var sheetsCalc = spreadNS.CalcEngine;
    //导出
    var excelIO = new GC.Spread.Excel.IO();
    //基本控制
    var retObj = {
        spreadMy: undefined,
        sheet: undefined,
        //暂停绘制表格
        SuspendPaint: function () {
            spreadMy.suspendPaint();
        },
        //继续绘制表格
        ResumePaint: function () {
            spreadMy.resumePaint();
        },
        /**
         * 重置spread对象的宽高
         * @returns {} 
         */
        Refresh:function() {
            spreadMy.refresh();
        },
        /**
         * 设置spread对象
         * @param {spread} _spread 
         * @returns {} 
         */
        SetSpread:function(_spread) {
            spreadMy = _spread;
            this.spreadMy = spreadMy;
        },
        /**
         * 初始化报表
         * @param {string} divId 装载spredjsExcel的div的id
         * @param {bool} isCreateNew 是否创建新对象 默认是true
         * @returns {} 
         */
        InitialSpread:
            function (divId, isCreateNew) {
                if (isCreateNew == undefined || typeof (isCreateNew) === "boolean" && isCreateNew) {
                    if (typeof (divId) === "string")
                        spreadMy = new GC.Spread.Sheets.Workbook(document.getElementById(divId));
                    else if (divId instanceof jQuery)
                        spreadMy = new GC.Spread.Sheets.Workbook(divId.get(0));
                } else {
                    if (typeof (divId) === "string")
                        spreadMy = GC.Spread.Sheets.findControl(document.getElementById(divId));
                    else if (divId instanceof jQuery)
                        spreadMy = GC.Spread.Sheets.findControl(divId.get(0));
                }
                this.spreadMy = spreadMy;
            },
        //SpreadJs基本设定
        SpreadOption: {
            //允许拖拽合并单元格
            //isShow:bool 
            AllowUserDragMerge: function (isAllow) {
                spreadMy.options.allowUserDragMerge = isAllow;
            },
            //滚动条显示到最大行和列
            //isShow:bool 
            ScrollbarShowMax: function (isShow) {
                spreadMy.options.scrollbarShowMax = isShow;
            },
            //滚动条是否显示最大对齐
            //isShow:bool 
            ScrollbarMaxAlign: function (isShow) {
                spreadMy.options.scrollbarMaxAlign = isShow;
            },
            //是否显示垂直滚动条
            //isShow:bool 
            ShowVerticalScrollbar: function (isShow) {
                spreadMy.options.showVerticalScrollbar = isShow;
            },
            //是否显示水平滚动条
            //isShow:bool 
            ShowHorizontalScrollbar: function (isShow) {
                spreadMy.options.showHorizontalScrollbar = isShow;
            }
        },
        //设置某个页签为显示的页签
        //sheetParam:可以是页签序号、页签名称、页签对象、单元格对象
        SetActiveSheet: function (sheetParam) {
            try {
                if (typeof (sheetParam) === "number") {
                    spreadMy.setActiveSheetIndex(sheetParam);
                } else if (typeof (sheetParam) === "string") {
                    spreadMy.setActiveSheet(sheetParam);
                } else if ("autoGenerateColumns" in sheetParam) {
                    //autoGenerateColumns是页签中随便找的一个属性
                    spreadMy.setActiveSheet(sheetParam.name());;
                } else if ("sheet" in sheetParam) {
                    spreadMy.setActiveSheet(sheetParam.sheet.name());;
                }
            } catch (e) {
            }
        },
        //设置全局sheet  返回sheet对象
        //sheetIndex:页签序号 不填设置为当前页签
        SetSheet: function (sheetIndex) {
            sheet = retObj.GetSheet(sheetIndex);
            this.sheet = sheet;
            return sheet;
        },
        //获取excel页签对象 默认是当前页签
        //sheetParam:可以是页签序号、页签名称、页签对象、单元格对象
        GetSheet: function (sheetParam) {
            var sheetTemp = spreadMy.getActiveSheet();
            try {
                if (sheetParam) {
                    if (typeof (sheetParam) === "number") {
                        sheetTemp = spreadMy.getSheet(sheetParam);
                    } else if (typeof (sheetParam) === "string") {
                        sheetTemp = spreadMy.getSheet(spreadMy.getSheetIndex(sheetParam));
                    } else if ("autoGenerateColumns" in sheetParam) {
                        sheetTemp = sheetParam;
                    } else if ("sheet" in sheetParam) {
                        sheetTemp = sheetParam.sheet;
                    }
                }
            } catch (e) {
                console.log("获取页签失败");
            }
            return sheetTemp;
        },
        //获取excel页签序号 默认是当前页签
        //sheetParam:可以是页签序号、页签名称、页签对象、单元格对象
        GetSheetIndex: function (sheetParam) {
            return spreadMy.getSheetIndex(retObj.GetSheet(sheetParam).name());
        },
        //获取所有页签名称
        GetAllSheetName: function () {
            var sheetNames = [];
            spreadMy.sheets.forEach(function (sheet) {
                sheetNames.push(sheet.name());
            });
            return sheetNames;
        },
        //选中单元格   不填参数，则获取当前选择的的第一个单元格
        //row:行号 number
        //col:列号 number
        //sheetParam:标签序号或名称或者是sheet对象，默认是当前页签
        //sheetArea:SheetArea枚举 选择页签区域  默认是可视区域
        GetCell: function (row, col, sheetParam, sheetArea) {
            var sheetTemp = retObj.GetSheet(sheetParam);
            if (arguments.length === 0) {
                var sel = this.GetActualCellRange();
                row = sel.row;
                col = sel.col;
            }
            if (arguments.length < 3)
                sheetArea = retObj.Enum.SheetArea.viewport;
            return sheetTemp.getCell(row, col, sheetArea);
        },
        //获取当前选择的单元格
        GetSelections: function () {
            var sel = spreadMy.getActiveSheet().getSelections();
            return sel;
        },
        //选中单元格范围   不填写参数是当前excel选中的单元格
        //row:行号 number
        //col:列号 number
        //rowCount:行数 number
        //colCount:列数 number
        //sheetParam:标签序号或名称或者是sheet对象，默认是当前页签
        //sheetArea:SheetArea枚举 选择页签区域  默认是可视区域
        GetRange: function (row, col, rowCount, colCount, sheetParam, sheetArea) {
            var range;
            var sheetTemp = retObj.GetSheet(sheetParam);
            if (arguments === 2) {
                range = retObj.GetCell(row, col);
            }
            else if (arguments.length >= 4) {
                if (!sheetArea)
                    sheetArea = retObj.Enum.SheetArea.viewport;
                range = sheetTemp.getRange(row, col, rowCount, colCount, sheetArea);
            } else {
                var sel = retObj.GetActualCellRange();
                range = sheetTemp.getRange(sel.row, sel.col, sel.rowCount, sel.colCount, retObj.Enum.SheetArea.viewport);
            }
            return range;
        },
        //获得范围的字符串 例如：A1:C2
        //cellOrRange:单元格范围，不填写则为当前选择单元格
        //rangeReferenceRelative:获取引用单元格方式，相对还是绝对 枚举RangeReferenceRelative  默认是完全相对
        GetRangeToFormula: function (cellOrRange, rangeReferenceRelative) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            if (rangeReferenceRelative==undefined)
                rangeReferenceRelative = retObj.Enum.RangeReferenceRelative.allRelative;
            return sheetsCalc.rangeToFormula(cellOrRange, -1, -1, rangeReferenceRelative);
        },
        //根据范围字符串，获取range对象的数组[]
        //formula:范围字符串
        //sheetParam:标签序号或名称或者是sheet对象，默认是当前页签
        GetFormulaToRanges: function (formula, sheetParam) {
            var ret = [];
            var sheetTemp = retObj.GetSheet(sheetParam);
            var onlyRange;
            try {
                onlyRange = sheetsCalc.formulaToRanges(sheetTemp, formula);
            } catch (e) {
                onlyRange = [];
                console.log("公式格式有问题，无法解析出公式内单元格：" + formula);
            }

            if (onlyRange.length > 0) {
                for (var i = 0; i < onlyRange[0].ranges.length; i++) {
                    var oneRange = onlyRange[0].ranges[i];
                    ret.push(retObj.GetRange(oneRange.row, oneRange.col, oneRange.rowCount, oneRange.colCount));
                }
            }
            return ret;
        },
        //选中当前excel的单元格
        //sheetParam:标签序号或名称或者是sheet对象，默认是当前页签
        SetSelection: function (row, col, rowCount, colCount, sheetParam) {
            var sheetTemp = retObj.GetSheet(sheetParam);
            sheetTemp.setSelection(row, col, rowCount, colCount);
        },
        //获取选择单元格的范围 返回范围对象，只是范围，不是当前单元格范围对象，包括row col rowCount colCount
        //返回行列，不会出现-1
        //cellOrRange:单元格范围，不填写则为当前选择单元格
        //或者是参数为rwo,col,rowCount,colCount，必须填写4个
        GetActualCellRange: function (cellOrRange) {
            if (arguments.length === 1)
                return new spreadNS.Range(cellOrRange.row, cellOrRange.col, cellOrRange.rowCount, cellOrRange.colCount);
            if (arguments.length === 4)
                return new spreadNS.Range(arguments[0], arguments[1], arguments[2], arguments[3]);
            var sel = this.GetSelections();
            if (sel.length === 0)
                return new spreadNS.Range(0, 0, 0, 0);
            var cellRange = sel[sel.length - 1];
            var rowCount = retObj.GetSheet().getRowCount();
            var columnCount = retObj.GetSheet().getColumnCount();
            if (cellRange.row === -1 && cellRange.col === -1) {
                return new spreadNS.Range(0, 0, rowCount, columnCount);
            }
            else if (cellRange.row === -1) {
                return new spreadNS.Range(0, cellRange.col, rowCount, cellRange.colCount);
            }
            else if (cellRange.col === -1) {
                return new spreadNS.Range(cellRange.row, 0, cellRange.rowCount, columnCount);
            }
            return cellRange;
        },
        //获取当前样式的颜色
        //因为有的颜色获取出来是样式，如：accent 1 0 这样的，需要用这个方法转换为正常颜色
        //sheetParam:标签序号或名称或者是sheet对象，默认是当前页签
        GetColorByThemeColor: function (themeColor, sheetParam) {
            var sheetTemp = retObj.GetSheet(sheetParam);
            var theme = sheetTemp.currentTheme();
            return theme.getColor(themeColor);
        },
        //设置网格线
        GridLine: {
            //网格线颜色
            //color:css支持的颜色
            //sheetParam:标签序号或名称或者是sheet对象，默认是当前页签
            Color: function (color, sheetParam) {
                var sheetTemp = retObj.GetSheet(sheetParam);
                sheetTemp.options.gridline.color = color;
                return retObj.GridLine;
            },
            //是否显示垂直网格线
            //isShow:是否显示 bool
            //sheetParam:标签序号或名称或者是sheet对象，默认是当前页签
            ShowVerticalGridline: function (isShow, sheetParam) {
                var sheetTemp = retObj.GetSheet(sheetParam);
                sheetTemp.options.gridline.showVerticalGridline = isShow;
                return retObj.GridLine;
            },
            //是否显示水平网格线
            //isShow:是否显示 bool
            //sheetParam:标签序号或名称或者是sheet对象，默认是当前页签
            ShowHorizontalGridline: function (isShow, sheetParam) {
                var sheetTemp = retObj.GetSheet(sheetParam);
                sheetTemp.options.gridline.showHorizontalGridline = isShow;
                return retObj.GridLine;
            }
        },
        //设置单元格选择控件
        //id:INPUT,TEXTAREA,editable DIV 的id
        //rangeSelectMode:是否是选择范围默认是true
        //absoluteReference:完全地址，默认是false
        SetFormulaTextBox: function (id, rangeSelectMode, absoluteReference) {
            if (arguments.length === 1) {
                rangeSelectMode = true;
                absoluteReference = false;
            } else if (arguments.length === 2) {
                absoluteReference = false;
            }
            var docBox = document.getElementById(id);
            if (docBox.className.indexOf("FormulaText") < 0) {
                docBox.className = docBox.className + " FormulaText";
            }
            var startRangeFormulaTextBox = new GC.Spread.Sheets.FormulaTextBox.FormulaTextBox(
                docBox,
                { rangeSelectMode: rangeSelectMode, absoluteReference: absoluteReference });
            startRangeFormulaTextBox.workbook(spreadMy);
            return startRangeFormulaTextBox;
        },
        //获取选择单元格控件所选的range数组对象或里面的内容
        //formulaTextBox:范围控件对象
        //isGetText:是否返回字符串，默认是false
        GetFormulaTextBoxRanges: function (formulaTextBox, isGetText) {
            if (isGetText) {
                return formulaTextBox.text();
            } else {
                try {
                    var ranges = [];
                    var texts = formulaTextBox.text().split(",");
                    for (var i = 0; i < texts.length; i++) {
                        ranges.push(retObj.GetFormulaToRanges(texts[i])[0]);
                    }
                    return ranges;
                } catch (e) {
                    throw '范围格式不正确';
                }
            }
        },
        //设置选择单元格控件内容
        //formulaTextBox:范围控件对象
        //rangeOrText:范围range对象或者范围字符串或者是范围range数组,不填写则清空选择范围
        SetFormulaTextBoxRanges: function (formulaTextBox, rangeOrText) {
            if (typeof (rangeOrText) === "string") {
                if (rangeOrText) {
                    formulaTextBox.text(rangeOrText);
                }
            } else if ("row" in rangeOrText) {
                formulaTextBox.text('=\'' + rangeOrText.sheet.name() + '\'!' + retObj.GetRangeToFormula(rangeOrText));
            } else if (rangeOrText instanceof Array) {
                var texts = [];
                if (rangeOrText.length > 0) {
                    texts.push('=\'' + rangeOrText[0].sheet.name() + '\'!' + retObj.GetRangeToFormula(rangeOrText[0]));
                    for (var i = 1; i < rangeOrText.length; i++) {
                        texts.push(',\'' + rangeOrText[i].sheet.name() + '\'!' + retObj.GetRangeToFormula(rangeOrText[i]));
                    }
                }
                formulaTextBox.text(texts.join(""));
            }
        },
        //加载ssjson文件   MIME类型，添加 *.ssjson   text/html
        //ssjsonUrl:加载文件路径
        //funcSuccess:加载成功执行的方法
        //funcError:加载失败执行的方法
        //isLoadImmediate:是否立即加载
        LoadData_ssjson: function (report_id, file_name, ssjsonUrl, funcSuccess, funcError,isLoadImmediate) {
            jsTools.$ajax({
                url: ssjsonUrl,
                data: {
                    report_id:report_id,
                    file_name:file_name
                },
                success: function (data) {
                    if (!data)
                        data = "{}";
                    var j = JSON.parse(data);
                    if (isLoadImmediate) {
                        spreadMy.isPaintSuspended(true);
                        spreadMy.fromJSON(j);
                        spreadMy.isPaintSuspended(false);
                    }
                    if (funcSuccess)
                        funcSuccess(j);
                },
                error: function (ex) {
                    if (funcError)
                        funcError(ex);
                    else
                        alert('加载数据异常:' + ex);
                }
            });
        },
        /**
         * 根据ssjson，刷新
         * @param {} ssjson 
         * @returns {} 
         */
        LoadData_ssjsonByString: function (ssjson) {
            if (!ssjson)
                ssjson = {};
            spreadMy.fromJSON(ssjson);
        },
        //保存ssjson文件到服务器
        //funcSuccess:保存成功后，执行的方法
        //funcError:保存失败后，执行的方法
        SaveData_ssjson: function (report_id,fileName, postUrl, reportField, funcSuccess, funcError) {
            //当选中图表保存时，文件会出错，所以要选中别的单元格
            if (retObj.Charts.GetChart())
                retObj.SetSelection(0, 0, 1, 1);
            var j = spreadMy.toJSON();//用于添加自定义属性
            j.ReportField = reportField.All;
            var arrListId = [];
            var arrListName = [];
            for (var i = 0; i < reportField.All.length; i++) {
                arrListId.push(reportField.All[i].id);
                arrListName.push(reportField.All[i].desc);
            }
            jsTools.$ajax({
                url: postUrl,
                data: {
                    report_id:report_id,
                    file_name: fileName,
                    ssjson: JSON.stringify(j),
                    arrListId: arrListId,
                    arrListName: arrListName
                },
                success: function () {
                    if (funcSuccess)
                        funcSuccess();
                },
                error: function (e) {
                    if (funcError)
                        funcError();
                    else
                        alert(e.responseText);
                }
            });
        },
        /**
         * 获取ssjson字符串
         * @returns {string} ssjson
         */
        GetSsjson:function() {
            return spreadMy.toJSON();
        },
        //添加自定义公式 例子在最下面FactorialFunction
        //name:函数名称
        //sheetParam:标签序号或名称或者是sheet对象，默认是当前页签
        AddCustomFunction: function (name, sheetParam) {
            var sheetTemp = retObj.GetSheet(sheetParam);
            sheetTemp.addCustomFunction(new window[name]());
        },
        //设置单元格文字
        //text:文本
        //cellOrRange:单元格范围，不填写则为当前选择单元格
        SetText: function (text, cellOrRange) {
            if (!cellOrRange) {
                cellOrRange = retObj.GetRange();
            }
            cellOrRange.text(text);
        },
        //获取单元格显示内容
        //cellOrRange:单元格范围，不填写则为当前选择单元格
        GetText: function (cellOrRange) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            return cellOrRange.text();
        },
        //设置单元格值value  设置为Html格式时，不支持Ie！！！
        //value:单元格值 若是html格式，则value为html内容  若为单元格斜线，则斜线内容以","分隔
        //cellType:CellTypes枚举 单元格类型 默认是文本 需要new 这个枚举
        //cellOrRange:单元格范围，不填写则为当前选择单元格
        SetValue: function (value, cellOrRange, cellType) {
            var val;
            if (!cellOrRange) {
                cellOrRange = retObj.GetRange();
            }
            if (cellType == undefined)
                cellType = retObj.Enum.CellTypes.Text;
            if (isNaN(value) || value == "")
                val = value;
            else
                val = parseFloat(value);
            cellOrRange.cellType(cellType).value(val);
        },
        //获取单元格值value
        //cellOrRange:单元格范围，不填写则为当前选择单元格
        GetValue: function (cellOrRange) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            return cellOrRange.value();
        },
        //添页签加行
        //startRow:起始行号 number
        //count:添加行数 number
        //sheetParam:标签序号或名称或者是sheet对象，默认是当前页签
        AddRows: function (startRow, count, sheetParam) {
            var sheetTemp = retObj.GetSheet(sheetParam);
            sheetTemp.addRows(startRow, count);
        },
        //添页签加列
        //startCol:起始列号 number
        //count:添加行数 number
        //sheetParam:标签序号或名称或者是sheet对象，默认是当前页签
        AddColumns: function (startCol, count, sheetParam) {
            var sheetTemp = retObj.GetSheet(sheetParam);
            sheetTemp.addColumns(startCol, count);
        },
        //设置页签一共有多少行 默认修改是当前页签的可视区域
        //rowCount:行数 number
        //sheetParam:标签序号或名称或者是sheet对象，默认是当前页签
        //sheetArea:页签区域SheetArea枚举  不填则默认可视区域
        SetSheetRowCount: function (rowCount, sheetParam, sheetArea) {
            var sheetTemp = retObj.GetSheet(sheetParam);
            if (sheetArea == undefined)
                sheetArea = retObj.Enum.SheetArea.viewport;
            sheetTemp.setRowCount(rowCount, sheetArea);
        },
        //获取总行数
        //sheetParam:标签序号或名称或者是sheet对象，默认是当前页签
        //sheetArea:页签区域SheetArea枚举  不填则默认可视区域
        GetSheetRowCount: function (sheetParam, sheetArea) {
            var sheet = retObj.GetSheet(sheetParam);
            return sheet.getRowCount(sheetArea);
        },
        //设置页签一共有多少列 默认修改是当前页签的可视区域
        //colCount:列数  number
        //sheetParam:标签序号或名称或者是sheet对象，默认是当前页签
        //sheetArea:页签区域SheetArea枚举  不填则默认可视区域
        SetSheetColumnCount: function (colCount, sheetParam, sheetArea) {
            var sheetTemp = retObj.GetSheet(sheetParam);
            if (sheetArea == undefined)
                sheetArea = retObj.Enum.SheetArea.viewport;
            sheetTemp.setColumnCount(colCount, sheetArea);
        },
        //获取总列数
        //sheetParam:标签序号或名称或者是sheet对象，默认是当前页签
        //sheetArea:页签区域SheetArea枚举  不填则默认可视区域
        GetSheetColumnCount: function (sheetParam, sheetArea) {
            var sheet = retObj.GetSheet(sheetParam);
            return sheet.getColumnCount(sheetArea);
        },
        //设置页签显示隐藏
        //sheetParam:标签序号或名称或者是sheet对象，默认是当前页签
        //visible:是否显示 bool
        SetSheetVisible: function (sheetParam, visible) {
            var sheetIndex = retObj.GetSheetIndex(sheetParam);
            spreadMy.sheets[sheetIndex].visible(visible);
        },
        //设置行的显示与隐藏
        //rowIndex:行号  number
        //visible:是否显示  bool,
        //sheetParam:标签序号或名称或者是sheet对象，默认是当前页签
        SetRowVisible: function (rowIndex, visible, sheetParam) {
            var sheetTemp = retObj.GetSheet(sheetParam);
            sheetTemp.getCell(rowIndex, -1).visible(visible);
        },
        //设置列的显示与隐藏
        //colIndex:列号  number
        //visible:是否显示  bool
        //sheetParam:标签序号或名称或者是sheet对象，默认是当前页签
        SetColVisible: function (colIndex, visible, sheetParam) {
            var sheetTemp = retObj.GetSheet(sheetParam);
            sheetTemp.getCell(-1, colIndex).visible(visible);
        },
        //设置选择区域的背景色
        //color:css支持的颜色
        //cellOrRange:单元格范围，不填写则为当前选择单元格
        SetBackGroundColor: function (color, cellOrRange) {
            if (!cellOrRange) {
                cellOrRange = retObj.GetRange();
            }
            cellOrRange.backColor(color);
        },
        //设置单元格边框线样式
        //lineColor:css样式支持的颜色  默认黑色
        //lineStyle:LineStyle枚举 边框线样式  默认直线
        //linePostion:LinePostion枚举 边框线的位置  默认全部位置
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        SetBorderLineStyle: function (lineColor, lineStyle, linePostion, cellOrRange) {
            if (!lineColor)
                lineColor = "black";
            if (lineStyle == undefined)
                lineStyle = retObj.Enum.LineStyle.thin;
            if (linePostion == undefined)
                linePostion = retObj.Enum.LinePostion.all;
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            cellOrRange.setBorder(new spreadNS.LineBorder(lineColor, lineStyle), linePostion);
        },
        //获取单元格样式   返回数组  每个数组对象为GC.Spread.Sheets.Style对象
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        GetCellStyle: function (cellOrRange) {
            var ret = [];
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            var rowCount = 1;
            var colCount = 1;
            for (var i = 0; i < rowCount; i++) {
                for (var j = 0; j < colCount; j++) {
                    var style = cellOrRange.sheet.getStyle(cellOrRange.row + i, cellOrRange.col + j, retObj.Enum.SheetArea.viewport, true);
                    ret.push(style.clone());
                }
            }
            return ret;
        },
        //设置单元格样式
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        //style:GC.Spread.Sheets.Style对象，一般用GetCellStyle获取到的style
        SetCellStyle: function (style, cellOrRange) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            var newStyle = new GC.Spread.Sheets.Style();
            for (var s in style) {
                newStyle[s] = style[s];
            }
            for (var i = 0; i < cellOrRange.rowCount; i++) {
                for (var j = 0; j < cellOrRange.colCount; j++) {
                    cellOrRange.sheet.setStyle(cellOrRange.row + i, cellOrRange.col + j, newStyle, retObj.Enum.SheetArea.viewport);
                }
            }
        },
        //格式刷(所有参数都必填)
        //fromCell:源单元格，通过GetCell方法获取
        //toRow:复制目的行号
        //toColumn:复制目的列号
        //rowCount:粘贴行数
        //columnCount:粘贴列数
        //option:枚举CopyToOptions
        CopyTo: function (fromCell, toRow, toColumn, rowCount, columnCount, option) {
            var sheet = fromCell.sheet;
            sheet.copyTo(fromCell.row, fromCell.col, toRow, toColumn, rowCount, columnCount, option);
        },
        //设置字体
        //fontMark:FontMark枚举  设计字是加粗、斜体、普通、加粗和斜体
        //fontSize:字体大小，css支持的字体大小，默认是11pt,必须加单位pt或px
        //fontFamily:字体，默认是宋体
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        SetFont: function (fontMark, fontSize, fontFamily, cellOrRange) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            if (fontMark == undefined)
                fontMark = retObj.Enum.FontMark.normal;
            if (!fontSize)
                fontSize = "11pt";
            if (!fontFamily)
                fontFamily = "宋体";
            cellOrRange.font(fontMark + " " + fontSize + " " + fontFamily);
        },
        //获取单元格字体
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        GetFont: function (cellOrRange) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            var fontMark = "";
            var fontSize = "";
            var fontFamily = "";
            var font = cellOrRange.font();
            if (font) {
                for (var fm in retObj.Enum.FontMark) {
                    if (font.indexOf(retObj.Enum.FontMark[fm]) >= 0)
                        fontMark = retObj.Enum.FontMark[fm];
                }
                if (!fontMark)
                    fontMark = retObj.Enum.FontMark.normal;
                font = font.replace(fontMark + " ", "");
                fontSize = font.split(" ")[0];
                fontFamily = font.split(" ")[1];
            }
            return {
                fontMark: fontMark,
                fontSize: fontSize,
                fontFamily: fontFamily
            }
        },
        //设置文字颜色  默认是黑色
        //color:css支持的颜色
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        SetForeColor: function (color, cellOrRange) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            if (!color)
                color = "black";
            cellOrRange.foreColor(color);
        },
        //获取颜色
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        GetForeColor: function (cellOrRange) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            var color = retObj.GetColorByThemeColor(cellOrRange.foreColor());
            if (!color)
                color = "black";//默认黑色
            return color;
        },
        //设置文字缩进
        //indent:缩进量 number  1代表8像素
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        SetTextIndent: function (indent, cellOrRange) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            if (indent < 0)
                indent = 0;
            cellOrRange.textIndent(indent);
        },
        //获取文字缩进
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        GetTextIndent: function (cellOrRange) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            return cellOrRange.textIndent();
        },
        //设置水平对齐方式  默认左对齐
        //hAlign:HorizonAlign枚举对象
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        SetHorizontalAlign: function (hAlign, cellOrRange) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            if (hAlign == undefined)
                hAlign = retObj.Enum.HorizontalAlign.left;
            cellOrRange.hAlign(hAlign);
        },
        //获取水平对齐方式
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        GetHorizontalAlign: function (cellOrRange) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            return cellOrRange.hAlign();
        },
        //设置垂直对齐方式  默认居中对齐
        //vAlign:VertivalAlign枚举对象
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        SetViertialAlign: function (vAlign, cellOrRange) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            if (vAlign == undefined)
                vAlign = retObj.Enum.VerticalAlign.center;
            cellOrRange.vAlign(vAlign);
        },
        //获取垂直对齐方式
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        GetViertialAlign: function (cellOrRange) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            return cellOrRange.vAlign();
        },
        //设置文字修饰
        //textDecorationType:TextDecorationType枚举 文字修饰   可以填写多个样式以|分隔
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        SetTextDecoration: function (textDecorationType, cellOrRange) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            cellOrRange.textDecoration(textDecorationType);
        },
        //获取文字修饰
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        GetTextDecoration: function (cellOrRange) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            return cellOrRange.textDecoration();
        },
        //设置高度
        //num：高度数字
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        SetHeight: function (num, cellOrRange) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            retObj.GetSheet(cellOrRange).getRange(cellOrRange.row, -1, cellOrRange.rowCount, -1).height(num);
        },
        //获取高度
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        GetHeight: function (cellOrRange) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            return retObj.GetSheet(cellOrRange).getRange(cellOrRange.row, -1, cellOrRange.rowCount, -1).height();
        },
        //设置宽度
        //num:宽度数字
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        SetWidth: function (num, cellOrRange) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            retObj.GetSheet(cellOrRange).getRange(-1, cellOrRange.col, -1, cellOrRange.colCount).width(num);
        },
        //获取宽度
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        GetWidth: function (cellOrRange) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            return retObj.GetSheet(cellOrRange).getRange(-1, cellOrRange.col, -1, cellOrRange.colCount).width();
        },
        //设置变单元格内容边距  上右下左都填数字
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        SetCellPadding: function (top, right, bottom, left, cellOrRange) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            if (top == undefined)
                top = 0;
            if (right == undefined)
                right = 0;
            if (bottom == undefined)
                bottom = 0;
            if (left == undefined)
                left = 0;
            cellOrRange.cellPadding(top + " " + right + " " + bottom + " " + left);
        },
        //获取单元格内容边距  返回 top right bottom left对象
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        GetCellPadding: function (cellOrRange) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            var padding = cellOrRange.cellPadding();
            if (!padding)
                padding = "0 0 0 0";
            var arr_padding = padding.split(" ");
            return {
                top: arr_padding[0],
                right: arr_padding[1],
                bottom: arr_padding[2],
                left: arr_padding[3]
            }
        },
        //是否换行
        //isWrap:bool
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        WordWrap: function (isWrap, cellOrRange) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            cellOrRange.wordWrap(isWrap);
        },
        //单元格自适应行
        //row:行号
        //sheetParam:标签序号或名称或者是sheet对象，默认是当前页签
        AutoFitRow: function (row, sheetParam) {
            var sheetTemp = retObj.GetSheet(sheetParam);
            sheetTemp.autoFitRow(row);
        },
        //单元格自适应列
        //row:行号
        //sheetParam:标签序号或名称或者是sheet对象，默认是当前页签
        AutoFitColumn: function (col, sheetParam) {
            var sheetTemp = retObj.GetSheet(sheetParam);
            sheetTemp.autoFitColumn(col);
        },
        //清空单元格  默认清除单元格样式
        //storageType:StorageType枚举
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        ClearCell: function (storageType, cellOrRange) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            if (storageType == undefined)
                storageType = retObj.Enum.StorageType.style;
            cellOrRange.clear(storageType);
        },
        //合并单元格  默认合并当前选中的单元格
        MergeCell: function (range) {
            if (!range)
                range = retObj.GetRange();
            retObj.GetSheet(range).addSpan(range.row, range.col, range.rowCount, range.colCount);
        },
        //取消合并单元格  默认取消合并当前选中的单元格
        UnMergeCell: function (range) {
            if (!range)
                range = retObj.GetRange();
            var sheetTemp = retObj.GetSheet(range);
            for (var i = 0; i < range.rowCount; i++) {
                for (var j = 0; j < range.colCount; j++) {
                    sheetTemp.removeSpan(i + range.row, j + range.col);
                }
            }
        },
        //设置标签内容
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        SetTag: function (tag, cellOrRange) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            var sheetTemp = retObj.GetSheet(cellOrRange);
            for (var i = 0; i < cellOrRange.rowCount; i++) {
                for (var j = 0; j < cellOrRange.colCount; j++) {
                    sheetTemp.setTag(cellOrRange.row + i, cellOrRange.col + j, tag);
                }
            }
        },
        //获取标签内容  返回数组，数组的每个对象为{row:..,col:..,tag:..}
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        GetTag: function (cellOrRange) {
            var ret = [];
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            for (var i = 0; i < cellOrRange.rowCount; i++) {
                for (var j = 0; j < cellOrRange.colCount; j++) {
                    var row = cellOrRange.row + i;
                    var col = cellOrRange.col + j;
                    var temp = cellOrRange.sheet.getTag(row, col);
                    if (temp == undefined)
                        temp = "";
                    ret.push({
                        row: row,
                        col: col,
                        tag: temp
                    });
                }
            }
            return ret;
        },
        //删除标签内容
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        CleanTag: function (cellOrRange) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            cellOrRange.sheet.clear(cellOrRange.row, cellOrRange.col, cellOrRange.rowCount, cellOrRange.colCount, retObj.Enum.SheetArea.viewport, retObj.Enum.StorageType.tag);
        },
        //
        //fileName:
        /**
         * 导出excel
         * @param {string} fileName 导出路径及文件名
         * @param {json} options 导出参数
         * (bool)ignoreStyle:忽略样式,
         * (bool)ignoreFormula:忽略公式
         * @param {function} successFun 成功后执行的方法
         * @param {function} errorFun 失败后执行的方法
         * @returns {} 
         */
        ExportExcel: function (fileName, options, successFun, errorFun) {
            if (!options)
                options = { includeBindingSource: true, ignoreFormula: true };
            var json = spreadMy.toJSON(options);
            excelIO.save(json, function (blob) {
                saveAs(blob, fileName+".xlsx");
                if (successFun)
                    successFun();
            }, function (e) {
                if (errorFun)
                    errorFun();
                else
                    alert(e);
            });
        },
        //导入excel
        //inputFileId:上传input的id
        ImportExcel: function (inputFileId) {
            excelIO.open(document.getElementById(inputFileId).files[0], function (json) {
                spreadMy.fromJSON(json);
            }, function (e) {
                alert(e.errorMessage);
            });
        },
        //绑定事件
        //eventType:EventType枚举 里面写了func参数args包含的子项
        //sheetOrSpread:spread对象或者sheet对象
        //默认绑定在spread对象的事件：ActiveSheetChanged,ActiveSheetChanging,ButtonClicked,SheetTabClick,SheetTabDoubleClick
        //func:function(sender,args)
        EventBind: function (eventType, func, sheetOrSpread) {
            if (eventType === retObj.Enum.EventType.ActiveSheetChanged ||
                eventType === retObj.Enum.EventType.ActiveSheetChanging ||
                eventType === retObj.Enum.EventType.ButtonClicked ||
                eventType === retObj.Enum.EventType.SheetTabClick ||
                eventType === retObj.Enum.EventType.SheetTabDoubleClick)
                spreadMy.bind(eventType, function (sender, args) {
                    func(sender, args);
                });
            else
                sheetOrSpread.bind(eventType, function (sender, args) {
                    func(sender, args);
                });
        },
        //设置公式
        //formula:公式内容 例如=SUM(C3:C6)
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        SetFormula: function (formula, cellOrRange) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            var sheetTemp = cellOrRange.sheet;
            sheetTemp.setFormula(cellOrRange.row, cellOrRange.col, formula, retObj.Enum.SheetArea.viewport);
        },
        //获取公式内容  只能获取第一个单元格公式
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        GetFormula: function (cellOrRange) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            var sheetTemp = cellOrRange.sheet;
            return sheetTemp.getFormula(cellOrRange.row, cellOrRange.col);
        }
    }
    //设置带样式的表格
    retObj.Tables = {
        //添加表格
        //name:表格名称
        //row:行
        //col:列
        //rowCount:行数
        //colCount:列数
        //tableStyle:表格样式  GC.Spread.Sheets.Tables.TableTheme()对象  也可是是TableThemes枚举
        //sheetParam:标签序号或名称或者是sheet对象，默认是当前页签
        Add: function (name, row, col, rowCount, colCount, tableStyle, sheetParam) {
            var sheetTemp = retObj.GetSheet(sheetParam);
            if (this.FindTable(row, col))
                return;
            if (retObj.Tables.FindTableByName(name, sheetParam)) {
                console.log("已添加了此表名:" + name);
            }
            return sheetTemp.tables.add(name, row, col, rowCount, colCount, tableStyle);
        },
        /**
         * 删除表,保留数据
         * @param {table} table 表格对象
         * @param {number/string/sheet} sheetParam 标签序号或名称或者是sheet对象，默认是当前页签
         * @returns {} 
         */
        Remove: function (table, sheetParam) {
            var sheetTemp = retObj.GetSheet(sheetParam);
            sheetTemp.tables.remove(table, spreadNS.Tables.TableRemoveOptions.keepData);
        },
        //根据行列找表格
        //row:行
        //col:列
        //sheetParam:标签序号或名称或者是sheet对象，默认是当前页签
        FindTable: function (row, col, sheetParam) {
            var sheetTemp = retObj.GetSheet(sheetParam);
            var table = sheetTemp.tables.find(row, col);
            return table;
        },
        //根据表格名称找表格
        //name:表格名称
        //sheetParam:标签序号或名称或者是sheet对象，默认是当前页签
        FindTableByName: function (name, sheetParam) {
            var sheetTemp = retObj.GetSheet(sheetParam);
            var table = sheetTemp.tables.findByName(name);
            return table;
        },
        //获取所有表格 数组
        //sheetParam:标签序号或名称或者是sheet对象，默认是当前页签
        GetAllTables: function (sheetParam) {
            var sheetTemp = retObj.GetSheet(sheetParam);
            return sheetTemp.tables.all();
        },
        //设置获取是否显示表头
        //table:表格对象
        //isShow:bool
        ShowHeader: function (table, isShow) {
            if (arguments.length === 1)
                return table.showHeader();
            else
                table.showHeader(isShow);
        },
        //设置获取是否显示表尾
        //table:表格对象
        //isShow:bool
        ShowFooter: function (table, isShow) {
            if (arguments.length === 1)
                return table.showFooter();
            else
                table.showFooter(isShow);
        },
        //设置获取交替行样式
        //table:表格对象
        //isBand:bool
        BandRows: function (table, isBand) {
            if (arguments.length === 1)
                return table.bandRows();
            else
                table.bandRows(isBand);
        },
        //设置获取交替列样式
        //table:表格对象
        //isBand:bool
        BandColumns: function (table, isBand) {
            if (arguments.length === 1)
                return table.bandColumns();
            else
                table.bandColumns(isBand);
        },
        //设置获取高亮显示第一列
        //table:表格对象
        //isHighlight:bool
        HighlightFirstColumn: function (table, isHighlight) {
            if (arguments.length === 1)
                return table.highlightFirstColumn();
            else
                table.highlightFirstColumn(isHighlight);
        },
        //设置获取高亮显示最后一列
        //table:表格对象
        //isHighlight:bool
        HighlightLastColumn: function (table, isHighlight) {
            if (arguments.length === 1)
                return table.highlightLastColumn();
            else
                table.highlightLastColumn(isHighlight);
        }
    }
    //打印excel配置和打印，打印再调用PrintExcelSetting.Print()
    //打印预览里面，会出现网站的网址（页眉页脚），打印选项页面里，可以去掉这个
    retObj.PrintExcelSetting = {
        //获取页签打印信息
        getPrintInfo: function (sheetIndex) {
            if (isNaN(sheetIndex) || parseInt(sheetIndex) < 0) {
                sheetIndex = retObj.GetSheetIndex();
            }
            return retObj.GetSheet(sheetIndex).printInfo();
        },
        //是否是黑白打印  参数bool
        blackAndWhite: function (sheetIndex, isBlackAndWhite) {
            if (typeof (isBlackAndWhite) === "boolean")
                this.getPrintInfo(sheetIndex).blackAndWhite(isBlackAndWhite);
            else
                isBlackAndWhite = this.getPrintInfo(sheetIndex).blackAndWhite();
            return isBlackAndWhite;
        },
        //打印居中方向
        //printCentering:枚举 打印居中方向
        centering: function (sheetIndex, printCentering) {
            if (printCentering!=undefined)
                this.getPrintInfo(sheetIndex).centering(printCentering);
            else
                printCentering = this.getPrintInfo(sheetIndex).centering();
            return printCentering;
        },
        //是否显示表头
        //printVisibilityType:枚举  打印显示类型
        showRowHeader: function (sheetIndex, printVisibilityType) {
            if (printVisibilityType!=undefined)
                this.getPrintInfo(sheetIndex).showRowHeader(printVisibilityType);
            else
                printVisibilityType = this.getPrintInfo(sheetIndex).showRowHeader();
            return printVisibilityType;
        },
        //是否显示列头
        //printVisibilityType:枚举  打印显示类型
        showColumnHeader: function (sheetIndex, printVisibilityType) {
            if (printVisibilityType!= undefined)
                this.getPrintInfo(sheetIndex).showColumnHeader(printVisibilityType);
            else
                printVisibilityType = this.getPrintInfo(sheetIndex).showColumnHeader();
            return printVisibilityType;
        },
        //头部左边设置内容
        headerLeft: function (sheetIndex, txt) {
            if (typeof (txt) === "string")
                this.getPrintInfo(sheetIndex).headerLeft(txt);
            else
                txt = this.getPrintInfo(sheetIndex).headerLeft();
            return txt;
        },
        //头部左边设置图片
        headerLeftImage: function (sheetIndex, imgSrc) {
            if (typeof (imgSrc) === "string") {
                this.headerLeft("&G");
                this.getPrintInfo(sheetIndex).headerLeftImage(imgSrc);
            } else
                imgSrc = this.getPrintInfo(sheetIndex).headerLeftImage();
            return imgSrc;
        },
        //头部中间设置内容
        headerCenter: function (sheetIndex, txt) {
            if (typeof (txt) === "string")
                this.getPrintInfo(sheetIndex).headerCenter(txt);
            else
                txt = this.getPrintInfo(sheetIndex).headerCenter();
            return txt;
        },
        //头部中间设置图片
        headerCenterImage: function (sheetIndex, imgSrc) {
            if (typeof (imgSrc) === "string") {
                this.headerCenter("&G");
                this.getPrintInfo(sheetIndex).headerCenterImage(imgSrc);
            } else
                imgSrc = this.getPrintInfo(sheetIndex).headerCenterImage();
            return imgSrc;
        },
        //头部右边设置内容
        headerRight: function (sheetIndex, txt) {
            if (typeof (txt) === "string")
                this.getPrintInfo(sheetIndex).headerRight(txt);
            else
                txt = this.getPrintInfo(sheetIndex).headerRight();
            return txt;
        },
        //头部右边设置图片
        headerRightImage: function (sheetIndex, imgSrc) {
            if (typeof (imgSrc) === "string") {
                this.headerRight("&G");
                this.getPrintInfo(sheetIndex).headerRightImage(imgSrc);
            } else
                imgSrc = this.getPrintInfo(sheetIndex).headerRightImage();
            return imgSrc;
        },
        //头部左边设置内容
        footerLeft: function (sheetIndex, txt) {
            if (typeof (txt) === "string")
                this.getPrintInfo(sheetIndex).footerLeft(txt);
            else
                txt = this.getPrintInfo(sheetIndex).footerLeft();
            return txt;
        },
        //头部左边设置图片
        footerLeftImage: function (sheetIndex, imgSrc) {
            if (typeof (imgSrc) === "string") {
                this.footerLeft("&G");
                this.getPrintInfo(sheetIndex).footerLeftImage(imgSrc);
            } else
                imgSrc = this.getPrintInfo(sheetIndex).footerLeftImage();
            return imgSrc;
        },
        //头部中间设置内容
        footerCenter: function (sheetIndex, txt) {
            if (typeof (txt) === "string")
                this.getPrintInfo(sheetIndex).footerCenter(txt);
            else
                txt = this.getPrintInfo(sheetIndex).footerCenter();
            return txt;
        },
        //头部中间设置图片
        footerCenterImage: function (sheetIndex, imgSrc) {
            if (typeof (imgSrc) === "string") {
                this.footerCenter("&G");
                this.getPrintInfo(sheetIndex).footerCenterImage(imgSrc);
            } else
                imgSrc = this.getPrintInfo(sheetIndex).footerCenterImage();
            return imgSrc;
        },
        //头部右边设置内容
        footerRight: function (sheetIndex, txt) {
            if (typeof (txt) === "string")
                this.getPrintInfo(sheetIndex).footerRight(txt);
            else
                txt = this.getPrintInfo(sheetIndex).footerRight();
            return txt;
        },
        //头部右边设置图片
        footerRightImage: function (sheetIndex, imgSrc) {
            if (typeof (imgSrc) === "string") {
                this.footerRight("&G");
                this.getPrintInfo(sheetIndex).footerRightImage(imgSrc);
            } else
                imgSrc = this.getPrintInfo(sheetIndex).footerRightImage();
            return imgSrc;
        },
        //内容与纸张边距百分比 参数均为数字  每个数字是百分比的含义
        margin: function (sheetIndex, top, bottom, left, right, header, footer) {
            var marginOption = {};
            var argName = ["top", "bottom", "left", "right", "header", "footer"];
            var isHaveOption = false;
            for (var i = 1; i < 7; i++) {
                if (typeof (arguments[i]) === "number") {
                    marginOption[argName[i - 1]] = arguments[i];
                    isHaveOption = true;
                }
            }
            if (isHaveOption)
                this.getPrintInfo(sheetIndex).margin(marginOption);
            else
                marginOption = this.getPrintInfo(sheetIndex).margin();
            return marginOption;
        },
        //是否自适应列宽  参数bool
        bestFitColumns: function (sheetIndex, isFitCols) {
            if (typeof (isFitCols) === "boolean")
                this.getPrintInfo(sheetIndex).bestFitColumns(isFitCols);
            else
                isFitCols = this.getPrintInfo(sheetIndex).bestFitColumns();
            return isFitCols;
        },
        //是否自适应行高  参数bool
        bestFitRows: function (sheetIndex, isFitRows) {
            if (typeof (isFitRows) === "boolean")
                this.getPrintInfo(sheetIndex).bestFitRows(isFitRows);
            else
                isFitRows = this.getPrintInfo(sheetIndex).bestFitRows();
            return isFitRows;
        },
        //是否显示边框  参数bool
        showBorder: function (sheetIndex, isShowBorder) {
            if (typeof (isShowBorder) === "boolean")
                this.getPrintInfo(sheetIndex).showBorder(isShowBorder);
            else
                isShowBorder = this.getPrintInfo(sheetIndex).showBorder();
            return isShowBorder;
        },
        //是否显示网格线  参数bool
        showGridLine: function (sheetIndex, isShowGridLine) {
            if (typeof (isShowGridLine) === "boolean")
                this.getPrintInfo(sheetIndex).showGridLine(isShowGridLine);
            else
                isShowGridLine = this.getPrintInfo(sheetIndex).showGridLine();
            return isShowGridLine;
        },
        rowStart: function (sheetIndex, numNumber) {
            if (!isNaN(numNumber) && parseInt(numNumber))
                this.getPrintInfo(sheetIndex).rowStart(numNumber);
            else {
                numNumber = this.getPrintInfo(sheetIndex).rowStart();
            }
            return numNumber;
        },
        rowEnd: function (sheetIndex, numNumber) {
            if (!isNaN(numNumber) && parseInt(numNumber))
                this.getPrintInfo(sheetIndex).rowEnd(numNumber);
            else {
                numNumber = this.getPrintInfo(sheetIndex).rowEnd();
            }
            return numNumber;
        },
        columnStart: function (sheetIndex, numNumber) {
            if (!isNaN(numNumber) && parseInt(numNumber))
                this.getPrintInfo(sheetIndex).columnStart(numNumber);
            else {
                numNumber = this.getPrintInfo(sheetIndex).columnStart();
            }
            return numNumber;
        },
        columnEnd: function (sheetIndex, numNumber) {
            if (!isNaN(numNumber) && parseInt(numNumber))
                this.getPrintInfo(sheetIndex).columnEnd(numNumber);
            else {
                numNumber = this.getPrintInfo(sheetIndex).columnEnd();
            }
            return numNumber;
        },
        repeatRowStart: function (sheetIndex, numNumber) {
            if (!isNaN(numNumber) && parseInt(numNumber))
                this.getPrintInfo(sheetIndex).repeatRowStart(numNumber);
            else {
                numNumber = this.getPrintInfo(sheetIndex).repeatRowStart();
            }
            return numNumber;
        },
        repeatRowEnd: function (sheetIndex, numNumber) {
            if (!isNaN(numNumber) && parseInt(numNumber))
                this.getPrintInfo(sheetIndex).repeatRowEnd(numNumber);
            else {
                numNumber = this.getPrintInfo(sheetIndex).repeatRowEnd();
            }
            return numNumber;
        },
        repeatColumnStart: function (sheetIndex, numNumber) {
            if (!isNaN(numNumber) && parseInt(numNumber))
                this.getPrintInfo(sheetIndex).repeatColumnStart(numNumber);
            else {
                numNumber = this.getPrintInfo(sheetIndex).repeatColumnStart();
            }
            return numNumber;
        },
        repeatColumnEnd: function (sheetIndex, numNumber) {
            if (!isNaN(numNumber) && parseInt(numNumber))
                this.getPrintInfo(sheetIndex).repeatColumnEnd(numNumber);
            else {
                numNumber = this.getPrintInfo(sheetIndex).repeatColumnEnd();
            }
            return numNumber;
        },
        //特殊打印内容，如当前页数，总页数，当前日期，当前时间
        //还有些其他特殊打印内容的未列举，如删除线、加粗。
        SpecialPrintContent: {
            CurrentPage: "&P",
            PageCount: "&N",
            CurrentDate: "&D",
            CurrentTime: "&T"
        },
        //打印
        //sheetIndex:打印的页签，不填写则打印全页签
        print: function (sheetIndex) {
            if (isNaN(sheetIndex) || parseInt(sheetIndex) < 0)
                spreadMy.print();
            else {
                spreadMy.print(sheetIndex);
            }
        }
    }
    //图表
    retObj.Charts = {
        //添加图表 返回图表chart
        //name:图表名称（js名称）
        //charType:ChartType 枚举  图表类型
        //dataRange:图表数据范围  范围Range对象
        //x:图表相对表格横坐标 数字  默认为0
        //y:图表纵坐标 数字 默认为0
        //width:图表宽度 数字  默认为900
        //height:图表高度 数字 默认为400
        AddChart: function (name, chartType, dataRange, x, y, width, height) {
            if (!dataRange)
                dataRange = retObj.GetRange();
            if (!x)
                x = 0;
            if (!y)
                y = 0;
            if (!width)
                width = 900;
            if (!height)
                height = 400;
            var dataRangeString = retObj.GetRangeToFormula(dataRange);
            return retObj.GetSheet(dataRange).charts.add(name, chartType, x, y, width, height, dataRangeString, spreadNS.Charts.RowCol.cols);
        },
        //获取图表
        //name:图表名称  不填写，则获取当前激活的图表
        //sheetParam:标签序号或名称或者是sheet对象，默认是当前页签
        GetChart: function (name, sheetParam) {
            var thisChart = null;
            var sheetTemp = retObj.GetSheet(sheetParam);
            if (name) {
                thisChart = sheetTemp.charts.get(name);
            } else {
                sheetTemp.charts.all().forEach(function (chart) {
                    if (chart.isSelected()) {
                        thisChart = chart;
                    }
                });
            }
            return thisChart;
        },
        /**
         * 获取页签所有图表
         * @param {string/number} sheetParam 标签序号或名称或者是sheet对象，默认是当前页签
         * @returns {} 
         */
        GetAllChart:function(sheetParam) {
            return retObj.GetSheet(sheetParam).charts.all();
        },
        //获取图表中所有系列（模块）名称
        //返回按顺序排序的名称数组
        //chart:图表对象  默认是当前选中的图表
        GetSeriesAllName: function (chart) {
            if (!chart)
                chart = retObj.Charts.GetChart();
            if (!chart)
                return;
            var retNames = [];
            var allSers = chart.series().AllSers;
            for (var i = 0; i < allSers.length; i++) {
                retNames.push(allSers[i].Cj);
            }
            return retNames;
        },
        //行列转换
        SwitchRowColumn: function () {
            var chart = retObj.Charts.GetChart();
            if (!chart)
                return;
            var isSwitched = chart.switchDataOrientation();
            if (!isSwitched) {
                alert("不能进行行列转换");
            }
        },
        /**
         * 获取图表数据范围
         * @param {chart} chart 
         * @param {string/number} sheetParam 标签序号或名称或者是sheet对象，默认是当前页签
         * @param {bool} isReturnRange 是否返回范围，默认返回range对象，否则返回范围字符串
         * @returns {range对象或 $A$1:$B$2} 
         */
        GetChartRange: function (chart,sheetParam,isReturnRange) {
            if (!chart)
                chart = retObj.Charts.GetChart();
            var rangeText = chart.dataRange();
            if (isReturnRange)
                return retObj.GetFormulaToRanges(rangeText, sheetParam)[0];
            return rangeText;
        },
        //设置图表区域
        //chart:图表对象  默认是当前选中的图表
        //range:图表范围 可是字符串范围，也可是范围对象
        SetDataRange: function (chart, range) {
            if (!range) return;
            if (!chart)
                chart = retObj.Charts.GetChart();
            if ("row" in range) {
                range = retObj.GetRangeToFormula(range);
            }
            chart.dataRange(range);
        },
        //设置图表标题
        //txt:标题文本
        //fontSize:字号  数字
        //fontFamily:字体
        //color:字体颜色  css颜色
        //chart:图表对象  默认是当前选中的图表
        SetTitle: function (txt, fontSize, fontFamily, color, chart) {
            if (!chart)
                chart = retObj.Charts.GetChart();
            if (!chart)
                return;
            var title = chart.title();
            title.text = txt;
            title.color = color;
            title.fontFamily = fontFamily;
            title.fontSize = fontSize;
            chart.title(title);
        },
        //获取图表标题对象
        //chart:图表对象 默认是选中的图表
        GetTitle: function (chart) {
            if (!chart)
                chart = retObj.Charts.GetChart();
            if (!chart)
                return undefined;
            var title = chart.title();
            return {
                text: title.text,
                color: title.color,
                fontFamily: title.fontFamily,
                fontSize: title.fontSize
            }
        },
        //获取图表所属组字符串
        GetChartTypeGroup: function (chart) {
            var chartTypeCurrent = chart.chartType();
            for (var chartTypeGroup in retObj.Enum.ChartType) {
                for (var chartType in retObj.Enum.ChartType[chartTypeGroup]) {
                    if (retObj.Enum.ChartType[chartTypeGroup][chartType] == chartTypeCurrent) {
                        return chartTypeGroup;
                    }
                }
            }
        },
        //设置系列样式
        //seriesIndex:系列索引号  数字
        //backColor:系列背景色  css颜色
        //axisGroup:轴组 AxisGroup 枚举
        //borderWidth:系列边框宽度 数字
        //borderColor:系列边框颜色 css颜色
        //chart:图表对象 默认是选中的图表
        SetSeriesStyle: function (seriesIndex, backColor, axisGroup, borderWidth, borderColor, chartType, chart) {
            if (!chart)
                chart = retObj.Charts.GetChart();
            if (!chart)
                return undefined;
            var seriesItem = chart.series().get(seriesIndex);
            seriesItem.backColor = backColor;
            seriesItem.axisGroup = axisGroup;
            seriesItem.border.width = parseInt(borderWidth);
            seriesItem.border.color = borderColor;
            seriesItem.chartType = chartType;
            chart.series().set(seriesIndex, seriesItem);
        },
        //获取系列样式
        //seriesIndex:系列索引号  数字
        //chart:图表对象 默认是选中的图表
        GetSeriesStyle: function (seriesIndex, chart) {
            if (!chart)
                chart = retObj.Charts.GetChart();
            if (!chart)
                return undefined;
            var seriesItem = chart.series().get(seriesIndex);
            return {
                //rgb颜色
                backColor: retObj.GetColorByThemeColor(seriesItem.backColor),
                //轴组
                axisGroup: seriesItem.axisGroup,
                borderWidth: seriesItem.border.width,
                borderColor: retObj.GetColorByThemeColor(seriesItem.border.color),
                chartType: seriesItem.chartType
            }
        },
        //设置图表区域的样式
        //fontSize:字体  数字
        //backColor:背景颜色  css颜色
        //color:字体颜色 css颜色
        //fontFamily:字体
        //chart:图表对象 默认是选中的图表
        SetChartAreaStyle: function (fontSize, backColor, color, fontFamily, chart) {
            if (!chart)
                chart = retObj.Charts.GetChart();
            if (!chart)
                return undefined;
            var chartArea = chart.chartArea();
            chartArea.fontSize = fontSize;
            chartArea.backColor = backColor;
            chartArea.color = color;
            chartArea.fontFamily = fontFamily;
            chart.chartArea(chartArea);
        },
        //获取图表区域样式对象
        //chart:图表对象 默认是选中的图表
        GetChartAreaStyle: function (chart) {
            if (!chart)
                chart = retObj.Charts.GetChart();
            if (!chart)
                return undefined;
            var chartArea = chart.chartArea();
            return {
                fontSize: chartArea.fontSize,
                backColor: retObj.GetColorByThemeColor(chartArea.backColor),
                color: retObj.GetColorByThemeColor(chartArea.color),
                fontFamily: chartArea.fontFamily
            }
        },
        //设置图表的图例
        //position:LegendPosition枚举 图例位置
        //isShowLegend:是否显示图例 bool
        //chart:图表对象 默认是选中的图表
        SetLegend: function (position, isShowLegend, chart) {
            if (!chart)
                chart = retObj.Charts.GetChart();
            if (!chart)
                return undefined;
            //var charType = chart.chartType();
            //股票图没有图例
            //for (var stockType in retObj.Enum.ChartType.Stock) {
            //    if (retObj.Enum.ChartType.Stock[stockType] == charType) {
            //        return undefined;
            //    }
            //}
            var legend = chart.legend();
            legend.visible = isShowLegend;
            legend.position = position;
            chart.legend(legend);
        },
        //获取图表的图例对象
        //chart:图表对象 默认是选中的图表
        GetLegend: function (chart) {
            if (!chart)
                chart = retObj.Charts.GetChart();
            if (!chart)
                return undefined;
            var legend = chart.legend();
            return {
                visible: legend.visible,
                position: legend.position
            }
        },
        //设置数据标记
        //position:DataLabelPosition 枚举  根据图表不同的组来分类
        //color:标记颜色  css颜色
        //isShowValue:是否显示标记的值  bool
        //isShowSeriesName:是否显示系列的名称  bool
        //isShowCategoryName:是否显示类别 bool
        //chart:图表对象 默认是选中的图表
        SetDataLable: function (position, color, isShowValue, isShowSeriesName, isShowCategoryName, chart) {
            if (!chart)
                chart = retObj.Charts.GetChart();
            if (!chart)
                return undefined;
            var dataLabels = chart.dataLabels();
            dataLabels.position = position;
            dataLabels.color = color;
            dataLabels.showValue = isShowValue;
            dataLabels.showSeriesName = isShowSeriesName;
            dataLabels.showCategoryName = isShowCategoryName;
            chart.dataLabels(dataLabels);
        },
        //获取数据标记对象
        GetDataLable: function (chart) {
            if (!chart)
                chart = retObj.Charts.GetChart();
            if (!chart)
                return undefined;
            var dataLabels = chart.dataLabels();
            return {
                position: dataLabels.position,
                color: dataLabels.color,
                isShowValue: dataLabels.showValue,
                isShowSeriesName: dataLabels.showSeriesName,
                isShowCategoryName: dataLabels.showCategoryName
            }
        },
        //坐标轴设置
        //axisType:轴类型 AxisType枚举
        //isShow:是否显示坐标轴
        //chart:图表对象 默认是选中的图表
        Axes: function (axisType, isShow, chart) {
            if (!chart)
                chart = retObj.Charts.GetChart();
            if (!chart)
                return undefined;
            var axes = chart.axes();
            var axesTY = axes[axisType];
            axesTY.visible = isShow;
            chart.axes(axes);
            return {
                //设置坐标轴字体样式
                //color:字颜色 css颜色
                //fontFamily:字体
                //fontSize:字大小  数字
                SetFont: function (color, fontFamily, fontSize) {
                    axesTY.style.color = color;
                    axesTY.style.fontFamily = fontFamily;
                    axesTY.style.fontSize = fontSize;
                    chart.axes(axes);
                    return retObj.Charts.Axes(axisType, isShow, chart);
                },
                //获取坐标轴字体样式
                GetFont: function () {
                    return {
                        color: retObj.GetColorByThemeColor(axesTY.style.color),
                        fontFamily: axesTY.style.fontFamily,
                        fontSize: axesTY.style.fontSize
                    }
                },
                //设置坐标轴线
                //width:坐标轴线宽度  数字
                //color:坐标轴颜色  css颜色
                //tickLabelPosition:坐标轴标记  TickLabelPosition枚举
                SetLine: function (width, color, tickLabelPosition) {
                    axesTY.lineStyle.width = width;
                    axesTY.lineStyle.color = color;
                    axesTY.tickLabelPosition = tickLabelPosition;
                    chart.axes(axes);
                    return retObj.Charts.Axes(axisType, isShow, chart);
                },
                //获取坐标轴线
                GetLine: function () {
                    return {
                        width: axesTY.lineStyle.width,
                        color: axesTY.lineStyle.color,
                        tickLabelPosition: axesTY.tickLabelPosition
                    }
                },
                //设置坐标轴标题
                //text:标题文字
                //color:文字颜色 css颜色
                //fontFamily:字体
                //fontSize:字体大小  数字
                SetTitle: function (text, color, fontFamily, fontSize) {
                    axesTY.title.text = text;
                    axesTY.title.color = color;
                    axesTY.title.fontFamily = fontFamily;
                    axesTY.title.fontSize = fontSize;
                    chart.axes(axes);
                    return retObj.Charts.Axes(axisType, isShow, chart);
                },
                //获取坐标轴标题
                GetTitle: function () {
                    return {
                        text: axesTY.title.text,
                        color: axesTY.title.color,
                        fontFamily: axesTY.title.fontFamily,
                        fontSize: axesTY.title.fontSize
                    }
                },
                //设置图表格内线
                //chartGridLineType:网格线类型 ChartGridLineType枚举
                //isShowGrid:是否显示  bool
                //width:宽度 数字
                //color:网格线颜色  css颜色
                //tickMark:坐标轴刻度  TickMark枚举
                SetGridLine: function (chartGridLineType, isShowGrid, width, color, tickMark) {
                    axesTY[chartGridLineType + "GridLine"].visible = isShowGrid;
                    axesTY[chartGridLineType + "GridLine"].width = width;
                    axesTY[chartGridLineType + "GridLine"].color = color;
                    axesTY[chartGridLineType + "TickPosition"] = tickMark;
                    chart.axes(axes);
                    return retObj.Charts.Axes(axisType, isShow, chart);
                },
                //获取图表表格内线
                GetGridLine: function (chartGridLineType) {
                    return {
                        visible: axesTY[chartGridLineType + "GridLine"].visible,
                        width: axesTY[chartGridLineType + "GridLine"].width,
                        color: axesTY[chartGridLineType + "GridLine"].color,
                        tickMark: axesTY[chartGridLineType + "TickPosition"]
                    }
                }
            }
        }
    }
    ///冻结单元格
    retObj.FrozenCell = {
        //冻结所选行及以上
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        FrozenSelectRowToUp: function (cellOrRange) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            cellOrRange.sheet.frozenRowCount(parseInt(cellOrRange.row) + 1);
        },
        //冻结所选列及左边
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        FrozenSelectColumnToLeft: function (cellOrRange) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            cellOrRange.sheet.frozenColumnCount(parseInt(cellOrRange.col) + 1);
        },
        //冻结所选行和列
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        FrozenSelectRowAndColumn: function (cellOrRange) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            cellOrRange.sheet.frozenRowCount(parseInt(cellOrRange.row) + 1);
            cellOrRange.sheet.frozenColumnCount(parseInt(cellOrRange.col) + 1);
        },
        //自定义冻结行和列（都填0是取消冻结）
        //rowCount:冻结行数
        //col:冻结列数
        //sheetParam:标签序号或名称或者是sheet对象，默认是当前页签
        FrozenRowAndColumn: function (rowCount, colCount, sheetParam) {
            try {
                var sheetTemp = retObj.GetSheet(sheetParam);
                if (rowCount >= 0)
                    sheetTemp.frozenRowCount(rowCount);
                if (colCount >= 0)
                    sheetTemp.frozenColumnCount(colCount);
            } catch (e) {
                console.log("冻结行列出现错误：" + e.message);
            }
        }
    }
    //格式化单元格
    retObj.Formatter = {
        //设置格式化
        //formatStr:格式化字符串，用Formatter.FormatStr里面的方法填入
        //cellOrRange:cell对象或者range对象，不填写则为当前选择单元格
        SetFormatter: function (formatStr, cellOrRange) {
            if (!cellOrRange)
                cellOrRange = retObj.GetRange();
            cellOrRange.formatter(formatStr);
        },
        //格式化字符串
        FormatStr: {
            //字符串
            Text: function () {
                return "@";
            },
            //自动识别
            General: function () {
                return "General";
            },
            //数字
            //decimalPlaces:小数位数  默认保留2位小数
            //isPercent:是否是百分比 bool 默认false
            Number: function (decimalPlaces, isPercent) {
                var ret = "0.00";
                var regPos = /^\d+$/;
                if (regPos.test(decimalPlaces)) {
                    ret = "0";
                    for (var i = 1; i <= decimalPlaces; i++) {
                        if (i === 1)
                            ret += ".0";
                        else
                            ret += "0";
                    }
                }
                if (isPercent)
                    ret += "%";
                return ret;
            },
            //日期
            //dataFormat:日期格式化  默认格式：yyyy年MM月dd日
            //各种格式写法：
            //yyyy：年   MM：月   dd:日   hh:小时   mm:分钟   ss:秒
            //tt:上午/下午  dddd:星期几   ddd:周几
            Date: function (dateFormat) {
                if (!dateFormat)
                    return "yyyy年MM月dd日";
                else
                    return dateFormat;
            }
        }
    }
    //查找单元格内容
    retObj.Search = {
        //查询条件
        SearchCondition: {
            //查找内容
            searchString: "",
            //查询范围 数字  默认是当前页签
            //0：当前页签
            //1：整个工作簿
            searchRange: 0,
            //查询顺序 枚举SearchOrder  默认逐行查询
            searchOrder: undefined,
            //查找范围 枚举SearchFoundFlags 默认是文本范围
            searchTarget: undefined,
            //查找标记 枚举SearchFlags 默认是无配置
            searchFlags: undefined
        },
        //查找下一个
        SearchNext: function (txt) {
            var searchCondition = new spreadNS.Search.SearchCondition();
            searchCondition.searchString = (arguments.length === 1 ? txt : this.SearchCondition.searchString);
            searchCondition.searchOrder = this.SearchCondition.searchOrder ? this.SearchCondition.searchOrder : retObj.Enum.SearchOrder.ByRow;
            searchCondition.searchTarget = this.SearchCondition.searchTarget ? this.SearchCondition.searchTarget : retObj.Enum.SearchFoundFlags.cellText;
            if (this.SearchCondition.searchFlags)
                searchCondition.searchFlags = this.SearchCondition.searchFlags;

            var searchResult = null;
            if (this.SearchCondition.searchRange === 0) {
                //此段代码是查找选择的区域，但是通常不这么用
                //var sels = retObj.GetSelections();
                //if (sels.length > 1) {
                //    searchCondition.searchFlags |= spreadNS.Search.SearchFlags.blockRange;
                //} else if (sels.length == 1) {
                //    var spanInfo = getSpanInfo(sheet, sels[0].row, sels[0].col);
                //    if (sels[0].rowCount != spanInfo.rowSpan && sels[0].colCount != spanInfo.colSpan) {
                //        searchCondition.searchFlags |= spreadNS.Search.SearchFlags.blockRange;
                //    }
                //}
                searchResult = getResultSearchinSheetEnd(searchCondition);
                if (searchResult == null || searchResult.searchFoundFlag === spreadNS.Search.SearchFoundFlags.none) {
                    searchResult = getResultSearchinSheetBefore(searchCondition);
                }
            } else if (this.SearchCondition.searchRange === 1) {
                searchResult = getResultSearchinSheetEnd(searchCondition);
                if (searchResult == null || searchResult.searchFoundFlag === spreadNS.Search.SearchFoundFlags.none) {
                    searchResult = getResultSearchinWorkbookEnd(searchCondition);
                }
                if (searchResult == null || searchResult.searchFoundFlag === spreadNS.Search.SearchFoundFlags.none) {
                    searchResult = getResultSearchinWorkbookBefore(searchCondition);
                }
                if (searchResult == null || searchResult.searchFoundFlag === spreadNS.Search.SearchFoundFlags.none) {
                    searchResult = getResultSearchinSheetBefore(searchCondition);
                }
            }

            if (searchResult != null && searchResult.searchFoundFlag !== spreadNS.Search.SearchFoundFlags.none) {
                spreadMy.setActiveSheetIndex(searchResult.foundSheetIndex);
                sheet.setActiveCell(searchResult.foundRowIndex, searchResult.foundColumnIndex);
                if ((searchCondition.searchFlags & spreadNS.Search.SearchFlags.blockRange) === 0) {
                    sheet.setActiveCell(searchResult.foundRowIndex, searchResult.foundColumnIndex, 1, 1);
                }
                //scrolling
                if (searchResult.foundRowIndex < sheet.getViewportTopRow(1)
                        || searchResult.foundRowIndex > sheet.getViewportBottomRow(1)
                        || searchResult.foundColumnIndex < sheet.getViewportLeftColumn(1)
                        || searchResult.foundColumnIndex > sheet.getViewportRightColumn(1)
                        ) {
                    sheet.showCell(searchResult.foundRowIndex,
                            searchResult.foundColumnIndex,
                            spreadNS.VerticalPosition.center,
                            spreadNS.HorizontalPosition.center);
                } else {
                    sheet.repaint();
                }
            }

            function getSpanInfo(sheet, row, col) {
                var span = sheet.getSpans(new spreadNS.Range(row, col, 1, 1));
                if (span.length > 0) {
                    return { rowSpan: span[0].rowCount, colSpan: span[0].colCount };
                } else {
                    return { rowSpan: 1, colSpan: 1 };
                }
            }

            function getResultSearchinSheetEnd(searchCondition) {
                searchCondition.startSheetIndex = spreadMy.getActiveSheetIndex();
                searchCondition.endSheetIndex = spreadMy.getActiveSheetIndex();

                if (searchCondition.searchOrder === spreadNS.Search.SearchOrder.zOrder) {
                    searchCondition.findBeginRow = sheet.getActiveRowIndex();
                    searchCondition.findBeginColumn = sheet.getActiveColumnIndex() + 1;
                } else if (searchCondition.searchOrder === spreadNS.Search.SearchOrder.nOrder) {
                    searchCondition.findBeginRow = sheet.getActiveRowIndex() + 1;
                    searchCondition.findBeginColumn = sheet.getActiveColumnIndex();
                }

                if ((searchCondition.searchFlags & spreadNS.Search.SearchFlags.blockRange) > 0) {
                    var sel = sheet.getSelections()[0];
                    searchCondition.rowStart = sel.row;
                    searchCondition.columnStart = sel.col;
                    searchCondition.rowEnd = sel.row + sel.rowCount - 1;
                    searchCondition.columnEnd = sel.col + sel.colCount - 1;
                }
                var searchResult = spreadMy.search(searchCondition);
                return searchResult;
            }

            function getResultSearchinSheetBefore(searchCondition) {
                searchCondition.startSheetIndex = spreadMy.getActiveSheetIndex();
                searchCondition.endSheetIndex = spreadMy.getActiveSheetIndex();
                if ((searchCondition.searchFlags & spreadNS.Search.SearchFlags.blockRange) > 0) {
                    var sel = sheet.getSelections()[0];
                    searchCondition.rowStart = sel.row;
                    searchCondition.columnStart = sel.col;
                    searchCondition.findBeginRow = sel.row;
                    searchCondition.findBeginColumn = sel.col;
                    searchCondition.rowEnd = sel.row + sel.rowCount - 1;
                    searchCondition.columnEnd = sel.col + sel.colCount - 1;
                } else {
                    searchCondition.rowStart = -1;
                    searchCondition.columnStart = -1;
                    searchCondition.findBeginRow = -1;
                    searchCondition.findBeginColumn = -1;
                    searchCondition.rowEnd = sheet.getActiveRowIndex();
                    searchCondition.columnEnd = sheet.getActiveColumnIndex();
                }

                var searchResult = spreadMy.search(searchCondition);
                return searchResult;
            }

            function getResultSearchinWorkbookEnd(searchCondition) {
                searchCondition.rowStart = -1;
                searchCondition.columnStart = -1;
                searchCondition.findBeginRow = -1;
                searchCondition.findBeginColumn = -1;
                searchCondition.rowEnd = -1;
                searchCondition.columnEnd = -1;
                searchCondition.startSheetIndex = spreadMy.getActiveSheetIndex() + 1;
                searchCondition.endSheetIndex = -1;
                var searchResult = spreadMy.search(searchCondition);
                return searchResult;
            }

            function getResultSearchinWorkbookBefore(searchCondition) {
                searchCondition.rowStart = -1;
                searchCondition.columnStart = -1;
                searchCondition.findBeginRow = -1;
                searchCondition.findBeginColumn = -1;
                searchCondition.rowEnd = -1;
                searchCondition.columnEnd = -1;
                searchCondition.startSheetIndex = -1;
                searchCondition.endSheetIndex = spreadMy.getActiveSheetIndex() - 1;
                var searchResult = spreadMy.search(searchCondition);
                return searchResult;
            }
        }
    }
    //单元格填充
    retObj.FillAuto = {
        //自动填充类型
        //startRange:起始范围
        //wholeRange:填充范围
        //fillSeries:FillSeries枚举  填充系列  行或列
        //sheetParam:标签序号或名称或者是sheet对象，默认是当前页签
        Auto: function (startRange, wholeRange, fillSeries, sheetParam) {
            var sheetTemp = retObj.GetSheet(sheetParam);
            sheetTemp.fillAuto(retObj.GetActualCellRange(startRange), retObj.GetActualCellRange(wholeRange), {
                fillType: retObj.Enum.FillType.auto,
                series: fillSeries
            });
        },
        //日期填充类型
        //startRange:起始范围
        //wholeRange:填充范围
        //fillSeries:FillSeries枚举  填充系列 行或列
        //step:增长数
        //stop:截止日期 javascript Date对象
        //fillDateUnit:增长日期类型 枚举  年 月 日 周
        //sheetParam:标签序号或名称或者是sheet对象，默认是当前页签
        Date: function (startRange, wholeRange, fillSeries, step, stop, fillDateUnit, sheetParam) {
            var sheetTemp = retObj.GetSheet(sheetParam);
            sheetTemp.fillAuto(retObj.GetActualCellRange(startRange), retObj.GetActualCellRange(wholeRange), {
                series: fillSeries,
                unit: fillDateUnit,
                step: step,
                stop: stop,
                fillType: retObj.Enum.FillType.date
            });
        },
        //增长填充类型(成倍増长)
        //startRange:起始范围
        //wholeRange:填充范围
        //fillSeries:FillSeries枚举  填充系列 行或列
        //step:增长倍数
        //stop:结果截止数
        //sheetParam:标签序号或名称或者是sheet对象，默认是当前页签
        Growth: function (startRange, wholeRange, fillSeries, step, stop, sheetParam) {
            var sheetTemp = retObj.GetSheet(sheetParam);
            sheetTemp.fillAuto(retObj.GetActualCellRange(startRange), retObj.GetActualCellRange(wholeRange), {
                series: fillSeries,
                step: step,
                stop: stop,
                fillType: retObj.Enum.FillType.growth
            });
        },
        //按方向填充，重复填充起始范围的内容
        //startRange:起始范围
        //wholeRange:填充范围
        //fillDirection:FillDirection枚举  填充方向
        //sheetParam:标签序号或名称或者是sheet对象，默认是当前页签
        Direction: function (startRange, wholeRange, fillDirection, sheetParam) {
            var sheetTemp = retObj.GetSheet(sheetParam);
            sheetTemp.fillAuto(retObj.GetActualCellRange(startRange), retObj.GetActualCellRange(wholeRange), {
                fillType: retObj.Enum.FillType.direction,
                direction: fillDirection
            });
        },
        //线性增长填充类型(类似数据库自增列)
        //startRange:起始范围
        //wholeRange:填充范围
        //fillSeries:FillSeries枚举  填充系列 行或列
        //step:增长数
        //stop:结束增长的数字
        //sheetParam:标签序号或名称或者是sheet对象，默认是当前页签
        Linear: function (startRange, wholeRange, fillSeries, step, stop, sheetParam) {
            var sheetTemp = retObj.GetSheet(sheetParam);
            sheetTemp.fillAuto(startRange, wholeRange, {
                series: fillSeries,
                step: step,
                stop: stop,
                fillType: retObj.Enum.FillType.linear
            });
        }
    }
    
    //浮动对象
    retObj.FloatingObject = {
        /**
         * 添加浮动对象
         * @param {string} name 浮动对象名称
         * @param {number} x x轴坐标
         * @param {number} y y轴坐标
         * @param {number} width 浮动对象宽度
         * @param {number} height 浮动对象高度
         * @param {sheet} sheetParam 标签序号或名称或者是sheet对象，默认是当前页签
         * @returns {FloatingObject} 
         */
        AddFloating: function (name, x, y, width, height, html, sheetParam) {
            var sheetTemp = retObj.GetSheet(sheetParam);
            var customFloatingObject = new GC.Spread.Sheets.FloatingObjects.FloatingObject(name, x, y, width, height);
            var div = document.createElement('div');
            $(div).css("heigth", "100%").css("width", "100%");
            div.innerHTML = html;
            customFloatingObject.content(div);
            return sheetTemp.floatingObjects.add(customFloatingObject);
        }
    }
    //所有枚举
    retObj.Enum = {
        //表格内置样式
        TableThemes: {
            dark1: GC.Spread.Sheets.Tables.TableThemes.dark1,
            dark2: GC.Spread.Sheets.Tables.TableThemes.dark2,
            dark3: GC.Spread.Sheets.Tables.TableThemes.dark3,
            dark4: GC.Spread.Sheets.Tables.TableThemes.dark4,
            dark5: GC.Spread.Sheets.Tables.TableThemes.dark5,
            dark6: GC.Spread.Sheets.Tables.TableThemes.dark6,
            dark7: GC.Spread.Sheets.Tables.TableThemes.dark7,
            dark8: GC.Spread.Sheets.Tables.TableThemes.dark8,
            dark9: GC.Spread.Sheets.Tables.TableThemes.dark9,
            dark10: GC.Spread.Sheets.Tables.TableThemes.dark10,
            dark11: GC.Spread.Sheets.Tables.TableThemes.dark11,
            dark12: GC.Spread.Sheets.Tables.TableThemes.dark12,
            light1: GC.Spread.Sheets.Tables.TableThemes.light1,
            light2: GC.Spread.Sheets.Tables.TableThemes.light2,
            light3: GC.Spread.Sheets.Tables.TableThemes.light3,
            light4: GC.Spread.Sheets.Tables.TableThemes.light4,
            light5: GC.Spread.Sheets.Tables.TableThemes.light5,
            light6: GC.Spread.Sheets.Tables.TableThemes.light6,
            light7: GC.Spread.Sheets.Tables.TableThemes.light7,
            light8: GC.Spread.Sheets.Tables.TableThemes.light8,
            light9: GC.Spread.Sheets.Tables.TableThemes.light9,
            light10: GC.Spread.Sheets.Tables.TableThemes.light10,
            light11: GC.Spread.Sheets.Tables.TableThemes.light11,
            light12: GC.Spread.Sheets.Tables.TableThemes.light12,
            light13: GC.Spread.Sheets.Tables.TableThemes.light13,
            light14: GC.Spread.Sheets.Tables.TableThemes.light14,
            light15: GC.Spread.Sheets.Tables.TableThemes.light15,
            light16: GC.Spread.Sheets.Tables.TableThemes.light16,
            light17: GC.Spread.Sheets.Tables.TableThemes.light17,
            light18: GC.Spread.Sheets.Tables.TableThemes.light18,
            light19: GC.Spread.Sheets.Tables.TableThemes.light19,
            light20: GC.Spread.Sheets.Tables.TableThemes.light20,
            light21: GC.Spread.Sheets.Tables.TableThemes.light21,
            medium1: GC.Spread.Sheets.Tables.TableThemes.medium1,
            medium2: GC.Spread.Sheets.Tables.TableThemes.medium2,
            medium3: GC.Spread.Sheets.Tables.TableThemes.medium3,
            medium4: GC.Spread.Sheets.Tables.TableThemes.medium4,
            medium5: GC.Spread.Sheets.Tables.TableThemes.medium5,
            medium6: GC.Spread.Sheets.Tables.TableThemes.medium6,
            medium7: GC.Spread.Sheets.Tables.TableThemes.medium7,
            medium8: GC.Spread.Sheets.Tables.TableThemes.medium8,
            medium9: GC.Spread.Sheets.Tables.TableThemes.medium9,
            medium10: GC.Spread.Sheets.Tables.TableThemes.medium10,
            medium11: GC.Spread.Sheets.Tables.TableThemes.medium11,
            medium12: GC.Spread.Sheets.Tables.TableThemes.medium12,
            medium13: GC.Spread.Sheets.Tables.TableThemes.medium13,
            medium14: GC.Spread.Sheets.Tables.TableThemes.medium14,
            medium15: GC.Spread.Sheets.Tables.TableThemes.medium15,
            medium16: GC.Spread.Sheets.Tables.TableThemes.medium16,
            medium17: GC.Spread.Sheets.Tables.TableThemes.medium17,
            medium18: GC.Spread.Sheets.Tables.TableThemes.medium18,
            medium19: GC.Spread.Sheets.Tables.TableThemes.medium19,
            medium20: GC.Spread.Sheets.Tables.TableThemes.medium20,
            medium21: GC.Spread.Sheets.Tables.TableThemes.medium21,
            medium22: GC.Spread.Sheets.Tables.TableThemes.medium22,
            medium23: GC.Spread.Sheets.Tables.TableThemes.medium23,
            medium24: GC.Spread.Sheets.Tables.TableThemes.medium24,
            medium25: GC.Spread.Sheets.Tables.TableThemes.medium25,
            medium26: GC.Spread.Sheets.Tables.TableThemes.medium26,
            medium27: GC.Spread.Sheets.Tables.TableThemes.medium27,
            medium28: GC.Spread.Sheets.Tables.TableThemes.medium28
        },
        //图表网格线类型
        ChartGridLineType: {
            //主要刻度
            major: "major",
            //次要刻度
            minor: "minor"
        },
        //坐标轴标记显示位置
        TickLabelPosition: {
            //紧挨着坐标轴
            nextToAxis: spreadNS.Charts.TickLabelPosition.nextToAxis,
            //不显示
            none: spreadNS.Charts.TickLabelPosition.none
        },
        //坐标轴刻度显示方式
        TickMark: {
            //交叉
            cross: spreadNS.Charts.TickMark.cross,
            //内部
            inside: spreadNS.Charts.TickMark.inside,
            //不显示
            none: spreadNS.Charts.TickMark.none,
            //外部
            outside: spreadNS.Charts.TickMark.outside
        },
        //坐标轴类型
        AxisType: {
            //主坐标轴类别(横轴)
            primaryCategory: "primaryCategory",
            //主坐标轴值(纵轴)
            primaryValue: "primaryValue",
            //次坐标轴类别(横轴)
            secondaryCategory: "secondaryCategory",
            //次坐标轴值(纵轴)
            secondaryValue: "secondaryValue"
        },
        //图表轴组
        AxisGroup: {
            //主要的
            primary: spreadNS.Charts.AxisGroup.primary,
            //次要的
            secondary: spreadNS.Charts.AxisGroup.secondary
        },
        //图表图例位置枚举
        LegendPosition: {
            bottom: spreadNS.Charts.LegendPosition.bottom,
            left: spreadNS.Charts.LegendPosition.left,
            right: spreadNS.Charts.LegendPosition.right,
            top: spreadNS.Charts.LegendPosition.top
        },
        //自动填充的填充类型
        FillType: {
            //自动
            auto: spreadNS.Fill.FillType.auto,
            //日期
            date: spreadNS.Fill.FillType.date,
            //方向
            direction: spreadNS.Fill.FillType.direction,
            //增长
            growth: spreadNS.Fill.FillType.growth,
            //线性
            linear: spreadNS.Fill.FillType.linear
        },
        //自动填充系列
        FillSeries: {
            column: spreadNS.Fill.FillSeries.column,
            row: spreadNS.Fill.FillSeries.row
        },
        //自动填充方向
        FillDirection: {
            down: spreadNS.Fill.FillDirection.down,
            left: spreadNS.Fill.FillDirection.left,
            right: spreadNS.Fill.FillDirection.right,
            up: spreadNS.Fill.FillDirection.up
        },
        //自动填充日期填充方式
        FillDateUnit: {
            day: spreadNS.Fill.FillDateUnit.day,
            month: spreadNS.Fill.FillDateUnit.month,
            weekday: spreadNS.Fill.FillDateUnit.weekday,
            year: spreadNS.Fill.FillDateUnit.year
        },
        //查找标记
        SearchFlags: {
            //忽略大小写
            ignoreCase: spreadNS.Search.SearchFlags.ignoreCase,
            //单元格全字匹配
            exactMatch: spreadNS.Search.SearchFlags.exactMatch,
            //使用通配符
            useWildCards: spreadNS.Search.SearchFlags.useWildCards
        },
        //查找内容范围
        SearchFoundFlags: {
            //文本
            cellText: spreadNS.Search.SearchFoundFlags.cellText,
            //公式
            cellFormula: spreadNS.Search.SearchFoundFlags.cellFormula
        },
        //查询顺序
        SearchOrder: {
            //逐行查询
            ByRow: spreadNS.Search.SearchOrder.zOrder,
            //逐列查询
            ByColumn: spreadNS.Search.SearchOrder.nOrder
        },
        //清除单元格类型
        StorageType: {
            //Indicates the storage data type is the axis information.
            axis: spreadNS.StorageType.axis,
            //Indicates the storage data type is data binding path.
            bindingPath: spreadNS.StorageType.bindingPath,
            //Indicates the storage data type is comment.
            comment: spreadNS.StorageType.comment,
            //Indicates the storage data type is pure value.
            data: spreadNS.StorageType.data,
            //Indicates the storage data type is sparkline.
            sparkline: spreadNS.StorageType.sparkline,
            //	Indicates the storage data type is style.
            style: spreadNS.StorageType.style,
            //Indicates the storage data type is tag.
            tag: spreadNS.StorageType.tag
        },
        //水平对齐方式
        HorizontalAlign: {
            center: spreadNS.HorizontalAlign.center,
            general: spreadNS.HorizontalAlign.general,
            left: spreadNS.HorizontalAlign.left,
            right: spreadNS.HorizontalAlign.right
        },
        //垂直对齐方式
        VerticalAlign: {
            bottom: spreadNS.VerticalAlign.bottom,
            center: spreadNS.VerticalAlign.center,
            top: spreadNS.VerticalAlign.top
        },
        //边框线位置
        LinePostion: {
            all: { all: true },
            left: { left: true },
            top: { top: true },
            right: { right: true },
            bottom: { bottom: true },
            outline: { outline: true },
            inside: { inside: true },
            innerHorizontal: { innerHorizontal: true },
            innerVertical: { innerVertical: true }
        },
        //边框样式
        LineStyle: {
            //Indicates a border line with dash-dot.
            dashDot: spreadNS.LineStyle.dashDot,
            //Indicates a border line with dash-dot-dot.
            dashDotDot: spreadNS.LineStyle.dashDotDot,
            //Indicates a border line with dashes.
            dashed: spreadNS.LineStyle.dashed,
            //Indicates a border line with dots.
            dotted: spreadNS.LineStyle.dotted,
            //Indicates a double border line.
            double: spreadNS.LineStyle.double,
            //Indicates a border line without a style.
            empty: spreadNS.LineStyle.empty,
            //Indicates a border line with all dots.
            hair: spreadNS.LineStyle.hair,
            //Indicates a medium border line with a solid line.
            medium: spreadNS.LineStyle.medium,
            //Indicates a medium border line with dash-dot.
            mediumDashDot: spreadNS.LineStyle.mediumDashDot,
            //Indicates a medium border line with dash-dot-dot.
            mediumDashDotDot: spreadNS.LineStyle.mediumDashDotDot,
            //Indicates a medium border line with dashes.
            mediumDashed: spreadNS.LineStyle.mediumDashed,
            //Indicates a slanted border line with dash-dot.
            slantedDashDot: spreadNS.LineStyle.slantedDashDot,
            //Indicates a thick border line with a solid line.
            thick: spreadNS.LineStyle.thick,
            //Indicates a border line with a solid thin line.
            thin: spreadNS.LineStyle.thin
        },
        //页签区域枚举
        SheetArea: {
            colHeader: spreadNS.SheetArea.colHeader,
            corner: spreadNS.SheetArea.corner,
            rowHeader: spreadNS.SheetArea.rowHeader,
            //当前可视区域
            viewport: spreadNS.SheetArea.viewport
        },
        //文字修饰
        TextDecorationType: {
            //Specifies to display a line through the text.
            lineThrough: spreadNS.TextDecorationType.lineThrough,
            //Specifies normal text.
            none: spreadNS.TextDecorationType.none,
            //Specifies to display a line above the text.
            overline: spreadNS.TextDecorationType.overline,
            //Specifies to display a line below the text.
            underline: spreadNS.TextDecorationType.underline
        },
        //文字加粗、斜体、正常
        FontMark: {
            //加粗
            bold: "bold",
            //斜体
            italic: "italic",
            //正常
            normal: "normal",
            //加粗和斜体
            bold_italic: "bold italic"
        },
        //打印居中方向
        PrintCentering: {
            //Centers the printed layout both horizontally and vertically on the page.
            both: spreadNS.Print.PrintCentering.both,
            //Centers the printed layout horizontally on the page.
            horizontal: spreadNS.Print.PrintCentering.horizontal,
            //Does not center the printed page at all.
            none: spreadNS.Print.PrintCentering.none,
            //Centers the printed layout vertically on the page.
            vertical: spreadNS.Print.PrintCentering.vertical
        },
        //打印显示类型
        PrintVisibilityType: {
            //隐藏
            hide: spreadNS.Print.PrintVisibilityType.hide,
            //继承
            inherit: spreadNS.Print.PrintVisibilityType.inherit,
            //显示
            show: spreadNS.Print.PrintVisibilityType.show,
            //显示一次
            showOnce: spreadNS.Print.PrintVisibilityType.showOnce
        },
        //单元格类型
        CellTypes: {
            Base: spreadNS.CellTypes.Base(),
            Button: spreadNS.CellTypes.Button(),
            CheckBox: spreadNS.CellTypes.CheckBox(),
            ColumnHeader: spreadNS.CellTypes.ColumnHeader(),
            ComboBox: spreadNS.CellTypes.ComboBox(),
            Corner: spreadNS.CellTypes.Corner(),
            //超链接
            HyperLink: spreadNS.CellTypes.HyperLink(),
            RowHeader: spreadNS.CellTypes.RowHeader(),
            Text: spreadNS.CellTypes.Text(),
            //单元格填写html
            Html: new HtmlCellType(),
            //单元格斜线
            Diagonal: new DiagonalCellType()
        },
        //图表类型
        ChartType: {
            //组合图
            combo: spreadNS.Charts.ChartType.combo,
            //面积图
            Area: {
                //面积图
                area: spreadNS.Charts.ChartType.area,
                //堆积面积图
                areaStacked: spreadNS.Charts.ChartType.areaStacked,
                //百分比堆积面积图
                areaStacked100: spreadNS.Charts.ChartType.areaStacked100
            },
            //条形图
            Bar: {
                //簇状条形图
                barClustered: spreadNS.Charts.ChartType.barClustered,
                //堆积条形图
                barStacked: spreadNS.Charts.ChartType.barStacked,
                //百分比堆积条形图
                barStacked100: spreadNS.Charts.ChartType.barStacked100
            },
            //柱形图
            Column: {
                //簇状柱形图
                columnClustered: spreadNS.Charts.ChartType.columnClustered,
                //堆积柱形图
                columnStacked: spreadNS.Charts.ChartType.columnStacked,
                //百分比堆积柱形图
                columnStacked100: spreadNS.Charts.ChartType.columnStacked100
            },
            //折线图
            Line: {
                //折线图
                line: spreadNS.Charts.ChartType.line,
                //带数据标记的折线图
                lineMarkers: spreadNS.Charts.ChartType.lineMarkers,
                //堆积折线图
                lineMarkersStacked: spreadNS.Charts.ChartType.lineMarkersStacked,
                //百分比堆积折线图
                lineMarkersStacked100: spreadNS.Charts.ChartType.lineMarkersStacked100,
                //带数据标记的堆积折线图
                lineStacked: spreadNS.Charts.ChartType.lineStacked,
                //带数据标记的百分比堆积折线图
                lineStacked100: spreadNS.Charts.ChartType.lineStacked100
            },
            //饼图
            Pie: {
                //饼图
                pie: spreadNS.Charts.ChartType.pie,
                //圆环图
                doughnut: spreadNS.Charts.ChartType.doughnut
            },
            //X Y散点图
            Scatter: {
                //散点图
                xyScatter: spreadNS.Charts.ChartType.xyScatter,
                //带平滑线和数据标记的散点图
                xyScatterLines: spreadNS.Charts.ChartType.xyScatterLines,
                //带平滑线的散点图
                xyScatterLinesNoMarkers: spreadNS.Charts.ChartType.xyScatterLinesNoMarkers,
                //带直线和数据标记的散点图
                xyScatterSmooth: spreadNS.Charts.ChartType.xyScatterSmooth,
                //带直线的散点图
                xyScatterSmoothNoMarkers: spreadNS.Charts.ChartType.xyScatterSmoothNoMarkers,
                //气泡图
                bubble: spreadNS.Charts.ChartType.bubble
            }
            //股价图（不提供）
            //Stock: {
            //    stockHLC: spreadNS.Charts.ChartType.stockHLC,
            //    stockOHLC: spreadNS.Charts.ChartType.stockOHLC,
            //    stockVHLC: spreadNS.Charts.ChartType.stockVHLC,
            //    stockVOHLC: spreadNS.Charts.ChartType.stockVOHLC
            //}
        },
        //图表数据标记位置
        DataLabelPosition: {
            //条形图
            Bar: {
                center: spreadNS.Charts.DataLabelPosition.center,
                insideEnd: spreadNS.Charts.DataLabelPosition.insideEnd,
                outsideEnd: spreadNS.Charts.DataLabelPosition.outsideEnd
            },
            //柱状图
            Column: {
                center: spreadNS.Charts.DataLabelPosition.center,
                insideEnd: spreadNS.Charts.DataLabelPosition.insideEnd,
                outsideEnd: spreadNS.Charts.DataLabelPosition.outsideEnd
            },
            //折线图
            Line: {
                center: spreadNS.Charts.DataLabelPosition.center,
                above: spreadNS.Charts.DataLabelPosition.above,
                below: spreadNS.Charts.DataLabelPosition.below
            },
            //饼图
            Pie: {
                center: spreadNS.Charts.DataLabelPosition.center,
                insideEnd: spreadNS.Charts.DataLabelPosition.insideEnd,
                outsideEnd: spreadNS.Charts.DataLabelPosition.outsideEnd,
                bestFit: spreadNS.Charts.DataLabelPosition.bestFit
            },
            //散点图
            Scatter: {
                center: spreadNS.Charts.DataLabelPosition.center,
                above: spreadNS.Charts.DataLabelPosition.above,
                below: spreadNS.Charts.DataLabelPosition.below
            }
        },
        //事件类型(未列出全部，只列出常用的)
        EventType: {
            //args:oldSheet, newSheet
            ActiveSheetChanged: spreadNS.Events.ActiveSheetChanged,
            //args:oldSheet, newSheet, cancel
            //cancel:是否取消本次操作 bool
            ActiveSheetChanging: spreadNS.Events.ActiveSheetChanging,
            //args:sheet, sheetName, row, col, sheetArea
            ButtonClicked: spreadNS.Events.ButtonClicked,
            //args:sheet, sheetName, row, col, sheetArea, propertyName
            CellChanged: spreadNS.Events.CellChanged,
            //args:sheet, sheetName, sheetArea, row, col
            CellClick: spreadNS.Events.CellClick,
            //args:sheet, sheetName, sheetArea, row, col
            CellDoubleClick: spreadNS.Events.CellDoubleClick,
            //args:sheet, sheetName, col, sheetArea, propertyName
            //propertyName:操作类型 addColumns/deleteColumns
            ColumnChanged: spreadNS.Events.ColumnChanged,
            //args:sheet, sheetName, colList, header
            //header:是否是表头的列 bool
            ColumnWidthChanged: spreadNS.Events.ColumnWidthChanged,
            //args:sheet, sheetName, colList, header, cancel
            //cancel:是否取消本次操作 bool
            ColumnWidthChanging: spreadNS.Events.ColumnWidthChanging,
            //args:sheet, sheetName, row, col, editingText
            EditChange: spreadNS.Events.EditChange,
            //args:sheet, sheetName, row, col, editingText
            EditEnded: spreadNS.Events.EditEnded,
            //args:sheet, sheetName, row, col, editingText, cancel
            //cancel:是否取消本次操作 bool
            EditEnding: spreadNS.Events.EditEnding,
            //args:sheet, sheetName, row, col, cancel
            //cancel:是否取消本次操作 bool
            EditStarting: spreadNS.Events.EditStarting,
            //args:sheet, sheetName, row, col
            EditStarted: spreadNS.Events.EditStarted,
            //args:sheet, sheetName, row, col
            EnterCell: spreadNS.Events.EnterCell,
            //args:sheet, sheetName, row, col, cancel
            //cancel:是否取消本次操作 bool
            LeaveCell: spreadNS.Events.LeaveCell,
            //args:sheet, sheetName, rowList, header
            //header:是否是列头的行 bool
            RowHeightChanged: spreadNS.Events.RowHeightChanged,
            //args:sheet, sheetName, rowList, header, cancel
            //cancel:是否取消本次操作 bool
            RowHeightChanging: spreadNS.Events.RowHeightChanging,
            //args:sheet, sheetName, row, sheetArea, propertyName
            //propertyName:操作类型 addRows/deleteRows
            RowChanged: spreadNS.Events.RowChanged,
            //args:sheet, sheetName, oldSelections, newSelections
            SelectionChanged: spreadNS.Events.SelectionChanged,
            //args:sheet, sheetName, oldSelections, newSelections
            SelectionChanging: spreadNS.Events.SelectionChanging,
            //args:sheet,oldValue,newValue
            SheetNameChanged: spreadNS.Events.SheetNameChanged,
            //args:sheet,oldValue,newValue,cancel
            SheetNameChanging: spreadNS.Events.SheetNameChanging,
            //args:sheet, sheetName, sheetTabIndex
            SheetTabClick: spreadNS.Events.SheetTabClick,
            //args:sheet, sheetName, sheetTabIndex
            SheetTabDoubleClick: spreadNS.Events.SheetTabDoubleClick,
            SheetMoved:spreadNS.Events.SheetMoved,
            //args:sheet, sheetName, row, col, oldValue, newValue
            ValueChanged: spreadNS.Events.ValueChanged,
            //args:
            TopRowChanged:spreadNS.Events.TopRowChanged,
            //args:
            LeftColumnChanged: spreadNS.Events.LeftColumnChanged
        },
        //单元格范围相对还是绝对
        RangeReferenceRelative: {
            allAbsolute: sheetsCalc.RangeReferenceRelative.allAbsolute,
            allRelative: sheetsCalc.RangeReferenceRelative.allRelative,
            rowRelative: sheetsCalc.RangeReferenceRelative.rowRelative,
            startRowRelative: sheetsCalc.RangeReferenceRelative.startRowRelative,
            endRowRelative: sheetsCalc.RangeReferenceRelative.endRowRelative,
            colRelative: sheetsCalc.RangeReferenceRelative.colRelative,
            startColRelative: sheetsCalc.RangeReferenceRelative.startColRelative,
            endColRelative: sheetsCalc.RangeReferenceRelative.endColRelative
        },
        CopyToOptions: {
            //Indicates all types of data.
            all: spreadNS.CopyToOptions.all,
            //Indicates the type of data is a binding path.
            bindingPath: spreadNS.CopyToOptions.bindingPath,
            //Indicates the type of data is a comment.
            comment: spreadNS.CopyToOptions.comment,
            //Indicates the type of data is a conditional format.
            conditionalFormat: spreadNS.CopyToOptions.conditionalFormat,
            //Indicates the type of data is a formula.
            formula: spreadNS.CopyToOptions.formula,
            //Indicates to copy a range group.
            outline: spreadNS.CopyToOptions.outline,
            //Indicates to copy a span.
            span: spreadNS.CopyToOptions.span,
            //Indicates the type of data is a sparkline.
            sparkline: spreadNS.CopyToOptions.sparkline,
            //Indicates the type of data is a style.
            style: spreadNS.CopyToOptions.style,
            //Indicates the type of data is a tag.
            tag: spreadNS.CopyToOptions.tag,
            //Indicates the type of data is pure data.
            value: spreadNS.CopyToOptions.value
        }
    }
    //返回所填枚举值的文字内容
    //例：a:{x:"1",y:"2"}  GetEnumContentName(a,"1") 返回"x"
    //enumType:枚举类型
    //value:枚举具体值
    retObj.GetEnumContentName = function (enumType, value) {
        if (enumType) {
            for (var name in enumType) {
                if (enumType[name] === value) {
                    return name;
                }
            }
        }
        return "";
    }
    return retObj;
}
//html单元格类型
function HtmlCellType() { }
HtmlCellType.prototype = new GC.Spread.Sheets.CellTypes.Base;
HtmlCellType.prototype.paint = function (ctx, value, x, y, w, h, style, context) {
    var DOMURL = window.URL || window.webkitURL || window;
    var cell = context.sheet.getCell(context.row, context.col);
    var img = cell.tag();
    if (img) {
        try {
            ctx.save();
            ctx.rect(x, y, w, h);
            ctx.clip();
            ctx.drawImage(img, x + 2, y + 2);
            ctx.restore();
            cell.tag(null);
            return;
        }
        catch (err) {
            GC.Spread.Sheets.CellTypes.Base.prototype.paint.apply(this, [ctx, "#HTMLError", x, y, w, h, style, context]);
            cell.tag(null);
            return;
        }
    }
    var svgPattern = '<svg xmlns="http://www.w3.org/2000/svg" width="{0}" height="{1}">' +
        '<foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="font:{2}">{3}</div></foreignObject></svg>';

    var data = svgPattern.replace("{0}", w).replace("{1}", h).replace("{2}", style.font).replace("{3}", value);
    var doc = document.implementation.createHTMLDocument("");
    doc.write(data);
    // Get well-formed markup
    data = (new XMLSerializer()).serializeToString(doc.body.children[0]);

    img = new Image();
    var svg = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
    var url = DOMURL.createObjectURL(svg);
    img.src = url;
    //img.src = 'data:image/svg+xml;base64,' + window.btoa(data);
    cell.tag(img);
    img.onload = function () {
        context.sheet.repaint(new GC.Spread.Sheets.Rect(x, y, w, h));
    }
};

//单元格内斜线类型
function DiagonalCellType() { }
DiagonalCellType.prototype = new GC.Spread.Sheets.CellTypes.Base;
DiagonalCellType.prototype.paint = function (ctx, value, x, y, w, h, style, options) {
    //Paints a cell on the canvas. 

    if (!ctx) {
        return;
    }
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y + h);
    ctx.stroke();
    ctx.font = style.font;

    var text = value ? value.split(",") : ["", ""];
    ctx.fillText(text[0].trim(), x + w * 7 / 8, y + h / 3);
    ctx.fillText(text[1].trim(), x + w / 2, y + h * 3 / 4);

    ctx.restore();
};
//自定义公式  阶乘
function FactorialFunction() {
    this.name = "FACTORIAL";
    this.maxArgs = 1;
    this.minArgs = 1;
}
FactorialFunction.prototype = new GC.Spread.CalcEngine.Functions.Function();
FactorialFunction.prototype.evaluate = function (arg) {
    var result = 1;
    if (arguments.length === 1 && !isNaN(parseInt(arg))) {
        for (var i = 1; i <= arg; i++) {
            result = i * result;
        }
        return result;
    }
    return "#VALUE!";
}