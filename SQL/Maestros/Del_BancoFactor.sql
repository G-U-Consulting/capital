-- =============================================
-- Proceso: Proyectos/Del_BancoFactor
-- =============================================
--START_PARAM
set @id_banco_factor = NULL;
--END_PARAM

delete from dim_banco_factor where id_banco_factor = @id_banco_factor;

select 'OK' as result;