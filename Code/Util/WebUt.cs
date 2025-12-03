using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http.Headers;
using System.Security.Cryptography.X509Certificates;
using System.Text.RegularExpressions;
using System.Web;

/// <summary>
/// Summary description for WebUt
/// </summary>
public static partial class WebUt {
    private static string[] proxySites = {  };
    private static HttpClient client = new HttpClient();
    public static async Task<string> WebRequest(string url, HttpMethod method, string body, string contentType, Dictionary<string, string> headers = null, X509Certificate2 cert = null)
    {
        return await WebRequest(url, method, body, contentType, null, headers, cert);
    }
    public static async Task<string> WebRequest(string url, HttpMethod method, string body, string contentType, CancellationToken? ct, Dictionary<string, string> headers = null, X509Certificate2 cert = null) {
        HttpRequestMessage request = new HttpRequestMessage(method, url);
        //if (cert != null) request.ClientCertificates.Add(cert);   
        if (headers != null)
            foreach (KeyValuePair<string, string> item in headers) { 
                request.Headers.Add(item.Key, item.Value);
            }
        if (body != null) {
            request.Content = new StringContent(body);
            if (contentType != null)
                request.Content.Headers.ContentType = MediaTypeHeaderValue.Parse(contentType);
        }
        HttpResponseMessage response;
        if (ct != null)
            response = await client.SendAsync(request, (CancellationToken)ct);
        else
            response = await client.SendAsync(request);
        
        return await response.Content.ReadAsStringAsync();
    }
    public static string GetContentType(string fileExt) {
        string ret = "";
        switch (fileExt.ToLower()) {
            case ".txt":
                ret = "text/plain"; break;
            case ".xml":
                ret = "text/xml"; break;
            case ".html":
                ret = "text/html"; break;
            case ".jpeg":
                ret = "image/jpeg"; break;
            case ".jpg":
                ret = "image/jpeg"; break;
            case ".png":
                ret = "image/png"; break;
            case ".mpeg":
                ret = "audio/mpeg"; break;
            case ".ogg":
                ret = "audio/ogg"; break;
            case ".mp4":
                ret = "video/mp4"; break;
            case ".pdf":
                ret = "application/pdf"; break;
            case ".tiff":
                ret = "image/tiff"; break;
            case ".tif":
                ret = "image/tif"; break;
            default:
                ret = "application/octet-stream"; break;
        }
        return ret;
    }
    public static string SanitizeXss(string text)
    {
        string noTags = XssRegex().Replace(text, string.Empty);
        return HttpUtility.HtmlEncode(noTags);
    }

    [GeneratedRegex("<.*?>")]
    private static partial Regex XssRegex();
}