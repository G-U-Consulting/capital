-- =============================================
-- Proceso: Maestros/Del_PieLegal
-- =============================================
--START_PARAM
set @id_pie_legal = NULL
--END_PARAM

delete from dim_pie_legal where id_pie_legal = @id_pie_legal;

select 'OK' as result;