-- =============================================
-- Proceso: Maestros/Del_TipoFinanciacion
-- =============================================
--START_PARAM
set @id_tipo_financiacion = NULL
--END_PARAM

delete from dim_tipo_financiacion where id_tipo_financiacion = @id_tipo_financiacion;

select 'OK' as result;