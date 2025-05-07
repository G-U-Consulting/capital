-- =============================================
-- Proceso: General/Upd_tramite
-- =============================================
--START_PARAM
set
    @id_tramite = '',
    @tramite = ''
--END_PARAM

UPDATE dim_tramite
    SET tramite = @tramite
    WHERE id_tramite = @id_tramite;

select 'OK' as result;