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
            else if(format == "FormatoMaestros")
                return FormatoMaestros(file, rootPath);
            else if(format == "FormatoBancos")
                return FormatoBancos(file, rootPath);
            else if(format == "FormatoProgSalas")
                return FormatoProgSalas(file, rootPath);
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
        
        public static string FormatoMaestros(string file, string rootPath) {
            string path = Path.Combine(rootPath, "wwwroot", "docs", file);
            XLWorkbook workbook = new XLWorkbook(path);

            IXLWorksheet ws = workbook.Worksheet(1);
            ws.ShowGridLines = false;
            
            ws.Row(1).InsertRowsAbove(1);
            ws.Row(1).Height = 30;
            ws.Column(1).InsertColumnsBefore(1);

            IXLTable table = ws.Table("Table1");
            IXLTableField? tf = table.Fields.FirstOrDefault(f => f.Name == "is_active");
            if (tf != null) {
                IXLColumn? columna = table.Worksheet.Column(tf.Column.ColumnNumber());
                columna?.Delete();
            }
            tf = table.Fields.FirstOrDefault(f => f.Name == "id_sinco");
            if (tf != null) {
                IXLColumn? columna = table.Worksheet.Column(tf.Column.ColumnNumber());
                columna?.Delete();
            }
            table = ws.Table("Table1");

            foreach(var field in table.Fields) {
                int col = field.Column.ColumnNumber();
                if(field.Name.StartsWith("id_")){
                    ws.Column(col).Width = 15;
                    ws.Column(col).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    string name = field.Name.Replace("id_", "");
                    name = "# " + name[..1].ToUpper() + name[1..].ToLower();
                    field.HeaderCell.Value = name.Replace("_", " ");
                } else if(field.Name == "orden" || field.Name == "ID Sinco" || field.Name == "Activo") {
                    ws.Column(col).Width = 15;
                    ws.Column(col).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    string name = field.Name;
                    name = name[..1].ToUpper() + name[1..];
                    field.HeaderCell.Value = name;
                } else {
                    ws.Column(col).Width = field.Name == "zona_proyecto" ? 65 : 30;
                    string name = field.Name;
                    name = name[..1].ToUpper() + name[1..].ToLower();
                    field.HeaderCell.Value = name.Replace("_", " ");
                }
            }

            Common_Formats(ws, table);

            workbook.Save();
            return file;
        }
        
        public static string FormatoBancos(string file, string rootPath) {
            string path = Path.Combine(rootPath, "wwwroot", "docs", file);
            XLWorkbook workbook = new(path);

            foreach (IXLWorksheet ws in workbook.Worksheets)
            {
                ws.ShowGridLines = false;

                ws.Row(1).InsertRowsAbove(1);
                ws.Row(1).Height = 30;
                ws.Column(1).InsertColumnsBefore(1);

                foreach (IXLTable table in ws.Tables)
                {
                    IXLTableField? tf = table.Fields.FirstOrDefault(f => f.Name == "is_active");
                    if (tf != null)
                    {
                        IXLColumn? columna = table.Worksheet.Column(tf.Column.ColumnNumber());
                        columna?.Delete();
                    }

                    foreach (var field in table.Fields)
                    {
                        int col = field.Column.ColumnNumber();
                        if (field.Name.StartsWith("id_"))
                        {
                            ws.Column(col).Width = 15;
                            ws.Column(col).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                            string name = field.Name.Replace("id_", "");
                            name = "# " + name[..1].ToUpper() + name[1..].ToLower();
                            field.HeaderCell.Value = name.Replace("_", " ");
                        }
                        else if (field.Name.Contains("año"))
                        {
                            ws.Column(col).Width = 17;
                            ws.Column(col).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                            string name = field.Name;
                            name = name[..1].ToUpper() + name[1..];
                            field.HeaderCell.Value = name.Replace("_", " ");
                            if (ws.Name != "Resumen")
                            {
                                ws.Column(col).Style.NumberFormat.Format = "\"$\"#,##0";
                                // Opcional: forzar conversión a número si las celdas vienen como texto
                                foreach (var cell in ws.Column(col).CellsUsed().Where(c => c.Address.RowNumber > table.RangeAddress.FirstAddress.RowNumber))
                                {
                                    if (double.TryParse(cell.GetString(), out double v))
                                        cell.Value = v;
                                }
                            }
                        }
                        else
                        {
                            ws.Column(col).Width = field.Name == "banco" ? 30 : 25;
                            string name = field.Name;
                            name = name[..1].ToUpper() + name[1..].ToLower();
                            field.HeaderCell.Value = name.Replace("_", " ");
                        }
                    }
                Common_Formats(ws, table);
                }
            }

            workbook.Save();
            return file;
        }
        
        public static string FormatoProgSalas(string file, string rootPath)
        {
            string path = Path.Combine(rootPath, "wwwroot", "docs", file);
            XLWorkbook workbook = new(path);

            IXLWorksheet ws = workbook.Worksheet(1);
            ws.ShowGridLines = false;

            IXLTable table = ws.Table("Table1");
            IXLRangeColumn rangeDate = table.Column(1),
                rangeCC = table.Column(2),
                rangeState = table.Column(3),
                rangeDay = table.Column(4);

            foreach (var row in table.DataRange.Rows())
            {
                var fecha = row.Cell(1);
                var dia = row.Cell(4);
                dia.FormulaA1 = $"=TEXT({fecha.Address.ToStringRelative(true)},\"dddd\")";
            }
                
            rangeDate.Style.NumberFormat.Format = "dd/mm/yyyy";
            rangeDate.Style.Fill.BackgroundColor = XLColor.FromHtml("#DAEEF3");
            IXLDataValidation valDate = rangeDate.CreateDataValidation();
            valDate.Date.Between(new DateTime(2000, 1, 1), new DateTime(2999, 12, 31));
            valDate.ErrorTitle = "Fecha incorrecta";
            valDate.ErrorMessage = "Ingrese una fecha entre 01/01/2000 - 31/12/2999";

            rangeCC.Style.NumberFormat.Format = "0";
            rangeCC.Style.Fill.BackgroundColor = XLColor.FromHtml("#DAEEF3");
            IXLDataValidation valCC = rangeCC.CreateDataValidation();
            valCC.WholeNumber.Between("1000", "999999999999999");
            valCC.ErrorTitle = "Número de identificación incorrecto";
            valCC.ErrorMessage = "Ingrese una cédula válida";
            
            IXLDataValidation valState = rangeState.CreateDataValidation();
            rangeState.Style.Fill.BackgroundColor = XLColor.FromHtml("#DAEEF3");
            valState.List("\"En sala,En casa,Descansa,Licencia,Vacaciones,Incapacidad\"");
            valState.ErrorTitle = "Valor inválido";
            valState.ErrorMessage = "Ingrese una de las opciones de la lista";

            foreach (IXLDataValidation val in (IXLDataValidation[])[valDate, valCC, valState])
            {
                val.IgnoreBlanks = true;
                val.ShowErrorMessage = true;
            }
            foreach (var field in table.Fields)
            {
                int col = field.Column.ColumnNumber();
                switch (field.Name)
                {
                    case "fecha":
                        ws.Column(col).Width = 15;
                        field.HeaderCell.Value = "fecha";
                        break;
                    case "cedula":
                        ws.Column(col).Width = 15;
                        ws.Column(col).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                        field.HeaderCell.Value = "cedula";
                        break;
                    case "estado":
                        ws.Column(col).Width = 15;
                        field.HeaderCell.Value = "estado";
                        break;
                    case "asesor":
                        ws.Column(col).Width = 30;
                        field.HeaderCell.Value = "asesor";
                        break;
                    case "sala":
                        ws.Column(col).Width = 25;
                        field.HeaderCell.Value = "sala de ventas";
                        break;
                    case "dia":
                        ws.Column(col).Width = 13;
                        field.HeaderCell.Value = "dia";
                        break;
                    case "categoria":
                        ws.Column(col).Width = 15;
                        field.HeaderCell.Value = "categoria";
                        break;
                    default:
                        ws.Column(col).Width = 10;
                        break;
                }
            }

            Common_Formats(ws, table);
            var reqFields = ws.Range("A1:C1");
            reqFields.Style.Fill.BackgroundColor = XLColor.FromHtml("#00839C");
            IXLDataValidation valReqs = reqFields.CreateDataValidation();
            valReqs.InputTitle = "Campo obligatorio";
            valReqs.InputMessage = "Debe ingresar un valor para importar los datos";
            
            var infoFields = ws.Range("D1:H1");
            IXLDataValidation valInfo = infoFields.CreateDataValidation();
            valInfo.InputTitle = "Campo informativo";
            valInfo.InputMessage = "Este valor no se tiene en cuenta al importar datos";
            workbook.CalculateMode = XLCalculateMode.Auto;
            workbook.Save();

            return file;
        }

        private static void Common_Formats(IXLWorksheet ws, IXLTable table)
        {
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
