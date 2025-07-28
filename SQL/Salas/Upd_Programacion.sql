-- =============================================
-- Proceso: Salas/Ins_Programacion
-- =============================================
--START_PARAM
set @id_programacion = NULL,
    @id_estado = NULL;
--END_PARAM

update dim_programacion_sala 
set id_estado = @id_estado
where id_programacion = @id_programacion;

select 'OK' as result;