-- =============================================
-- Proceso: Clientes/Del_Veto
-- =============================================
--START_PARAM
set @id_veto;
--END_PARAM

delete from dim_veto_cliente where id_veto = @id_veto;

select 'OK' as result;