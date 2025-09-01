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
    @telefono1 = NULL;
--END_PARAM

set @cliente_id = @id_cliente;
if @id_cliente is null then
    insert into fact_clientes(numero_documento, nombres, apellido1, apellido2, email1, telefono1)
    values(@numero_documento, @nombres, @apellido1, @apellido2, @email1, @telefono1);
    set @cliente_id = last_insert_id();
end if;

insert into dim_veto_cliente(id_cliente, motivo, vetado_por, fecha)
values(@cliente_id, @motivo, @usuario, current_timestamp);

select concat('OK-id_veto:', last_insert_id()) as result;