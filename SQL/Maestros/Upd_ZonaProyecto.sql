-- =============================================
-- Proceso: General/Upd_zona_proyecto
-- =============================================
--START_PARAM
set
    @id_zona_proyecto = '',
    @zona_proyecto = ''
--END_PARAM

IF NOT EXISTS (SELECT 1 FROM dim_zona_proyecto WHERE zona_proyecto = @zona_proyecto) THEN
    UPDATE dim_zona_proyecto
    SET zona_proyecto = @zona_proyecto
    WHERE id_zona_proyecto = @id_zona_proyecto;
ELSE
    SELECT 'La zona proyecto ya existe' AS result;
END IF;

select 'OK' as result;