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
        Send(to, subject, template, data, rootPath, null, null, enableSsl);
    }

    public static void Send(string to, string subject, string template, JObject data, string rootPath, byte[]? pdfAttachment, string? pdfFileName, bool enableSsl = true)
    {
        string? smtpHost = Environment.GetEnvironmentVariable("SMTP_HOST");
        string? smtpPort = Environment.GetEnvironmentVariable("SMTP_PORT");
        string? smtpUsername = Environment.GetEnvironmentVariable("SMTP_USERNAME");
        string? smtpPassword = Environment.GetEnvironmentVariable("SMTP_PASSWORD");
        string? smtpFrom = Environment.GetEnvironmentVariable("SMTP_FROM");

        if (string.IsNullOrEmpty(smtpHost))
            throw new Exception("SMTP_HOST no está configurado");
        if (string.IsNullOrEmpty(smtpPort))
            throw new Exception("SMTP_PORT no está configurado");
        if (string.IsNullOrEmpty(smtpUsername))
            throw new Exception("SMTP_USERNAME no está configurado");
        if (string.IsNullOrEmpty(smtpPassword))
            throw new Exception("SMTP_PASSWORD no está configurado");
        if (string.IsNullOrEmpty(smtpFrom))
            throw new Exception("SMTP_FROM no está configurado");

        string body = LoadBodyTemplate(template, rootPath);
        body = ReplaceData(body, data);
        using var smtp = new SmtpClient();
        var credential = new NetworkCredential
        {
            UserName = smtpUsername,
            Password = smtpPassword
        };

        smtp.Credentials = credential;
        smtp.Host = smtpHost;
        smtp.Port = int.Parse(smtpPort);
        smtp.EnableSsl = enableSsl;

        using var message = new MailMessage();
        message.To.Add(new MailAddress(to));
        message.From = new MailAddress(smtpFrom);
        message.Subject = subject;
        message.Body = body;
        message.IsBodyHtml = true;

        if (pdfAttachment != null && pdfAttachment.Length > 0 && !string.IsNullOrEmpty(pdfFileName))
        {
            var stream = new MemoryStream(pdfAttachment);
            var attachment = new Attachment(stream, pdfFileName, "application/pdf");
            message.Attachments.Add(attachment);
        }

        smtp.Send(message);
    }

    public static void SendWithAttachments(string to, string subject, string template, JObject data, string rootPath, List<AttachmentInfo>? attachments, bool enableSsl = true)
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

        if (attachments != null)
        {
            foreach (var att in attachments)
            {
                if (att.Content != null && att.Content.Length > 0)
                {
                    var stream = new MemoryStream(att.Content);
                    var attachment = new Attachment(stream, att.FileName, att.ContentType);
                    message.Attachments.Add(attachment);
                }
            }
        }

        smtp.Send(message);
    }
}

public class AttachmentInfo
{
    public byte[]? Content { get; set; }
    public string FileName { get; set; } = "";
    public string ContentType { get; set; } = "application/octet-stream";
}