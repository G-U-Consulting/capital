using System.Net.Http.Headers;
using dotenv.net;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using orca.Code.Api;
using orca.Code.Logger;

namespace capital.Code.Inte.Autodesk;

public class AutodeskService
{
    private const string AuthorizeUrl = "https://developer.api.autodesk.com/authentication/v2/authorize";
    private const string TokenUrl = "https://developer.api.autodesk.com/authentication/v2/token";
    private const string HubsUrl = "https://developer.api.autodesk.com/project/v1/hubs";
    private const string LocationsBaseUrl = "https://developer.api.autodesk.com/bim360/locations/v2";
    private const string BIM360AccountId = "603cb6ab-e413-46cd-9c7e-3341b8dec61d";

    static AutodeskService()
    {
        DotEnv.Load();
    }

    private static string GetClientId() =>
        Environment.GetEnvironmentVariable("APS_CLIENT_ID")
        ?? throw new Exception("APS_CLIENT_ID not configured");

    private static string GetClientSecret() =>
        Environment.GetEnvironmentVariable("APS_CLIENT_SECRET")
        ?? throw new Exception("APS_CLIENT_SECRET not configured");

    private static string GetCallbackUrl() =>
        Environment.GetEnvironmentVariable("APS_CALLBACK_URL")
        ?? throw new Exception("APS_CALLBACK_URL not configured");

    /// <summary>
    /// Builds the OAuth authorize URL for browser redirect.
    /// </summary>
    public static string GetAuthorizationUrl()
    {
        string clientId = GetClientId();
        string callbackUrl = Uri.EscapeDataString(GetCallbackUrl());
        return $"{AuthorizeUrl}?response_type=code&client_id={clientId}&redirect_uri={callbackUrl}&scope=data:read%20account:read";
    }

    /// <summary>
    /// Exchanges an authorization code for access + refresh tokens. Saves to DB.
    /// </summary>
    public static async Task<JObject> ExchangeCodeForToken(string code, string rootPath)
    {
        using var client = new HttpClient();
        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));

        var content = new FormUrlEncodedContent(
        [
            new KeyValuePair<string, string>("grant_type", "authorization_code"),
            new KeyValuePair<string, string>("code", code),
            new KeyValuePair<string, string>("client_id", GetClientId()),
            new KeyValuePair<string, string>("client_secret", GetClientSecret()),
            new KeyValuePair<string, string>("redirect_uri", GetCallbackUrl())
        ]);

        HttpResponseMessage response = await client.PostAsync(TokenUrl, content, cts.Token);
        string body = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            throw new Exception($"Token exchange failed ({response.StatusCode}): {body}");

        JObject tokenData = JObject.Parse(body);
        int expiresIn = tokenData["expires_in"]?.Value<int>() ?? 3600;
        string expiresAt = DateTime.UtcNow.AddSeconds(expiresIn).ToString("yyyy-MM-dd HH:mm:ss");

        await SaveToken(
            tokenData["access_token"]?.ToString() ?? "",
            tokenData["refresh_token"]?.ToString() ?? "",
            expiresAt,
            rootPath
        );

        return tokenData;
    }

    /// <summary>
    /// Gets a valid access token, refreshing if expired.
    /// </summary>
    public static async Task<string> GetValidAccessToken(string rootPath)
    {
        JToken res = await Generic.ProcessRequest(null, null, "genericDT", "CuadrosCalidad/Get_Autodesk_Token", "{\"dummy\":null}", rootPath);
        JArray? data = res["data"] as JArray;

        if (data == null || data.Count == 0)
            throw new Exception("No Autodesk token found. Please connect to Autodesk first.");

        JObject tokenRow = (JObject)data[0];
        string accessToken = tokenRow["access_token"]?.ToString() ?? "";
        string refreshToken = tokenRow["refresh_token"]?.ToString() ?? "";
        DateTime expiresAt = tokenRow["expires_at"]?.Value<DateTime>() ?? DateTime.MinValue;

        if (DateTime.UtcNow < expiresAt.AddMinutes(-5))
            return accessToken;

        // Token expired or about to expire - refresh it
        return await RefreshToken(refreshToken, rootPath);
    }

    /// <summary>
    /// Refreshes the access token using the refresh token.
    /// </summary>
    private static async Task<string> RefreshToken(string refreshToken, string rootPath)
    {
        using var client = new HttpClient();
        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));

        var content = new FormUrlEncodedContent(
        [
            new KeyValuePair<string, string>("grant_type", "refresh_token"),
            new KeyValuePair<string, string>("refresh_token", refreshToken),
            new KeyValuePair<string, string>("client_id", GetClientId()),
            new KeyValuePair<string, string>("client_secret", GetClientSecret())
        ]);

        HttpResponseMessage response = await client.PostAsync(TokenUrl, content, cts.Token);
        string body = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            throw new Exception($"Token refresh failed ({response.StatusCode}): {body}");

        JObject tokenData = JObject.Parse(body);
        int expiresIn = tokenData["expires_in"]?.Value<int>() ?? 3600;
        string expiresAt = DateTime.UtcNow.AddSeconds(expiresIn).ToString("yyyy-MM-dd HH:mm:ss");

        string newAccessToken = tokenData["access_token"]?.ToString() ?? "";
        string newRefreshToken = tokenData["refresh_token"]?.ToString() ?? refreshToken;

        await SaveToken(newAccessToken, newRefreshToken, expiresAt, rootPath);

        return newAccessToken;
    }

    private static async Task SaveToken(string accessToken, string refreshToken, string expiresAt, string rootPath)
    {
        JObject pars = new()
        {
            ["access_token"] = accessToken,
            ["refresh_token"] = refreshToken,
            ["expires_at"] = expiresAt
        };
        await Generic.ProcessRequest(null, null, "genericST", "CuadrosCalidad/Save_Autodesk_Token", pars.ToString(), rootPath);
    }

    /// <summary>
    /// Returns the list of ACC projects for the configured BIM 360 account.
    /// </summary>
    public static async Task<JArray> GetProjects(string accessToken)
    {
        string hubId = $"b.{BIM360AccountId}";
        string url = $"{HubsUrl}/{hubId}/projects";
        JArray allProjects = [];

        while (!string.IsNullOrEmpty(url))
        {
            using var client = new HttpClient();
            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            HttpResponseMessage response = await client.GetAsync(url, cts.Token);
            string body = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw new Exception($"Failed to get projects ({response.StatusCode}): {body}");

            JObject result = JObject.Parse(body);
            JArray? data = result["data"] as JArray;

            if (data != null)
            {
                foreach (JObject project in data)
                {
                    allProjects.Add(new JObject
                    {
                        ["id"] = project["id"]?.ToString(),
                        ["name"] = project["attributes"]?["name"]?.ToString()
                    });
                }
            }

            // Pagination
            url = result["links"]?["next"]?["href"]?.ToString() ?? "";
        }

        return allProjects;
    }

    /// <summary>
    /// Gets the locations container ID for a given ACC project.
    /// </summary>
    public static async Task<string> GetLocationsContainerId(string accessToken, string projectId)
    {
        string hubId = $"b.{BIM360AccountId}";
        string url = $"{HubsUrl}/{hubId}/projects/{projectId}";

        using var client = new HttpClient();
        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        HttpResponseMessage response = await client.GetAsync(url, cts.Token);
        string body = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            throw new Exception($"Failed to get project details ({response.StatusCode}): {body}");

        JObject result = JObject.Parse(body);

        // The locations container ID is in project relationships
        string? containerId = result["data"]?["relationships"]?["locations"]?["data"]?["id"]?.ToString();

        if (string.IsNullOrEmpty(containerId))
            throw new Exception("No locations container found for this project. Ensure locations are enabled in BIM 360.");

        return containerId;
    }

    /// <summary>
    /// Fetches all location nodes from the ACC Locations API (paginated).
    /// </summary>
    public static async Task<JArray> GetLocationNodes(string accessToken, string containerId)
    {
        string url = $"{LocationsBaseUrl}/containers/{containerId}/trees/default/nodes";
        JArray allNodes = [];

        while (!string.IsNullOrEmpty(url))
        {
            using var client = new HttpClient();
            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            HttpResponseMessage response = await client.GetAsync(url, cts.Token);
            string body = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw new Exception($"Failed to get location nodes ({response.StatusCode}): {body}");

            JObject result = JObject.Parse(body);
            JArray? results = result["results"] as JArray;

            if (results != null)
            {
                foreach (JToken node in results)
                    allNodes.Add(node);
            }

            // Pagination
            url = result["pagination"]?["nextUrl"]?.ToString() ?? "";
        }

        return allNodes;
    }

    /// <summary>
    /// Checks if a valid Autodesk token exists in the database.
    /// </summary>
    public static async Task<bool> IsConnected(string rootPath)
    {
        try
        {
            JToken res = await Generic.ProcessRequest(null, null, "genericDT", "CuadrosCalidad/Get_Autodesk_Token", "{\"dummy\":null}", rootPath);
            JArray? data = res["data"] as JArray;
            return data != null && data.Count > 0;
        }
        catch
        {
            return false;
        }
    }
}
