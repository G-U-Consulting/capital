-- =============================================
-- Proceso: General/Upd_TiposTramite
-- =============================================
--START_PARAM
set
    @id_tipo_tramite = NULL,
    @tipo_tramite = NULL,
    @is_active = '0'
--END_PARAM

UPDATE dim_tipo_tramite
    SET tipo_tramite = @tipo_tramite,
        is_active = if(@is_active = '0', 0, 1)
    WHERE id_tipo_tramite = @id_tipo_tramite;

select 'OK' as result;