using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http.Headers;
using System.Security.Cryptography.X509Certificates;
using System.Web;

/// <summary>
/// Summary description for WebUt
/// </summary>
public static class WebUt {
    private static string[] proxySites = {  };
    private static HttpClient client = new HttpClient();
    public static async Task<string> WebRequest(string url, HttpMethod method, string body, string contentType, Dictionary<string, string> headers = null, X509Certificate2 cert = null) {

        HttpRequestMessage request = new HttpRequestMessage(method, url);
        if (headers != null)
            foreach (KeyValuePair<string, string> item in headers)
                request.Headers.Add(item.Key, item.Value);
        //if (cert != null) request.ClientCertificates.Add(cert);
        if (body != null) {
            request.Content = new StringContent(body);
            if (contentType != null)
                request.Content.Headers.ContentType = MediaTypeHeaderValue.Parse(contentType);
        }
        HttpResponseMessage response = await client.SendAsync(request);
        
        return await response.Content.ReadAsStringAsync();
    }
}