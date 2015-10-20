using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;
using System.Data.SqlClient;
using System.Web.UI.WebControls;

namespace ReactImageUploader.Helpers
{
    public class ImageMethods : OrderezeTask.IImagesService
    {
        StorageCredentials sc;
        CloudStorageAccount storageAccount;

        private string connectionString = Properties.Settings.Default.DatabaseConnectionString;
        private string databaseImagesTable = Properties.Settings.Default.DatabaseImagesTable;

        public ImageMethods()
        {
            sc = new StorageCredentials(Properties.Settings.Default.StorageUsername, Properties.Settings.Default.StorageAccessKey);
            storageAccount = new CloudStorageAccount(sc, false);
        }

        public void UploadBlob(byte[] data, string name)
        {
            try
            {
                CloudBlobClient blobclient = storageAccount.CreateCloudBlobClient();
                CloudBlobContainer container = blobclient.GetContainerReference(Properties.Settings.Default.StorageContainer);
                CloudBlockBlob blockblob = container.GetBlockBlobReference(name);
                using (var stream = new System.IO.MemoryStream(data, writable: false))
                {
                    blockblob.UploadFromStream(stream);
                }
            }
            catch { }
        }

        public void DeleteBlob(string name)
        {
            try
            {
                CloudBlobClient blobclient = storageAccount.CreateCloudBlobClient();
                CloudBlobContainer container = blobclient.GetContainerReference(Properties.Settings.Default.StorageContainer);
                CloudBlockBlob blockblob = container.GetBlockBlobReference(name);
                blockblob.Delete();
            }
            catch { }
        }

        public int AddNewImage(OrderezeTask.Image image)
        {
            int id = 0;
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    try
                    {
                        SqlCommand cmd = new SqlCommand("INSERT INTO " + databaseImagesTable + " (Name, Description, ImagePath) VALUES (@Name, @Description, @ImagePath)");
                        //cmd.CommandType = CommandType.Text;
                        cmd.Connection = connection;
                        cmd.Parameters.AddWithValue("@Name", image.Name);
                        cmd.Parameters.AddWithValue("@Description", image.Description);
                        cmd.Parameters.AddWithValue("@ImagePath", "https://geoklar.blob.core.windows.net/images/" + image.Name);
                        connection.Open();
                        id = cmd.ExecuteNonQuery();

                    }
                    catch (Exception ex)
                    {
                        ex.ToString();
                    }
                }
            }
            catch { }

            return id;
        }

        public List<OrderezeTask.Image> GetImages()
        {
            List<OrderezeTask.Image> list = new List<OrderezeTask.Image>();
            OrderezeTask.Image image;
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    try
                    {
                        SqlCommand cmd = new SqlCommand("Select Id, Name, Description, ImagePath From " + databaseImagesTable);
                        //cmd.CommandType = CommandType.Text;
                        cmd.Connection = connection;
                        connection.Open();
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                image = new OrderezeTask.Image();
                                image.Id = reader.GetInt32(0);
                                image.Name = reader.GetString(1);
                                image.Description = reader.GetString(2);
                                image.ImagePath = reader.GetString(3);
                                list.Add(image);
                            }
                        }

                    }
                    catch (Exception ex)
                    {
                        ex.ToString();
                    }
                }
            }
            catch { }

            return list;
        }

        public void DeleteImage(int id)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    try
                    {
                        SqlCommand cmd = new SqlCommand("DELETE FROM " + databaseImagesTable + " WHERE Id=@Id");
                        //cmd.CommandType = CommandType.Text;
                        cmd.Connection = connection;
                        cmd.Parameters.AddWithValue("@Id", id);
                        connection.Open();
                        id = cmd.ExecuteNonQuery();

                    }
                    catch (Exception ex)
                    {
                        ex.ToString();
                    }
                }
            }
            catch { }
        }
    }
}