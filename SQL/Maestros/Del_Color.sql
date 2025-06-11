-- =============================================
-- Proceso: Maestros/Del_Color
-- =============================================
--START_PARAM
set @id_color = NULL
--END_PARAM

delete from dim_color where id_color = @id_color;

select 'OK' as result;