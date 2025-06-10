-- =============================================
-- Proceso: General/Upd_documento
-- =============================================
--START_PARAM
set
    @id_documento = '',
    @documento = '',
    @is_active = '0',
    @is_img = '0'
--END_PARAM

UPDATE dim_documento
    SET documento = @documento,
        is_active = if(@is_active = '0', 0, 1),
        is_img = if(@is_img = '0', 0, 1)
    WHERE id_documento = @id_documento;

select 'OK' as result;