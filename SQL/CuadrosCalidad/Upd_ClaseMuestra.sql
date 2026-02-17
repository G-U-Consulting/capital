--START_PARAM
set @id_clase_muestra = NULL,
    @descripcion = NULL;
--END_PARAM

UPDATE dim_clase_muestra_cc
SET descripcion = @descripcion
WHERE id_clase_muestra = @id_clase_muestra;

SELECT 'OK' AS resultado;
