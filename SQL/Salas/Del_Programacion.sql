-- =============================================
-- Proceso: Salas/Del_Programacion
-- =============================================
--START_PARAM
set @id_programacion = NULL;
--END_PARAM

delete from dim_programacion_sala where id_programacion = @id_programacion;

select 'OK' as result;