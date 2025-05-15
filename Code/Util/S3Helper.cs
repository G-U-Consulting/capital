using Amazon.S3;
using Amazon.S3.Model;
using Newtonsoft.Json.Linq;
using System.Numerics;
using System.Runtime.CompilerServices;
using System.Security.AccessControl;

namespace capital.Code.Util {
    public class S3Helper {
        private string cachePath, connectionString, bucketName;
        private IAmazonS3 client;
        private Dictionary<string, Tuple<string, string>> memoryCache;
        public S3Helper s3Helper = null;

        public S3Helper(string localroot, string connectionString) {
            this.connectionString = connectionString;
            cachePath = Path.Combine("wwwroot", "cache");
            if(!Directory.Exists(cachePath))
                Directory.CreateDirectory(cachePath);
            memoryCache = new Dictionary<string, Tuple<string, string>>();
        }
        public S3Helper GetInstance(string localroot, string connectionString) { 
            if(s3Helper == null)
                s3Helper = new S3Helper(localroot, connectionString);
            return s3Helper;
        }
        private async Task Init() {
            if(client == null) { 
                string sdata = await WebBDUt.ExecuteLocalSQL<string>("General/Get_Variable", ["@nombre_variable"], ["DatosS3"], connectionString);
                JObject jdata = JObject.Parse(sdata);
                client = new AmazonS3Client(jdata["awsAccessKeyId"].Value<string>(), jdata["awsSecretAccessKey"].Value<string>());
                bucketName = jdata["bucketName"].Value<string>();
            }
        }
        public async Task<S3HelperUploadResponse> UploadFile(string filePath, string fileName, bool memoryCache, string user, bool deleteSource) {
            S3HelperUploadResponse response = new S3HelperUploadResponse();
            try {
                await Init();
                string objectName = Guid.NewGuid().ToString();
                PutObjectRequest request = new PutObjectRequest {
                    BucketName = bucketName,
                    Key = objectName,
                    FilePath = filePath
                };
                await client.PutObjectAsync(request);
                response.Id = await WebBDUt.ExecuteLocalSQL<string>("Documentos/Ins_Documento",
                    ["@documento", "@llave", "@cache_memoria", "@usuario"],
                    [fileName, objectName, memoryCache, user],
                    connectionString);
                response.Success = true;
                response.CacheKey = objectName  ;
                response.Message = "OK";
                string scachePath = Path.Combine(cachePath, objectName);
                File.Copy(filePath, scachePath);
                if(deleteSource)
                    File.Delete(filePath);
            } catch (Exception ex) {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }
        public async Task<S3HelperDownloadResponse> DownloadFileByKey(string key) {
            S3HelperDownloadResponse response = new S3HelperDownloadResponse();
            try {
                string scachePath = Path.Combine(cachePath, key);
                if (!File.Exists(scachePath)) {
                    GetObjectRequest request = new GetObjectRequest {
                        BucketName = bucketName,
                        Key = key
                    };
                    using GetObjectResponse oresponse = await client.GetObjectAsync(request);
                    await oresponse.WriteResponseStreamToFileAsync(scachePath, true, CancellationToken.None);
                    if (oresponse.HttpStatusCode == System.Net.HttpStatusCode.OK) {
                        response.Success = true;
                        response.Path = scachePath;
                        response.Message = "OK";
                    } else {
                        response.Success = false;
                        response.Message = oresponse.HttpStatusCode + "";
                    }
                }
            } catch (Exception ex) {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }
    }
    public class S3HelperUploadResponse {
        public bool Success;
        public string Id;
        public string CacheKey;
        public string Message;
    }
    public class S3HelperDownloadResponse {
        public bool Success;
        public string Path;
        public string Message;
    }
}
