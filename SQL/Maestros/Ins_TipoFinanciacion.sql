-- =============================================
-- Proceso: General/Ins_TipoFinanciacion
-- =============================================
--START_PARAM
set @tipo_financiacion = NULL,
    @porcentaje = 0;

--END_PARAM

INSERT INTO dim_tipo_financiacion (tipo_financiacion, porcentaje) VALUES (@tipo_financiacion, @porcentaje);
SELECT concat('OK-id_tipo_financiacion:', (SELECT id_tipo_financiacion from dim_tipo_financiacion where tipo_financiacion = @tipo_financiacion)) AS result;
