-- =============================================
-- Proceso: Maestros/Del_Subsidio
-- =============================================
--START_PARAM
set @id_subsidio = NULL
--END_PARAM

delete from dim_subsidio_vis where id_subsidio = @id_subsidio;

select 'OK' as result;