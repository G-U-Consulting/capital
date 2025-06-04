-- =============================================
-- Proceso: Maestros/Del_Banco
-- =============================================
--START_PARAM
set @id_banco = NULL;
--END_PARAM

start transaction;

delete from dim_banco_factor where id_banco = @id_banco;
delete from dim_banco_constructor where id_banco = @id_banco;

commit;

select 'OK' as result;