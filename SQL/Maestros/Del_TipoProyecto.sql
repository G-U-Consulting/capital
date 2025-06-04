-- =============================================
-- Proceso: Maestros/Del_TipoProyecto
-- =============================================
--START_PARAM
set @id_tipo_proyecto = NULL
--END_PARAM

delete from dim_tipo_proyecto where id_tipo_proyecto = @id_tipo_proyecto;

select 'OK' as result;