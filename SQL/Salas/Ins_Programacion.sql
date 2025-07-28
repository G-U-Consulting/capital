-- =============================================
-- Proceso: Salas/Ins_Programacion
-- =============================================
--START_PARAM
set @id_sala_venta = NULL, 
    @id_usuario = NULL,
    @cedula = NULL, 
    @fecha = NULL, 
    @id_estado = NULL,
    @estado = NULL,
    @nombre_sala = NULL,
    @err = '';
--END_PARAM

set @userid = @id_usuario;
if @cedula is not null then
    select u.id_usuario into @userid from fact_usuarios u 
        join dim_personal_sala p on u.id_usuario = p.id_usuario
        where identificacion = @cedula and p.id_sala_venta = @id_sala_venta;
end if;

if exists (select 1 from dim_programacion_sala where id_usuario = @userid and fecha = @fecha and id_sala_venta != @id_sala_venta) then
    select sv.sala_venta into @nombre_sala
        from dim_programacion_sala ps 
        join dim_sala_venta sv on ps.id_sala_venta = sv.id_sala_venta
        where ps.id_usuario = @userid and ps.fecha = @fecha;
    select concat(
        'El asesor con cédula <b>', ifnull(@cedula, (select identificacion from fact_usuarios where id_usuario = @id_usuario)), 
        '</b> ya está asignado para el día <b>', ifnull(date_format(@fecha, '%d/%m/%Y'), ''), 
        '</b> en la sala de ventas <i>', ifnull(@nombre_sala, ''), '</i>.'
    ) into @err;
    signal sqlstate '45000'
        set message_text = @err;
elseif exists (select 1 from dim_programacion_sala where id_usuario = @userid and fecha = @fecha and id_sala_venta = @id_sala_venta) then
    update dim_programacion_sala
    set id_estado = ifnull(@id_estado, (select id_estado from dim_estado_programacion where estado = @estado))
    where id_usuario = @userid and fecha = @fecha;
    select 'OK' as result;
else
    insert into dim_programacion_sala(id_sala_venta, id_usuario, fecha, id_estado) 
    values(
        @id_sala_venta, 
        @userid, 
        @fecha, 
        ifnull(@id_estado, (select id_estado from dim_estado_programacion where estado = @estado)));
    select concat('OK-id_programacion:', last_insert_id()) as result;
end if;