using ClosedXML.Excel;
using DocumentFormat.OpenXml.Bibliography;
using DocumentFormat.OpenXml.EMMA;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Wordprocessing;
using Newtonsoft.Json.Linq;
using System.Security.AccessControl;

namespace capital.Code.Util {
    public static class ExcelFormater {

        public static string Format(JObject data, string rootPath) {
            string file = data["file"].Value<string>(), format = data["format"].Value<string>();
            if (format == "FormatoUsuarios")
                return FormatoUsuarios(file, rootPath);
            else if(format == "FormatoRoles")
                return FormatoRoles(file, rootPath);
            else
                return null;
        }
        public static string FormatoUsuarios(string file, string rootPath) {
            string path = Path.Combine(rootPath, "wwwroot", "docs", file);
            XLWorkbook workbook = new XLWorkbook(path);

            IXLWorksheet ws = workbook.Worksheet(1);
            ws.ShowGridLines = false;
            
            ws.Row(1).InsertRowsAbove(1);
            ws.Row(1).Height = 30;
            ws.Column(1).InsertColumnsBefore(1);

            IXLTable table = ws.Table("Table1");

            foreach(var field in table.Fields) {
                int col = field.Column.ColumnNumber();
                switch(field.Name) {
                    case "id_usuario":
                        ws.Column(col).Width = 15;
                        ws.Column(col).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                        field.HeaderCell.Value = "# Usuario";
                        break;
                    case "usuario":
                        ws.Column(col).Width = 25;
                        field.HeaderCell.Value = "Usuario";
                        break;
                    case "nombres":
                        ws.Column(col).Width = 40;
                        field.HeaderCell.Value = "Nombre y Apellidos";
                        break;
                    case "created_on":
                        ws.Column(col).Width = 21;
                        ws.Column(col).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                        field.HeaderCell.Value = "Fecha Creación";
                        break;
                    case "cuenta":
                        ws.Column(col).Width = 13;
                        ws.Column(col).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                        field.HeaderCell.Value = "# Roles";
                        break;
                    case "cargo":
                        ws.Column(col).Width = 15;
                        ws.Column(col).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                        field.HeaderCell.Value = "Cargo";
                        break;
                    case "identificacion":
                        ws.Column(col).Width = 18;
                        ws.Column(col).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                        field.HeaderCell.Value = "Identificación";
                        break;
                    case "is_active":
                        ws.Column(col).Width = 15;
                        ws.Column(col).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                        field.HeaderCell.Value = "Estado";
                        break;
                    default:
                        break;
                }
            }

            Common_Formats(ws, table);

            workbook.Save();
            return file;
        }

        public static string FormatoRoles(string file, string rootPath) {
            string path = Path.Combine(rootPath, "wwwroot", "docs", file);
            XLWorkbook workbook = new XLWorkbook(path);

            IXLWorksheet ws = workbook.Worksheet(1);
            ws.ShowGridLines = false;

            ws.Row(1).InsertRowsAbove(1);
            ws.Row(1).Height = 30;
            ws.Column(1).InsertColumnsBefore(1);

            IXLTable table = ws.Table("Table1");

            foreach(var field in table.Fields) {
                int col = field.Column.ColumnNumber();
                switch(field.Name) {
                    case "id_usuario":
                        ws.Column(col).Width = 15;
                        ws.Column(col).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                        field.HeaderCell.Value = "# Usuario";
                        break;
                    case "usuario":
                        ws.Column(col).Width = 25;
                        field.HeaderCell.Value = "Usuario";
                        break;
                    case "nombres":
                        ws.Column(col).Width = 40;
                        field.HeaderCell.Value = "Nombre y Apellidos";
                        break;
                    case "created_on":
                        ws.Column(col).Width = 21;
                        ws.Column(col).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                        field.HeaderCell.Value = "Fecha Creación";
                        break;
                    case "cuenta":
                        ws.Column(col).Width = 13;
                        ws.Column(col).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                        field.HeaderCell.Value = "# Roles";
                        break;
                    case "cargo":
                        ws.Column(col).Width = 15;
                        ws.Column(col).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                        field.HeaderCell.Value = "Cargo";
                        break;
                    case "identificacion":
                        ws.Column(col).Width = 18;
                        ws.Column(col).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                        field.HeaderCell.Value = "Identificación";
                        break;
                    case "is_active":
                        ws.Column(col).Width = 15;
                        ws.Column(col).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                        field.HeaderCell.Value = "Estado";
                        break;
                    default:
                        break;
                }
            }

            Common_Formats(ws, table);
            workbook.Save();

            return file;
        }


        private static void Common_Formats(IXLWorksheet ws, IXLTable table) {
            // Header
            table.Theme = XLTableTheme.None;
            table.HeadersRow().Style.Fill.BackgroundColor = XLColor.FromHtml("#0468AF");
            table.HeadersRow().Style.Font.FontColor = XLColor.White;
            table.HeadersRow().Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

            table.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            table.Style.Border.InsideBorder = XLBorderStyleValues.Thin;

            //table.Theme = XLTableTheme.TableStyleMedium6;
            //table.ShowRowStripes = true;

            // Page            
            ws.PageSetup.PageOrientation = XLPageOrientation.Landscape;

            ws.PageSetup.PrintAreas.Clear();
            ws.PageSetup.PrintAreas.Add(table.RangeAddress.ToString());
            ws.PageSetup.SetRowsToRepeatAtTop(2, 2);
            ws.PageSetup.FitToPages(1, 1000);

            ws.PageSetup.Margins.Left = 0.6;
            ws.PageSetup.Margins.Top = 1.0;
            ws.PageSetup.Margins.Right = 0.6;
            ws.PageSetup.Margins.Bottom = 0.5;
            ws.PageSetup.Margins.Footer = 0.3;
            ws.PageSetup.Margins.Header = 0.2;

            ws.PageSetup.Footer.Center.AddText("Relación de Usuarios a " + DateTime.Now.ToString());
            ws.PageSetup.Footer.Right.AddText(XLHFPredefinedText.PageNumber, XLHFOccurrence.AllPages);
            ws.PageSetup.Footer.Right.AddText(" / ", XLHFOccurrence.AllPages);
            ws.PageSetup.Footer.Right.AddText(XLHFPredefinedText.NumberOfPages, XLHFOccurrence.AllPages);

        }

    }
}
