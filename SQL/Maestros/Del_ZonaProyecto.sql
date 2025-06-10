-- =============================================
-- Proceso: Maestros/Del_ZonaProyecto
-- =============================================
--START_PARAM
set @id_zona_proyecto = NULL
--END_PARAM

delete from dim_zona_proyecto where id_zona_proyecto = @id_zona_proyecto;

select 'OK' as result;