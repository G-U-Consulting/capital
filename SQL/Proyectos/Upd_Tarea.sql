-- =============================================
-- Proceso: Proyectos/Upd_Tarea
-- =============================================
--START_PARAM
set @id_tarea = NULL,
    @alta = NULL,
    @deadline = NULL,
    @descripcion = NULL,
    @id_estado = NULL,
    @id_prioridad = NULL,
    @id_proyecto = NULL,
    @id_usuario = NULL;
--END_PARAM
update dim_tarea_usuario 
set alta = @alta,
    deadline = @deadline,
    descripcion = @descripcion,
    id_estado = @id_estado,
    id_prioridad = @id_prioridad,
    id_proyecto = @id_proyecto,
    id_usuario = @id_usuario
where id_tarea = @id_tarea;

select 'OK' as result;