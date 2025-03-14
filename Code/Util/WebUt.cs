using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Web;

/// <summary>
/// Summary description for WebUt
/// </summary>
public static class WebUt {
    private static string[] proxySites = {  };
    public static string WebRequest(string url, string method, string body, string contentType, Dictionary<string, string> headers = null, X509Certificate2 cert = null) {
        bool useProxy = false;
        string finalUrl = url;
        for (int i = 0; i < proxySites.Length; i++) {
            if (url.Contains(proxySites[i])) {
                useProxy = true;
                //finalUrl = "https://192.168.200.193/API/SProxy.ashx";
                finalUrl = "http://192.168.200.7/chatdaviplata/API/SProxy.ashx";
                break;
            }
        }
        string result = null;
        HttpWebRequest httpWebRequest = (HttpWebRequest)System.Net.WebRequest.Create(finalUrl);
        if (contentType != null)
            httpWebRequest.ContentType = contentType;
        if (headers != null)
            foreach (KeyValuePair<string, string> item in headers)
                httpWebRequest.Headers.Add(item.Key, item.Value);
        if (useProxy) {
            httpWebRequest.Headers.Add("sproxy", url);
            httpWebRequest.Headers.Add("method", method);
            method = "POST";
        }
        httpWebRequest.Method = method;
        if (cert != null) httpWebRequest.ClientCertificates.Add(cert);
        if (body != null)
            using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream())) {
                streamWriter.Write(body);
                streamWriter.Flush();
                streamWriter.Close();
            }

        HttpWebResponse httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
        using (var streamReader = new StreamReader(httpResponse.GetResponseStream())) {
            result = streamReader.ReadToEnd();
        }
        return result;
    }
}