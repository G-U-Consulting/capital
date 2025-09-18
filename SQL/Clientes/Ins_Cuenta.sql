-- =============================================
-- Proceso: Clientes/Ins_Cuenta
-- =============================================
--START_PARAM
set @id_cuenta = NULL,
    @id_desistimiento = NULL,
    @id_cliente = NULL,
    @nombre_cliente = NULL,
    @numero_documento = NULL,
    @entidad = NULL,
    @tipo_cuenta = NULL,
    @numero_cuenta = NULL,
    @porcentaje = NULL,
    @tipo_giro = NULL;
--END_PARAM

insert into dim_cuenta_desistimiento(
    id_desistimiento, id_cliente, nombre_cliente, numero_documento, entidad, tipo_cuenta, numero_cuenta, porcentaje, tipo_giro
) values (
    @id_desistimiento, @id_cliente, @nombre_cliente, @numero_documento, @entidad, @tipo_cuenta, @numero_cuenta, @porcentaje, @tipo_giro
);

select concat('OK-id_cuenta:', last_insert_id()) as result;