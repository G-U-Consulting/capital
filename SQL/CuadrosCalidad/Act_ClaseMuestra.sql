--START_PARAM
set @id_clase_muestra = NULL,
    @usuario = NULL;
--END_PARAM

UPDATE dim_clase_muestra_cc
SET is_active = 1
WHERE id_clase_muestra = @id_clase_muestra;

SELECT 'OK' AS resultado;
