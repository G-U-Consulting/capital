-- =============================================
-- Proceso: General/Upd_zona_proyecto
-- =============================================
--START_PARAM
set
    @id_zona_proyecto = '',
    @zona_proyecto = '',
    @is_active = '0'
--END_PARAM

UPDATE dim_zona_proyecto
    SET zona_proyecto = @zona_proyecto,
        is_active = if(@is_active = '0', 0, 1)
    WHERE id_zona_proyecto = @id_zona_proyecto;

select 'OK' as result;