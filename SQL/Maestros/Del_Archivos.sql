-- =============================================
-- Proceso: Usuarios/Del_Archivos
-- =============================================
--START_PARAM
set
    @id_documento = NULL
--END_PARAM

delete from dim_documento_archivo where id_documento = @id_documento;

select 'OK' as result;