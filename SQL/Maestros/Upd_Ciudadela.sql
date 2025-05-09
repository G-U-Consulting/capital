-- =============================================
-- Proceso: General/Upd_Ciudadela
-- =============================================
--START_PARAM
set
    @id_ciudadela = '',
    @ciudadela = ''
--END_PARAM

IF NOT EXISTS (SELECT 1 FROM dim_ciudadela WHERE ciudadela = @ciudadela) THEN
    UPDATE dim_ciudadela
    SET ciudadela = @ciudadela
    WHERE id_ciudadela = @id_ciudadela;
ELSE
    SELECT 'La ciudadela ya existe' AS result;
END IF;

select 'OK' as result;