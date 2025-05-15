-- =============================================
-- Proceso: General/Ins_TipoFinanciacion
-- =============================================
--START_PARAM
set @tipo_financiacion = ''

--END_PARAM

INSERT INTO dim_tipo_financiacion (tipo_financiacion) VALUES (@tipo_financiacion);
SELECT concat('OK-id_tipo_financiacion:', (SELECT id_tipo_financiacion from dim_tipo_financiacion where tipo_financiacion = @tipo_financiacion)) AS result;
