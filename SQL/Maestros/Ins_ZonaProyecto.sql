-- =============================================
-- Proceso: General/Ins_zona_proyecto
-- =============================================
--START_PARAM
set @zona_proyecto = NULL

--END_PARAM

INSERT INTO dim_zona_proyecto (zona_proyecto) VALUES (@zona_proyecto);
SELECT concat('OK-id_zona_proyecto:', (SELECT id_zona_proyecto from dim_zona_proyecto where zona_proyecto = @zona_proyecto)) AS result;