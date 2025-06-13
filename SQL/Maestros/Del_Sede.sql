-- =============================================
-- Proceso: Maestros/Del_Sede
-- =============================================
--START_PARAM
set @id_sede = NULL
--END_PARAM

delete from dim_sede where id_sede = @id_sede;

select 'OK' as result;