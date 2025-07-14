-- =============================================
-- Proceso: Maestros/Del_CajasCompensacion
-- =============================================
--START_PARAM
set @id_caja = NULL
--END_PARAM

delete from dim_caja_compensacion where id_caja = @id_caja;

select 'OK' as result;