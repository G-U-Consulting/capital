-- =============================================
-- Proceso: Maestros/Del_EstadoProyecto
-- =============================================
--START_PARAM
set @estado_publicacion = NULL
--END_PARAM

delete from dim_estado_publicacion where estado_publicacion = @estado_publicacion;

select 'OK' as result;