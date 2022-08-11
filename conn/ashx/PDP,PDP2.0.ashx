<%@ WebHandler Language="C#" Class="PDP2Handler" %>

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.SessionState;
using System.Text.RegularExpressions;

using YshJWT;

public class PDP2Handler : IHttpHandler, IRequiresSessionState
{
    public void ProcessRequest(HttpContext context)
    {

        try
        {
            using (YshGrid.CreateDBManager())
            {
                

                int n0 = System.Environment.TickCount;
                AjaxPro.AjaxHandlerFactory fac = new AjaxPro.AjaxHandlerFactory();
                IHttpHandler handle = fac.GetHandler(context, context.Request.RequestType, "~/ajaxpro/PDP,PDP2.0.ashx", "~/ajaxpro/PDP,PDP2.0.ashx");
                if (handle == null) return;
                context.Handler = handle;
                handle.ProcessRequest(context);
                int n1 = System.Environment.TickCount;
                GudUsing.Log.AddContent(string.Format("{0},{1},{2}", n0, n1, n1 - n0));
            }
        }
        catch (Exception e)
        {
            GudUsing.ExceptHelper.Log(e);
            context.Response.Write("[false,0,\"" + e.Message + "\"]");
        }
        finally
        {
            context.Response.End();
        }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}