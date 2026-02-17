--START_PARAM
set @id_remision = NULL,
    @fecha_envio = NULL,
    @observaciones = NULL,
    @usuario = NULL;
--END_PARAM

UPDATE fact_remision_cc
SET fecha_envio = @fecha_envio,
    observaciones = @observaciones,
    updated_by = @usuario
WHERE id_remision = @id_remision
  AND procesado = 0;

SELECT ROW_COUNT() AS filas_afectadas;
