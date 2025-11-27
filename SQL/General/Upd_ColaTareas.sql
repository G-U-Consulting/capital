-- =============================================
-- Proceso: General/Upd_ColaTareas
-- =============================================
--START_PARAM
set @id_cola_tareas_rpa = NULL,
    @is_active = NULL,
    @resultado = NULL,
    @fecha_programada = NULL;
--END_PARAM

update cola_tareas_rpa
set is_active = if(@is_active = '0' or requested_times >= 4, 0, 1),
    resultado = @resultado,
    fecha_programada = if(@fecha_programada is not null and @fecha_programada != '', @fecha_programada, fecha_programada),
    requested_on = current_timestamp,
    requested_times = requested_times + 1
where id_cola_tareas_rpa = @id_cola_tareas_rpa;

select tipo into @tipo from cola_tareas_rpa where id_cola_tareas_rpa = @id_cola_tareas_rpa;
if @tipo = 'salesforce' then
    insert into dim_log_salesforce(id_cola_tareas_rpa, sincronizada)
    values(@id_cola_tareas_rpa, if(@is_active = '1', 0, 1))
    on duplicate key update
    id_cola_tareas_rpa = values(id_cola_tareas_rpa),
    sincronizada = values(sincronizada);
end if;

select 'OK' as result;