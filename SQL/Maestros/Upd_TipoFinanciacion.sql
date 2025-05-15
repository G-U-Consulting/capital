-- =============================================
-- Proceso: General/Upd_TipoFinanciacion
-- =============================================
--START_PARAM
set
    @id_tipo_financiacion = '',
    @tipo_financiacion = ''
--END_PARAM

UPDATE dim_tipo_financiacion
    SET tipo_financiacion = @tipo_financiacion
    WHERE id_tipo_financiacion = @id_tipo_financiacion;

select 'OK' as result;