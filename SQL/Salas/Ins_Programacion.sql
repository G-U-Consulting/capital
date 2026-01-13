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
if @userid is null and @cedula is not null then
    select u.id_usuario into @userid from fact_usuarios u 
        join dim_personal_sala p on u.id_usuario = p.id_usuario
        where identificacion = @cedula and p.id_sala_venta = @id_sala_venta;
end if;
select coalesce(@id_estado, id_estado) into @estadoid from dim_estado_programacion where estado = @estado;

if exists (select 1 from dim_programacion_sala where id_usuario = @userid and fecha = @fecha and id_sala_venta = @id_sala_venta) then
    update dim_programacion_sala
    set id_estado = ifnull(@id_estado, @estadoid)
    where id_usuario = @userid and fecha = @fecha;
    select 'OK' as result;
else
    if (@userid is not null or (@cedula is not null and trim(@cedula) <> '') or @id_estado is not null) then
        insert into dim_programacion_sala(id_sala_venta, id_usuario, fecha, id_estado) 
        values(
            @id_sala_venta, 
            @userid, 
            @fecha, 
            ifnull(@id_estado, @estadoid))
        on duplicate key update 
            id_sala_venta = @id_sala_venta,
            id_estado = ifnull(@id_estado, @estadoid);
    end if;
    select concat('OK-id_programacion:', last_insert_id()) as result;
end if;