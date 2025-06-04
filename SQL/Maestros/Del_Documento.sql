-- =============================================
-- Proceso: Maestros/Del_Documento
-- =============================================
--START_PARAM
set @id_documento = NULL
--END_PARAM

delete from dim_documento where id_documento = @id_documento;

select 'OK' as result;