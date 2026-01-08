-- =============================================
-- Proceso: Salas/Upd_Programacion
-- =============================================
--START_PARAM
set @id_programacion = NULL,
    @id_usuario = NULL,
    @id_estado = NULL;
--END_PARAM

update dim_programacion_sala 
set id_estado = @id_estado,
    id_usuario = @id_usuario
where id_programacion = @id_programacion;

select 'OK' as result;