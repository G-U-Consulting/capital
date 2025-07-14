-- =============================================
-- Proceso: Salas/Ins_Programacion
-- =============================================
--START_PARAM
set @id_sala_venta = NULL, 
    @id_usuario = NULL, 
    @fecha = NULL, 
    @id_estado = NULL;
--END_PARAM

insert into dim_programacion_sala(id_sala_venta, id_usuario, fecha, id_estado) 
values(@id_sala_venta, @id_usuario, @fecha, @id_estado);

select concat('OK-id_programacion:', last_insert_id()) as result;