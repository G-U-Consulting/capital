-- =============================================
-- Proceso: Maestros/Del_Ciudadela
-- =============================================
--START_PARAM
set @id_ciudadela = NULL
--END_PARAM

delete from dim_ciudadela where id_ciudadela = @id_ciudadela;

select 'OK' as result;