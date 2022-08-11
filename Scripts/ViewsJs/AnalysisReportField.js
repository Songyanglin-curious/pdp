/// <reference path="../../ReportDetail/scripts/SpreadJsHelper.js" />
/// <reference path="../jquery/jquery-1.11.1.js" />
/// <reference path="../../ReportDetail/scripts/MySpOperate.js" />
/**
* 解析自定义字段
* @param {SpreadJs} spMy SpreadJsHelper帮助类
* @return{}
*/
var ReportFieldAnalysis = function (spMy) {
    //spMy = new SpreadJs();//spMy就是这个
    var allField = [];//增加列addCount属性，来计算绑定多少列
    var retObj = {
        /**
         * 传入要解析的字段
         * @param {ReportField[]} _allField ReportField.js中的All
         * @returns {} 
         */
        SetAllField: function (_allField) {
            if (_allField)
                allField = JSON.parse(JSON.stringify(_allField));
            else
                allField = [];
        },
        /**
         * 解析查询结果,二维数据的自动合并没有用，默认值没有用，而且肯定有数据
         * @param {arrary} fieldResults Field模型数组
         * @returns {} 
         */
        Analysis: function (fieldResults) {
            for (var i = 0; i < allField.length; i++) {
                var field = allField[i];
                var resultField = fieldResults.find(function (f) { return f.Id === field.id });
                if (resultField) {
                    $.extend(field, resultField);
                } else {
                    field.FieldResult = [];
                    field.isTwoDimensional = false;
                }
            }
            spMy.SuspendPaint();
            this.calcFieldRowCol();
            for (var j = 0; j < allField.length; j++) {
                var f = allField[j];
                this.AddFieldResult(f);
            }
            this.MergeAllCell();
            spMy.ResumePaint();
        },
        /**
         * 计算字段行列最终位置，以及增长数
         */
        calcFieldRowCol: function () {
            if (allField.length > 0) {
                var arrSheets = [];//页签总个数
                for (var m = 0; m < allField.length; m++) {
                    if (arrSheets.indexOf(allField[m].sheetName) < 0)
                        arrSheets.push(allField[m].sheetName);
                }
                //按页签计算添加的行数和列数
                for (var n = 0; n < arrSheets.length; n++) {
                    var sheetName = arrSheets[n];
                    var arrRows = [];
                    var arrCols = [];
                    for (var i = 0; i < allField.length; i++) {
                        var f = allField[i];
                        if (f.sheetName !== sheetName)
                            continue;
                        if (arrRows.indexOf(f.row) < 0 && (f.inc || f.vinc && f.isTwoDimensional))
                            arrRows.push(f.row);
                        if (arrCols.indexOf(f.col) < 0 && (f.vinc || f.inc && f.isTwoDimensional))
                            arrCols.push(f.col);
                    }
                    //从小到大排序
                    arrRows.sort(function (a, b) { return a - b });
                    arrCols.sort(function (a, b) { return a - b });
                    //先算行
                    this.addRowAndCol(arrRows, sheetName, true);
                    //再算列
                    this.addRowAndCol(arrCols, sheetName, false);
                    //计算字段添加总数
                    this.AddFieldAddCount(sheetName);
                    //计算字段公式
                    this.CalcFormula(sheetName);
                    //计算图表范围
                    this.CalcCharts(sheetName);
                    //填充自增行列
                    this.AutoFillRowOrCol(sheetName);
                    //计算条件格式
                    this.CalcConditionStyle(sheetName);
                }
            }
        },
        /**
         * 给页签，添加行或列
         * @param {arrary} arrRowOrCol 行号数组
         * @param {string} sheetName 页签名称
         * @param {bool} isRow 是否是行
         * @returns {} 
         */
        addRowAndCol: function (arrRowOrCol, sheetName, isRow) {
            for (var j = 0; j < arrRowOrCol.length; j++) {
                var addCount = 0;//添加的行数
                for (var k = 0; k < allField.length; k++) {
                    var f = allField[k];
                    //非当前页签，非本行
                    if (f.sheetName !== sheetName || (isRow ? f.row : f.col) !== arrRowOrCol[j])
                        continue;
                    //非当前类型自增，或者二维数组的非当前类型自增
                    if ((isRow ? !f.inc : !f.vinc) && (!f.isTwoDimensional && isRow ? !f.vinc : !f.inc))
                        continue;

                    //二维数组判断
                    if (f.isTwoDimensional && (!isRow && f.inc || isRow && f.vinc)) {
                        //如果是行，并且是自增列，则计算结果的列数,结果为List<List<string>>
                        if (f.FieldResult[0].length - 1 > addCount)
                            addCount = f.FieldResult[0].length - 1;
                    } else if (f.FieldResult.length - 1 > addCount)
                        //非二维数组判断
                        addCount = f.FieldResult.length - 1;
                }
                if (addCount === 0)
                    continue;//未添加则继续
                //给大于计算行和列的字段添加起始行列值
                for (var l = 0; l < allField.length; l++) {
                    var fm = allField[l];
                    if (fm.sheetName !== sheetName) continue;
                    if (isRow && fm.row > arrRowOrCol[j])
                        fm.row += addCount;
                    if (!isRow && fm.col > arrRowOrCol[j])
                        fm.col += addCount;
                }
                //添加计算完的行或列
                if (isRow) {
                    spMy.AddRows(arrRowOrCol[j] + 1, addCount, sheetName);
                    //复制新增行上边单元格样式
                    for (var radd = 1; radd <= addCount; radd++) {
                        for (var c = 0; c < spMy.GetSheetColumnCount(sheetName) ; c++) {
                            var startRange = spMy.GetRange(arrRowOrCol[j], c, 1, 1, sheetName);
                            spMy.CopyTo(startRange, arrRowOrCol[j] + radd, c, 1, 1, spMy.Enum.CopyToOptions.style);
                        }
                    }
                } else {
                    spMy.AddColumns(arrRowOrCol[j] + 1, addCount, sheetName);
                    //复制新增列左边单元格样式
                    for (var cadd = 1; cadd <= addCount; cadd++) {
                        for (var r = 0; r < spMy.GetSheetRowCount(sheetName) ; r++) {
                            var startRange2 = spMy.GetRange(r, arrRowOrCol[j], 1, 1, sheetName);
                            spMy.CopyTo(startRange2, r, arrRowOrCol[j] + cadd, 1, 1, spMy.Enum.CopyToOptions.style);
                        }
                    }
                }
            }
        },
        /**
         * 给字段添加字段增长总数
         * @returns {} 
         */
        AddFieldAddCount: function (sheetName) {
            var groupNames = [];//所有组名
            for (var i = 0; i < allField.length; i++) {
                var f = allField[i];
                if (f.sheetName !== sheetName)
                    continue;
                if (!f.groupName) {
                    if ((f.inc || f.vinc) && f.FieldResult.length > 0) {
                        f.addCount = f.FieldResult.length;
                    } else
                        f.addCount = 1;
                    this.FieldRowColCount(f);
                }
                else if (groupNames.indexOf(f.groupName) < 0)
                    groupNames.push(f.groupName);
            }
            for (var j = 0; j < groupNames.length; j++) {
                var groupName = groupNames[j];
                var groupMaxAdd = 1;
                var groupField = allField.filter(function (f) { return f.sheetName === sheetName && f.groupName === groupName });
                groupField.forEach(function (f) {
                    if (groupMaxAdd < f.FieldResult.length)
                        groupMaxAdd = f.FieldResult.length;
                });
                for (var k = 0; k < allField.length; k++) {
                    var f = allField[k];
                    if (f.groupName === groupName && f.sheetName === sheetName) {
                        f.addCount = groupMaxAdd;
                        this.FieldRowColCount(f);
                    }
                }
            }
        },
        /**
         * 计算字段的最终行数和列数
         * @returns {} 
         */
        FieldRowColCount: function (f) {
            var rowCount = f.inc ? f.addCount : 1;
            var colCount = f.vinc ? f.addCount : 1;
            //二维数组肯定有数据
            if (f.isTwoDimensional) {
                var moreCount = f.FieldResult[0].length - 1;
                rowCount = f.inc ? rowCount : rowCount + moreCount;
                colCount = f.vinc ? colCount : colCount + moreCount;
            }
            f.rowCount = rowCount;
            f.colCount = colCount;
        },
        /**
         * 自增行自增列，将单元格内容自动填充到增长目的单元格
         * @param {string} sheetName 页签名称
         * @returns {} 
         */
        AutoFillRowOrCol: function (sheetName) {
            for (var l = 0; l < allField.length; l++) {
                var f = allField[l];
                if (f.sheetName !== sheetName) continue;
                if (!f.inc && !f.vinc) continue;
                var direction = f.inc ? spMy.Enum.FillDirection.down : spMy.Enum.FillDirection.right;
                var startRange = spMy.GetCell(f.row, f.col, sheetName);
                var wholeRange = spMy.GetRange(f.row, f.col, f.rowCount, f.colCount, sheetName);
                var cellValue = spMy.GetValue(startRange);
                if (!spMy.GetFormula(startRange) && typeof (cellValue) === "number") //数字类型，线性增长
                    spMy.FillAuto.Auto(startRange, wholeRange, f.inc ? spMy.Enum.FillSeries.column : spMy.Enum.FillSeries.row, sheetName);
                else { //填充自增单元格
                    if (f.isTwoDimensional) {
                        var otherDirection;
                        var otherStartRange;
                        var otherWholeRange;
                        if (direction === spMy.Enum.FillDirection.down) {
                            wholeRange = spMy.GetRange(f.row, f.col, f.rowCount, 1, sheetName);
                            otherWholeRange = spMy.GetRange(f.row, f.col, 1, f.colCount, sheetName);
                            otherDirection = spMy.Enum.FillDirection.right;
                            otherStartRange = spMy.GetRange(f.row, f.col, f.rowCount, 1, sheetName);
                        } else {
                            wholeRange = spMy.GetRange(f.row, f.col, 1, f.colCount, sheetName);
                            otherWholeRange = spMy.GetRange(f.row, f.col, f.rowCount, 1, sheetName);
                            otherDirection = spMy.Enum.FillDirection.down;
                            otherStartRange = spMy.GetRange(f.row, f.col, 1, f.colCount, sheetName);
                        }
                        spMy.FillAuto.Direction(startRange, wholeRange, direction, sheetName);
                        spMy.FillAuto.Direction(otherStartRange, otherWholeRange, otherDirection, sheetName);
                    }
                    else
                        spMy.FillAuto.Direction(startRange, wholeRange, direction, sheetName);
                }
            }
        },
        /**
         * 解析条件格式
         * @param {} sheetName 
         * @returns {} 
         */
        CalcConditionStyle: function (sheetName) {
            var conFormats = spMy.GetSheet(sheetName).conditionalFormats;
            var rules = conFormats.getRules();
            for (var i = 0; i < allField.length; i++) {
                var f = allField[i];
                if (f.sheetName !== sheetName) continue;
                if (!f.inc && !f.vinc) continue;

                for (var k = 0; k < rules.length; k++) {
                    if (conFormats.containsRule(rules[k], f.row, f.col)) {
                        var rule = {};
                        $.extend(true, rule, rules[k]);//复制条件格式，重建才能生效
                        rule.ranges([spMy.GetActualCellRange(f.row, f.col, f.rowCount, f.colCount)]);
                        conFormats.removeRule(rules[k]);
                        conFormats.addRule(rule);
                        break;
                    }
                }
            }
        },
        /**
         * 计算公式,
         * 若是字段公式，则将范围替换成实际的固定范围（$F$1这种），如果选中没有字段，则将范围替换成固定范围
         * 若不是字段公式，根据字段的自增情况，来替换选择的最终范围
         * @param {} sheetName 
         * @returns {} 
         */
        CalcFormula: function (sheetName) {
            for (var i = 0; i < allField.length; i++) {
                var f = allField[i];
                if (f.sheetName !== sheetName) continue;
                var fCell = spMy.GetCell(f.row, f.col);
                var formulaText = spMy.GetFormula(fCell);
                if (f.formula) {
                    if (formulaText && f.formulaSetting.length > 0) {
                        var formulaRanges = spMy.GetFormulaToRanges(formulaText, sheetName);
                        var formulaStartField, formulaEndField; //公式中开始字段和结束字段
                        var rangeText; //范围文本
                        var replaceText; //替换的文本
                        var replaceRange; //替换的范围
                        for (var l = 0; l < f.formulaSetting.length; l++) {
                            var fRange = formulaRanges[f.formulaSetting[l]];
                            if (fRange) {
                                rangeText = spMy.GetRangeToFormula(fRange);
                                formulaStartField = allField.find(function (ff) { return ff.row == fRange.row && ff.col == fRange.col });
                                //默认，将公式范围，替换成固定范围，如$H$1:$P$2
                                replaceRange = fRange;
                                //起始单元格有字段  或者  起始、结束单元格都有字段，才进行正常替换
                                if (formulaStartField) {
                                    //一个单元格范围
                                    if (fRange.rowCount === 1 && fRange.colCount === 1) {
                                        replaceRange = spMy.GetActualCellRange(formulaStartField.row, formulaStartField.col, formulaStartField.rowCount, formulaStartField.colCount);
                                    } else {
                                        //多单元格范围
                                        formulaEndField = allField.find(function (ff) { return ff.row == fRange.row + fRange.rowCount - 1 && ff.col == fRange.col + fRange.colCount - 1 });
                                        if (formulaEndField) {
                                            var rowCount = formulaStartField.row === formulaEndField.row ? formulaEndField.rowCount : formulaEndField.row - formulaStartField.row + 1;
                                            var colCount = formulaStartField.col === formulaEndField.col ? formulaEndField.colCount : formulaEndField.col - formulaStartField.col + 1;
                                            replaceRange = spMy.GetActualCellRange(formulaStartField.row, formulaStartField.col, rowCount, colCount);
                                        }
                                    }
                                }
                                replaceText = spMy.GetRangeToFormula(replaceRange);
                                formulaText = formulaText.replace(rangeText, replaceText);
                            }
                        }
                        spMy.SetFormula(formulaText, fCell); //设置解析完的公式
                    }
                }
            }
        },
        /**
         * 解析图表
         * @param {} sheetName 
         * @returns {} 
         */
        CalcCharts: function (sheetName) {
            var allCharts = spMy.Charts.GetAllChart(sheetName);
            for (var i = 0; i < allCharts.length; i++) {
                var chart = allCharts[i];
                var chartRange = spMy.Charts.GetChartRange(chart, sheetName, true);
                //只找图表范围右下角的单元格
                var endField = allField.find(function (f) { return f.row === (chartRange.row + chartRange.rowCount - 1) && f.col === (chartRange.col + chartRange.colCount - 1) });
                if (endField) {
                    //如果有字段则解析字段最终位置
                    var finalRange = spMy.GetRange(chartRange.row, chartRange.col, endField.rowCount, endField.colCount, sheetName);
                    spMy.Charts.SetDataRange(chart, finalRange);
                }
            }
        },
        /**
         * 填充字段
         * @param {} field 
         * @param {} data 
         * @returns {} 
         */
        AddFieldResult: function (field) {
            var data = [];
            if (field.FieldResult)
                data = field.FieldResult;
            //既不是自增行列，增长数又大于1的，肯定是有组，看组是自增行或列，给它也赋上
            if (!field.inc && !field.vinc && field.addCount > 1) {
                var fGroup = allField.find(function (f) {
                    return f.groupName === field.groupName && f.sheetName === field.sheetName && (f.inc || f.vinc);
                });
                field.inc = fGroup.inc;
                field.vinc = fGroup.vinc;
            }
            //根据添加数，添加内容
            for (var i = 0; i < field.addCount; i++) {
                var row = field.row + (field.inc ? i : 0);
                var col = field.col + (field.vinc ? i : 0);
                this.FillCellContent(field, data[i], row, col);
            }
        },
        /**
         * 根据数据填充单元格，有可能是二位数组的一组数据
         * @param {object} field 字段
         * @param {string} data 数据
         * @param {number} row 行
         * @param {number} col 列
         * @returns {} 
         */
        FillCellContent: function (field, data, row, col) {
            var defaultValue = field.Default ? field.Default : "";
            data = (data == undefined ? defaultValue : data);
            var fieldDesc = '{' + field.desc + '}';
            var cell = spMy.GetCell(row, col, field.sheetName);
            var cellValue = spMy.GetValue(cell);
            var cellFormula = spMy.GetFormula(cell);
            if (cellValue === null || cellValue == undefined)
                cellValue = "";
            cellValue = cellValue + "";//强转字符串
            if (field.isTwoDimensional) {
                //处理二维数组
                //非自增，就填第一列
                if (!field.inc && !field.vinc)
                    this.SetCellValue(cell, cellValue, fieldDesc, data[0], cellFormula);
                else {
                    for (var i = 0; i < data.length; i++) {
                        var twoCell = spMy.GetCell(row + (field.vinc ? i : 0), col + (field.inc ? i : 0), field.sheetName);
                        this.SetCellValue(twoCell, cellValue, fieldDesc, data[i], cellFormula);
                    }
                }
            } else {
                this.SetCellValue(cell, cellValue, fieldDesc, data, cellFormula);
            }
        },
        /**
         * 填充1个单元格
         * @param {cell} cell 单元格对象
         * @param {string} cellValue 单元格当前值
         * @param {string} fieldDesc 字段描述
         * @param {string} data 填充数据
         * @param {string} cellFormula 公式内容
         * @returns {} 
         */
        SetCellValue: function (cell, cellValue, fieldDesc, data, cellFormula) {
            if (cellFormula) {
                cellFormula = cellFormula.replace("\"s{", "\"S{").replace("\"n{", "\"N{");
                if (data == "") {
                    cellFormula = cellFormula.replace("\"S" + fieldDesc + "\"", "\"\"").replace("\"" + "N" + fieldDesc + "\"", "0");
                    spMy.SetFormula(cellFormula, cell);
                } else {
                    cellFormula = cellFormula.replace("\"S" + fieldDesc + "\"", "\"" + data + "\"").replace("\"S" + fieldDesc+"\"", "\""+data+"\"");
                    spMy.SetFormula(cellFormula, cell);
                }
            } else {
                var cellType = cell.cellType();
                var finalData = cellValue.replace(fieldDesc, data);
                spMy.SetValue(finalData, cell, cellType);
            }
        },
        /**
         * 计算合并单元格，因为有可能出现一个单元格绑定多个字段，所以要单独拿出来计算
         * @returns {} 
         */
        MergeAllCell: function () {
            for (var i = 0; i < allField.length; i++) {
                var f = allField[i];
                //二维数据不合并
                if (f.autoMerge && !f.isTwoDimensional) {
                    var startRow = undefined;
                    var startCol = undefined;
                    var mergeRowCount = undefined;
                    var mergeColCount = undefined;
                    //从第二个数据开始计算
                    for (var j = 1; j < f.addCount; j++) {
                        var row = f.row + (f.inc ? j : 0);
                        var col = f.col + (f.vinc ? j : 0);
                        var rowPre = row - (f.inc ? 1 : 0);
                        var colPre = col - (f.vinc ? 1 : 0);
                        //只要是显示相同就合并，所以用GetText
                        var preCellText = spMy.GetText(spMy.GetCell(rowPre, colPre, f.sheetName));
                        var curCellText = spMy.GetText(spMy.GetCell(row, col, f.sheetName));
                        if (preCellText === curCellText) {
                            if (startRow == undefined) {
                                startRow = rowPre;
                                startCol = colPre;
                                mergeRowCount = f.inc ? 2 : 1;
                                mergeColCount = f.vinc ? 2 : 1;
                            } else {
                                mergeRowCount = mergeRowCount + (f.inc ? 1 : 0);
                                mergeColCount = mergeColCount + (f.vinc ? 1 : 0);
                            }
                            if (f.addCount === j+1)//如果是最后一个，则合并
                                spMy.MergeCell(spMy.GetRange(startRow, startCol, mergeRowCount, mergeColCount, f.sheetName));
                        } else if (startRow != undefined && preCellText !== curCellText) {
                            spMy.MergeCell(spMy.GetRange(startRow, startCol, mergeRowCount, mergeColCount, f.sheetName));
                            startRow = undefined;
                            startCol = undefined;
                            mergeRowCount = undefined;
                            mergeColCount = undefined;
                        }
                    }
                }
            }
        }
    }
    return retObj;
}