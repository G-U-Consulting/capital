-- =============================================
-- Proceso: General/Upd_EstadoProyecto
-- =============================================
--START_PARAM
set
    @id_estado_publicacion = '',
    @estado_publicacion = '',
    @is_active = '0'
--END_PARAM

UPDATE dim_estado_publicacion
    SET estado_publicacion = @estado_publicacion,
        is_active = if(@is_active = '0', 0, 1)
    WHERE id_estado_publicacion = @id_estado_publicacion;

select 'OK' as result;