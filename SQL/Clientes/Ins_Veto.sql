-- =============================================
-- Proceso: Clientes/Ins_Veto
-- =============================================
--START_PARAM
set @id_cliente = NULL,
    @motivo = NULL,
    @usuario = NULL,
    @numero_documento = NULL,
    @nombres = NULL,
    @apellido1 = NULL,
    @apellido2 = NULL,
    @email1 = NULL,
    @telefono1 = NULL,
    @asignado = NULL;
--END_PARAM

set @cliente_id = @id_cliente;
if @id_cliente is null then
    insert into fact_clientes(numero_documento, nombres, apellido1, apellido2, email1, telefono1)
    values(@numero_documento, @nombres, @apellido1, @apellido2, @email1, @telefono1);
    set @cliente_id = last_insert_id();
end if;

insert into dim_tarea_usuario(alta, deadline, descripcion, id_estado, id_prioridad, id_usuario)
values(current_date, date_add(current_date, interval 1 week), 
    concat('Abrobar solicitud de veto para el cliente ', @numero_documento), 1, 1, @asignado);

set @id_tarea = last_insert_id();

insert into dim_veto_cliente(id_cliente, motivo, solicitado_por, fecha, id_tarea)
values(@cliente_id, @motivo, @usuario, current_timestamp, @id_tarea);

select concat('OK-id_veto:', last_insert_id()) as result;