-- =============================================
-- Proceso: General/Upd_TipoProyecto
-- =============================================
--START_PARAM
set
    @id_tipo_proyecto = '',
    @tipo_proyecto = '',
    @is_active = '0'
--END_PARAM

UPDATE dim_tipo_proyecto
    SET tipo_proyecto = @tipo_proyecto,
        is_active = if(@is_active = '0', 0, 1)
    WHERE id_tipo_proyecto = @id_tipo_proyecto;

select 'OK' as result;