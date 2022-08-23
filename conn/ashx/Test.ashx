<%@ WebHandler Language="C#" Class="Test" %>

using System;
using System.Web;

public class Test : IHttpHandler {

    public void ProcessRequest (HttpContext context) {
        Console.WriteLine(context);
        context.Response.ContentType = "text/plain";
        if (context.Request["TestAction"] == "getBaiduUrl")
        {
            context.Response.Write("百度: https://www.baidu.com");
        }
    }

    public bool IsReusable {
        get {
            return false;
        }
    }

}