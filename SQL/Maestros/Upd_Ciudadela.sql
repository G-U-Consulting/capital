-- =============================================
-- Proceso: Maestros/Upd_Ciudadela
-- =============================================
--START_PARAM
set
    @id_ciudadela = NULL,
    @ciudadela = NULL,
    @is_active = '0',
    @id_sede = NULL
--END_PARAM

UPDATE dim_ciudadela
    SET ciudadela = @ciudadela,
        is_active = if(@is_active = '0', 0, 1),
        id_sede = @id_sede
    WHERE id_ciudadela = @id_ciudadela;

select 'OK' as result;