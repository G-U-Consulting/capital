-- =============================================
-- Proceso: Proyectos/Ins_Tarea
-- =============================================
--START_PARAM
set @alta = NULL,
    @deadline = NULL,
    @descripcion = NULL,
    @id_estado = NULL,
    @id_prioridad = NULL,
    @id_proyecto = NULL,
    @id_usuario = NULL;
--END_PARAM

insert into dim_tarea_usuario(alta, deadline, descripcion, id_estado, id_prioridad, id_proyecto, id_usuario) 
values(@alta, @deadline, @descripcion, @id_estado, @id_prioridad, @id_proyecto, @id_usuario);

select 'OK' as result;