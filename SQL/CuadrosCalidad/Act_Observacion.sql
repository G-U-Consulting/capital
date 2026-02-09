--START_PARAM
set @id_observacion = NULL,
    @usuario = NULL;
--END_PARAM

UPDATE fact_observacion_cc SET is_active = 1 WHERE id_observacion = @id_observacion;

SELECT 'OK' AS resultado;
