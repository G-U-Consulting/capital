-- =============================================
-- Proceso: Maestros/Del_Fiduciaria
-- =============================================
--START_PARAM
set @id_fiduciaria = NULL
--END_PARAM

delete from dim_fiduciaria where id_fiduciaria = @id_fiduciaria;

select 'OK' as result;