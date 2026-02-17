--START_PARAM
set @id_piso = NULL;
--END_PARAM

UPDATE fact_piso_cc
SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END
WHERE id_piso = @id_piso;

SELECT 'OK' AS resultado;
