using ClosedXML.Excel;
using Newtonsoft.Json.Linq;

namespace capital.Code.Util {
    public static class ExcelFormater {
        public static string Format(JObject data, string rootPath) {
            string file = data["file"].Value<string>(), format = data["format"].Value<string>();
            if (format == "FormatoUsuarios")
                return FormatoUsuarios(file, rootPath);
            return null;
        }
        public static string FormatoUsuarios(string file, string rootPath) {
            string path = Path.Combine(rootPath, "wwwroot", "docs", file);
            XLWorkbook workbook = new XLWorkbook(path);

            var ws = workbook.Worksheet(1);
            // Change the background color of the headers
            var rngHeaders = ws.Range("B3:F3");
            rngHeaders.Style.Fill.BackgroundColor = XLColor.LightSalmon;

            workbook.Save();
            return file;
        }

    }
}
