-- =============================================
-- Proceso: General/Upd_tramite
-- =============================================
--START_PARAM
set
    @id_tramite = '',
    @tramite = '',
    @texto = '',
    @is_active = '0'
--END_PARAM

UPDATE dim_tramite
    SET tramite = @tramite,
        texto = @texto,
        is_active = if(@is_active = '0', 0, 1)
    WHERE id_tramite = @id_tramite;

select 'OK' as result;