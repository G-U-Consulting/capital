--START_PARAM
set @id_observacion = NULL,
    @descripcion = NULL;
--END_PARAM

UPDATE fact_observacion_cc
SET descripcion = @descripcion
WHERE id_observacion = @id_observacion;

SELECT 'OK' AS resultado;
