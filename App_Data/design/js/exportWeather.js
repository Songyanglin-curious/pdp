let testAshx = "/conn/ashx/ExportWeather.ashx";
this.exportWeather = function () {
    console.log("导出天气")
    $.ajax({
        type: "post",
        url: testAshx,
        datatype: "text",
        data: { "TestAction": "getBaiduUrl" },
        success: function (result) {
            console.log(result)
        },
        error: function (data, status, e) {
            console.log(data)
            console.log(status)
            console.log(e)
            return false;
        }
    });
}