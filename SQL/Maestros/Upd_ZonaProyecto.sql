-- =============================================
-- Proceso: Maestros/Upd_ZonaProyecto
-- =============================================
--START_PARAM
set
    @id_zona_proyecto = NULL,
    @zona_proyecto = NULL,
    @is_active = '0',
    @id_sede = NULL
--END_PARAM

UPDATE dim_zona_proyecto
    SET zona_proyecto = @zona_proyecto,
        is_active = if(@is_active = '0', 0, 1),
        id_sede = @id_sede
    WHERE id_zona_proyecto = @id_zona_proyecto;

select 'OK' as result;