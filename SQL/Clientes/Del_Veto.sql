-- =============================================
-- Proceso: Clientes/Del_Veto
-- =============================================
--START_PARAM
set @id_veto = NULL;
--END_PARAM

select id_tarea into @id_task from dim_veto_cliente where id_veto = @id_veto;
delete from dim_veto_cliente 
where id_veto = @id_veto;
delete from dim_tarea_usuario 
where id_tarea = @id_task;

select 'OK' as result;