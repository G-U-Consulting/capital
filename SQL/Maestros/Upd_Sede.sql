-- =============================================
-- Proceso: General/Upd_Sede
-- =============================================
--START_PARAM
set
    @id_sede = NULL,
    @sede = NULL,
    @alias = NULL,
    @is_active = '0'
--END_PARAM

UPDATE dim_sede
    SET sede = @sede,
        alias = @alias,
        is_active = if(@is_active = '0', 0, 1)
    WHERE id_sede = @id_sede;

select 'OK' as result;