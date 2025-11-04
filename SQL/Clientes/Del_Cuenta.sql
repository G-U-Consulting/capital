-- =============================================
-- Proceso: Clientes/Del_Cuenta
-- =============================================
--START_PARAM
set @id_cuenta = NULL;
--END_PARAM

delete from dim_cuenta_opcion
where id_cuenta = @id_cuenta;

select concat('OK') as result;