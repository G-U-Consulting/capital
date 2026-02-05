--START_PARAM
set @id_tipo_muestra = NULL,
    @usuario = NULL;
--END_PARAM

UPDATE dim_tipo_muestra_cc
SET is_active = 0
WHERE id_tipo_muestra = @id_tipo_muestra;

SELECT 'OK' AS resultado;
