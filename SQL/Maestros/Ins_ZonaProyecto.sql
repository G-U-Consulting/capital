-- =============================================
-- Proceso: Maestros/Ins_ZonaProyecto
-- =============================================
--START_PARAM
set @zona_proyecto = NULL,
    @id_sede = NULL

--END_PARAM

INSERT INTO dim_zona_proyecto (zona_proyecto, id_sede) VALUES (@zona_proyecto, @id_sede);
SELECT concat('OK-id_zona_proyecto:', (SELECT id_zona_proyecto from dim_zona_proyecto where zona_proyecto = @zona_proyecto)) AS result;