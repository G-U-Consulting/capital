-- =============================================
-- Proceso: General/Upd_TipoFinanciacion
-- =============================================
--START_PARAM
set
    @id_tipo_financiacion = '',
    @tipo_financiacion = '',
    @is_active = '0'
--END_PARAM

UPDATE dim_tipo_financiacion
    SET tipo_financiacion = @tipo_financiacion,
        is_active = if(@is_active = '0', 0, 1)
    WHERE id_tipo_financiacion = @id_tipo_financiacion;

select 'OK' as result;