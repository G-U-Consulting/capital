-- =============================================
-- Proceso: General/Upd_TipoVIS
-- =============================================
--START_PARAM
set
    @id_tipo_vis = '',
    @tipo_vis = ''
--END_PARAM

UPDATE dim_tipo_vis
    SET tipo_vis = @tipo_vis
    WHERE id_tipo_vis = @id_tipo_vis;

select 'OK' as result;