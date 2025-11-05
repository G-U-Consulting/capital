-- =============================================
-- Proceso: Clientes/Upd_Cuenta
-- =============================================
--START_PARAM
set @id_cuenta = NULL,
    @id_opcion = NULL,
    @id_cliente = NULL,
    @entidad = NULL,
    @tipo_cuenta = NULL,
    @numero_cuenta = NULL,
    @porcentaje = NULL,
    @tipo_giro = NULL;
--END_PARAM

update dim_cuenta_opcion
set id_opcion = @id_opcion,
    id_cliente = @id_cliente,
    entidad = @entidad,
    tipo_cuenta = @tipo_cuenta,
    numero_cuenta = @numero_cuenta,
    porcentaje = @porcentaje,
    tipo_giro = @tipo_giro
where id_cuenta = @id_cuenta;

select concat('OK') as result;