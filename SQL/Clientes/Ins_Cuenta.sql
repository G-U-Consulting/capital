-- =============================================
-- Proceso: Clientes/Ins_Cuenta
-- =============================================
--START_PARAM
set @id_cuenta = NULL,
    @id_opcion = NULL, -- pendiente js
    @id_cliente = NULL,
    @entidad = NULL,
    @tipo_cuenta = NULL,
    @numero_cuenta = NULL,
    @porcentaje = NULL,
    @tipo_giro = NULL;
--END_PARAM

insert into dim_cuenta_opcion(
    id_opcion, id_cliente, entidad, tipo_cuenta, numero_cuenta, porcentaje, tipo_giro
) values (
    @id_opcion, @id_cliente, @entidad, @tipo_cuenta, @numero_cuenta, @porcentaje, @tipo_giro
);

select concat('OK-id_cuenta:', last_insert_id()) as result;