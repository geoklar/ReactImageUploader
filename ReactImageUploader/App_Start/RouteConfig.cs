using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace ReactImageUploader
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Images",
                url: "images",
                defaults: new { controller = "Home", action = "Images" }
            );

            routes.MapRoute(
                name: "NewImage",
                url: "images/new",
                defaults: new { controller = "Home", action = "AddImage" }
            );

            routes.MapRoute(
                name: "DelImage",
                url: "images/delete",
                defaults: new { controller = "Home", action = "DeleteImage" }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
