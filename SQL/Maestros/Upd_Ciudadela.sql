-- =============================================
-- Proceso: General/Upd_Ciudadela
-- =============================================
--START_PARAM
set
    @id_ciudadela = '',
    @ciudadela = '',
    @is_active
--END_PARAM

UPDATE dim_ciudadela
    SET ciudadela = @ciudadela,
        is_active = if(@is_active = '0', 0, 1)
    WHERE id_ciudadela = @id_ciudadela;

select 'OK' as result;