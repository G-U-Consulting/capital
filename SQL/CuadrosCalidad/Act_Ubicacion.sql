--START_PARAM
set @id_ubicacion = NULL;
--END_PARAM

UPDATE fact_ubicacion_cc
SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END
WHERE id_ubicacion = @id_ubicacion;

SELECT 'OK' AS resultado;
