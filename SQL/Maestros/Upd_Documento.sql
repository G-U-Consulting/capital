-- =============================================
-- Proceso: General/Upd_documento
-- =============================================
--START_PARAM
set
    @id_documento = '',
    @documento = ''
--END_PARAM

UPDATE dim_documento
    SET documento = @documento
    WHERE id_documento = @id_documento;

select 'OK' as result;