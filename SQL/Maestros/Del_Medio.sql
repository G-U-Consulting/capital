-- =============================================
-- Proceso: Maestros/Del_Medio
-- =============================================
--START_PARAM
set @id_medio = NULL
--END_PARAM

delete from dim_medio_publicitario where id_medio = @id_medio;

select 'OK' as result;