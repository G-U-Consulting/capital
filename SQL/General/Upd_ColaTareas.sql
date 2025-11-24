-- =============================================
-- Proceso: General/Upd_ColaTareas
-- =============================================
--START_PARAM
set @id_cola_tareas_rpa = NULL,
    @is_active = NULL,
    @resultado = NULL;
--END_PARAM

update cola_tareas_rpa
set is_active = if(@is_active = '0', 0, 1),
    resultado = @resultado,
    requested_on = current_timestamp,
    requested_times = requested_times + 1
where id_cola_tareas_rpa = @id_cola_tareas_rpa;

select 'OK' as result;