using System.Net.Mail;
using System.Net;
using dotenv.net;
using Newtonsoft.Json.Linq;

public static class SendMail
{
    static SendMail()
    {
        DotEnv.Load();
    }

    private static string LoadBodyTemplate(string template, string rootPath)
    {
        string path = Path.Combine(rootPath, "wwwroot", "templates", $"{template}.html");
        string body;
        if (File.Exists(path))
            body = File.ReadAllText(path);
        else
            throw new Exception($"Plantilla {template}.html no encontrada");
        return body;
    }

    private static string ReplaceData(string body, JObject data)
    {
        foreach(JProperty prop in data.Properties())
        {
            string key = "#" + prop.Name + "#";
            body = body.Replace(key, data[prop.Name]?.ToString() ?? "");
        }
        return body;
    }

    public static void Send(string to, string subject, string template, JObject data, string rootPath, bool enableSsl = true)
    {
        string body = LoadBodyTemplate(template, rootPath);
        body = ReplaceData(body, data);
        using var smtp = new SmtpClient();
        var credential = new NetworkCredential
        {
            UserName = Environment.GetEnvironmentVariable("SMTP_USERNAME"),
            Password = Environment.GetEnvironmentVariable("SMTP_PASSWORD")
        };

        smtp.Credentials = credential;
        smtp.Host = Environment.GetEnvironmentVariable("SMTP_HOST");
        smtp.Port = int.Parse(Environment.GetEnvironmentVariable("SMTP_PORT"));
        smtp.EnableSsl = enableSsl;

        using var message = new MailMessage();
        message.To.Add(new MailAddress(to));
        message.From = new MailAddress(Environment.GetEnvironmentVariable("SMTP_FROM"));
        message.Subject = subject;
        message.Body = body;
        message.IsBodyHtml = true;

        smtp.Send(message);
    }
}