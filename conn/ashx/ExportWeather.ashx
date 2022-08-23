<%@ WebHandler Language="C#" Class="ExportWeather" %>

using System;
using System.Collections.Generic;
//using System.Linq;
using System.Text;
using System.Web;
using System.Web.SessionState;
using System.Text.RegularExpressions;
using System.Net;
using System.IO;

public class ExportWeather : IHttpHandler {

    public void ProcessRequest (HttpContext context) {
         var Request = context.Request;
         context.Response.Write(context.Request);
        
            /*
        string strFilePath = WebUsing.RequestHelper.GetRequestString(Request, "path", "").Trim();
        string strPathLower = strFilePath.ToLower();
        if (strPathLower.EndsWith(".dll") || strPathLower.EndsWith(".cs") || strPathLower.EndsWith(".ashx") || strPathLower.EndsWith(".aspx"))
            return;
        string arg = WebUsing.RequestHelper.GetRequestString(Request, "arg", "").Trim(); // 下载参数//attachment,inline
        if (!string.IsNullOrEmpty(arg))
        {
            if (!arg.EndsWith(";"))
                arg += ";";
        }
        string filename = p.Server.UrlEncode(WebUsing.RequestHelper.GetRequestString(Request, "name", ""));
        string path = p.Server.MapPath(strFilePath);
        System.IO.FileInfo fi = new System.IO.FileInfo(path);
        //判断文件是否存在
        if (!fi.Exists)
            return;
        if (string.IsNullOrEmpty(filename))
            filename = fi.Name;
        //将文件保存到本机上
        p.Response.Clear();
        
        String fileName = URLEncoder.encode(atta.getFileName(), "UTF-8");
        if (fileName.length() > 150) {
            String guessCharset = xxxx /根据request的locale 得出可能的编码，中文操作系统通常是gb2312/
            fileName = new String(atta.getFileName().getBytes(guessCharset), "ISO8859-1");
        }
        response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
        
        p.Response.AddHeader("Content-Disposition", arg + "filename=" + filename);   // AddHeader：交一个HTTP标头添加到输出流
        p.Response.AddHeader("Content-Length", fi.Length.ToString());
        // ContentType：获取或设置HTTP标头的类型
        p.Response.ContentType = "application/octet-stream";
        //获取或设置包装筛选器对象，该对象用于在专输之前用于修改HTTP实体主体
        p.Response.Filter.Close();
        //  将文件的内容直接作为文件块直接写入HTTP响应的输出流
        p.Response.WriteFile(fi.FullName);
        p.Response.End();
         */  
    }

    public bool IsReusable {
        get {
            return false;
        }
    }

}