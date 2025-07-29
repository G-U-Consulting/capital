-- =============================================
-- Proceso: Salas/Del_Hito
-- =============================================
--START_PARAM
set @id_hito = NULL;
--END_PARAM

delete from dim_hito_cargo where id_hito = @id_hito;
delete from dim_hito_sala where id_hito = @id_hito;

select 'OK' as result;