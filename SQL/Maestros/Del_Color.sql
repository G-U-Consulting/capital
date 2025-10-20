-- =============================================
-- Proceso: Maestros/Del_Color
-- =============================================
--START_PARAM
set @id_estado_unidad = NULL
--END_PARAM

delete from dim_estado_unidad where id_estado_unidad = @id_estado_unidad;

select 'OK' as result;