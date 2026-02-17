--START_PARAM
set @id_edad_muestra = NULL,
    @edad = NULL,
    @color = NULL;
--END_PARAM

UPDATE dim_edad_muestra_cc
SET edad = @edad,
    color = @color
WHERE id_edad_muestra = @id_edad_muestra;

SELECT 'OK' AS resultado;
