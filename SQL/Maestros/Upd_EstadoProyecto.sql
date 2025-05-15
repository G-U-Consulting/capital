-- =============================================
-- Proceso: General/Upd_EstadoProyecto
-- =============================================
--START_PARAM
set
    @id_estado_publicacion = '',
    @estado_publicacion = ''
--END_PARAM

UPDATE dim_estado_pubicacion
    SET estado_publicacion = @estado_publicacion
    WHERE id_estado_publicacion = @id_estado_publicacion;

select 'OK' as result;