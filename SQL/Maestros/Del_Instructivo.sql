-- =============================================
-- Proceso: Maestros/Del_Instructivo
-- =============================================
--START_PARAM
set @id_instructivo = NULL
--END_PARAM

delete from dim_instructivo where id_instructivo = @id_instructivo;

select 'OK' as result;