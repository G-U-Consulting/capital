--START_PARAM
set @id_edad_muestra = NULL;
--END_PARAM

UPDATE dim_edad_muestra_cc SET is_active = 1 WHERE id_edad_muestra = @id_edad_muestra;

SELECT 'OK' AS resultado;
