-- =============================================
-- Proceso: Maestros/Del_Tramite
-- =============================================
--START_PARAM
set @id_tramite = NULL
--END_PARAM

delete from dim_tramite where id_tramite = @id_tramite;

select 'OK' as result;