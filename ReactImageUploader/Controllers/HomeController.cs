using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ReactImageUploader.Models;
using System.Web.UI;
using ReactImageUploader.Helpers;
using System.Collections.Specialized;
using System.IO;

namespace ReactImageUploader.Controllers
{
    public class HomeController : Controller
    {
        private readonly IList<OrderezeTask.Image> _images;

        public HomeController()
        {
            ImageMethods im = new ImageMethods();
            List<OrderezeTask.Image> list = new List<OrderezeTask.Image>();
            list = im.GetImages();

            _images = list;
        }

        [OutputCache(Location = OutputCacheLocation.None)]
        public ActionResult Images()
        {
            return Json(_images, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult AddImage(ImageModel image)
        {
            if (image.File.ContentLength > 0 && !string.IsNullOrEmpty(image.Name))
            {
                ImageMethods az = new ImageMethods();
                OrderezeTask.Image tmpImage = new OrderezeTask.Image();
                
                HttpPostedFileBase file = image.File;

                string FileExtension = string.Empty;
                try
                {
                    FileExtension = System.IO.Path.GetExtension(file.FileName).Substring(1);
                }
                catch { }

                tmpImage.Name = image.Name + "." + FileExtension;
                tmpImage.Description = image.Description;
                tmpImage.ImagePath = "https://geoklar.blob.core.windows.net/images/" + image.Name + "." + FileExtension;
                int id = az.AddNewImage(tmpImage);
                if (id > 0)
                {
                    BinaryReader b = new BinaryReader(file.InputStream);
                    byte[] binData = b.ReadBytes(file.ContentLength);
                    az.UploadBlob(binData, image.Name + "." + FileExtension);
                    return Content("Success :)");
                }
            }

            //_images.Add(image);
            return Content("Fail :(");
        }

        [HttpPost]
        public ActionResult DeleteImage(ImageModel image)
        {
            int id = 0;
            id = image.Id;
            if (id > 0)
            {
                ImageMethods az = new ImageMethods();

                az.DeleteImage(id);
                az.DeleteBlob(image.Name);
                return Content("Success :)");
                //_images.Add(image);
            }
            return Content("Fail :(");
        }

        // GET: Home
        public ActionResult Index()
        {
            return View();
        }
    }
}