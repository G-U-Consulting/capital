-- =============================================
-- Proceso: General/Upd_TiposRegistro
-- =============================================
--START_PARAM
set
    @id_tipo_registro = NULL,
    @tipo_registro = NULL,
    @is_active = '0'
--END_PARAM

UPDATE dim_tipo_registro
    SET tipo_registro = @tipo_registro,
        is_active = if(@is_active = '0', 0, 1)
    WHERE id_tipo_registro = @id_tipo_registro;

select 'OK' as result;