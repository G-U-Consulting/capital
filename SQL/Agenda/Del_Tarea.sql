-- =============================================
-- Proceso: Agenda/Del_Tarea
-- =============================================
--START_PARAM
set @id_tarea = NULL;
--END_PARAM

delete from dim_tarea_usuario where id_tarea = @id_tarea;

select 'OK' as result;