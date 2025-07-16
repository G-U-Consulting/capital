-- =============================================
-- Proceso: Salas/Ins_Programacion
-- =============================================
--START_PARAM
set @id_sala_venta = NULL, 
    @id_usuario = NULL,
    @cedula = NULL, 
    @fecha = NULL, 
    @id_estado = NULL,
    @estado = NULL;
--END_PARAM

insert into dim_programacion_sala(id_sala_venta, id_usuario, fecha, id_estado) 
values(
    @id_sala_venta, 
    ifnull(@id_usuario, (select u.id_usuario from fact_usuarios u join dim_personal_sala p on u.id_usuario = p.id_usuario
        where identificacion = @cedula and p.id_sala_venta = @id_sala_venta)), 
    @fecha, 
    ifnull(@id_estado, (select id_estado from dim_estado_programacion where estado = @estado)));

select concat('OK-id_programacion:', last_insert_id()) as result;