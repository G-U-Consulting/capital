//namespace experiann.Code {
using Newtonsoft.Json.Linq;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using orca.Code.Logger;
using System.Numerics;
using Org.BouncyCastle.Utilities;

namespace orca.Code.Crypto {
    public static class Crypto {
        private static X509Certificate2? cert;
        public static string ProcessRequest(HttpRequest request, HttpResponse response, string op, string body, string rootPath) {
            response.ContentType = "application/json";
            JObject result = new JObject(), jbody;
            if (op == "getpublickey") {
                response.ContentType = "text/plain";
                string key = File.ReadAllText(Path.Combine(rootPath, "Cert", "ext-public-key.pem"));
                return key;
            } else if (op == "rsaencrypt") {
                response.ContentType = "text/plain";
                return RSAEncrypt(body, rootPath);
            } else if (op == "rsadecrypt") {
                response.ContentType = "text/plain";
                return RSADecrypt(body, rootPath);
            } else if (op == "aesencrypt") {
                response.ContentType = "text/plain";
                jbody = JObject.Parse(body);
                return AESEncrypt(jbody["key"].Value<string>(), jbody["text"].Value<string>());
            } else if (op == "aesdecrypt") {
                response.ContentType = "text/plain";
                jbody = JObject.Parse(body);
                return AESDecrypt(jbody["key"].Value<string>(), jbody["text"].Value<string>());
            }
            return result.ToString(Newtonsoft.Json.Formatting.None);
        }
        public static string RSAEncrypt(string text, string rootPath) {
            string ret = null;
            Init(rootPath);
            RSA rsaObj = cert.GetRSAPublicKey();
            ret = Convert.ToBase64String(rsaObj.Encrypt(Encoding.UTF8.GetBytes(text), RSAEncryptionPadding.OaepSHA256));
            return ret;
        }
        public static string RSADecrypt(string text, string rootPath) {
            string ret = null;
            Init(rootPath);
            RSA rsaObj = cert.GetRSAPrivateKey();
            ret = Encoding.UTF8.GetString(rsaObj.Decrypt(Convert.FromBase64String(text), RSAEncryptionPadding.OaepSHA256));
            return ret;
        }
        private static void Init(string rootPath) {
            if (cert == null) {
                cert = X509CertificateLoader.LoadPkcs12FromFile(Path.Combine(rootPath, "Cert", "ext-key.pfx"), "serlefin", 
                                X509KeyStorageFlags.EphemeralKeySet
                                | X509KeyStorageFlags.MachineKeySet
                                //| X509KeyStorageFlags.PersistKeySet
                                | X509KeyStorageFlags.Exportable);
            }
        }
        private static Aes aesAlg;
        private static ICryptoTransform aesEncryptor;
        private static ICryptoTransform aesDecryptor;
        private static string aesKey;
        public static void UpdateAES(string key) {
            if (key != aesKey) {
                if (aesAlg != null)
                    aesAlg.Dispose();
                aesAlg = Aes.Create();
                aesAlg.Key = StringToByteArray(key);
                aesAlg.Mode = CipherMode.ECB;
                aesAlg.Padding = PaddingMode.PKCS7;
                aesEncryptor = aesAlg.CreateEncryptor();
                aesDecryptor = aesAlg.CreateDecryptor();
                aesKey = key;
            }
        }
        public static string AESEncrypt(string key, string text) {
            UpdateAES(key);
            byte[] encryptedBytes;
            using (var msEncrypt = new System.IO.MemoryStream()) {
                using (var csEncrypt = new CryptoStream(msEncrypt, aesEncryptor, CryptoStreamMode.Write)) {
                    byte[] plainBytes = Encoding.UTF8.GetBytes(text);
                    csEncrypt.Write(plainBytes, 0, plainBytes.Length);
                }
                encryptedBytes = msEncrypt.ToArray();
            }
            return BitConverter.ToString(encryptedBytes).Replace("-", "");
        }
        public static string AESDecrypt(string key, string text) {
            UpdateAES(key);
            byte[] ciphertext = StringToByteArray(text);
            byte[] decryptedBytes;
            using (var msDecrypt = new System.IO.MemoryStream(ciphertext)) {
                using (var csDecrypt = new CryptoStream(msDecrypt, aesDecryptor, CryptoStreamMode.Read)) {
                    using (var msPlain = new System.IO.MemoryStream()) {
                        csDecrypt.CopyTo(msPlain);
                        decryptedBytes = msPlain.ToArray();
                    }
                }
            }
            return Encoding.UTF8.GetString(decryptedBytes);
        }
        private static byte[] Pkcs5UnPadding(byte[] cipherText) {
            byte paddingByte = cipherText[cipherText.Length - 1];
            byte[] bytes = new byte[] { paddingByte };
            int padding = (int)new BigInteger(bytes);
            return Arrays.CopyOfRange(cipherText, 0, cipherText.Length - padding);
        }
        private static byte[] Pkcs5Padding(byte[] cipherText, int blockSize) {
            int paddingSize = blockSize - cipherText.Length % blockSize;
            byte[] bytes = new byte[paddingSize];
            for (int i = 0; i < bytes.Length; i++) {
                bytes[i] = intToByte(paddingSize)[0];
            }

            return cipherText.Concat(bytes).ToArray();
        }
        private static byte[] intToByte(int val) {
            byte[] b = new byte[4];
            b[0] = (byte)(val & 0xff);
            b[1] = (byte)((val >> 8) & 0xff);
            b[2] = (byte)((val >> 16) & 0xff);
            b[3] = (byte)((val >> 24) & 0xff);
            return b;
        }
        public static byte[] StringToByteArray(string hex) {
            if (hex.Length % 2 == 1)
                throw new Exception("The binary key cannot have an odd number of digits");

            byte[] arr = new byte[hex.Length >> 1];

            for (int i = 0; i < hex.Length >> 1; ++i) {
                arr[i] = (byte)((GetHexVal(hex[i << 1]) << 4) + (GetHexVal(hex[(i << 1) + 1])));
            }

            return arr;
        }
        public static int GetHexVal(char hex) {
            int val = (int)hex;
            //For uppercase A-F letters:
            //return val - (val < 58 ? 48 : 55);
            //For lowercase a-f letters:
            //return val - (val < 58 ? 48 : 87);
            //Or the two combined, but a bit slower:
            return val - (val < 58 ? 48 : (val < 97 ? 55 : 87));
        }
    }
}
