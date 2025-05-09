-- =============================================
-- Proceso: General/Upd_documento
-- =============================================
--START_PARAM
set
    @id_documento = '',
    @documento = '',
    @descripcion = ''
--END_PARAM

UPDATE dim_documento
    SET documento = @documento,
    descripcion = @descripcion
    WHERE id_documento = @id_documento;

select 'OK' as result;