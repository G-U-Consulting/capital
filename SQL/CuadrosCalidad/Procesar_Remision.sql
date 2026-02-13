--START_PARAM
set @id_remision = NULL,
    @usuario = NULL;
--END_PARAM

-- Mark remision as processed
UPDATE fact_remision_cc
SET procesado = 1,
    fecha_envio = COALESCE(fecha_envio, CURDATE()),
    updated_by = @usuario
WHERE id_remision = @id_remision
  AND procesado = 0;

-- Update assigned samples to estado 3 (Entregada)
UPDATE fact_muestra_cc
SET id_estado = 3,
    updated_by = @usuario
WHERE id_remision = @id_remision
  AND is_active = 1;

SELECT ROW_COUNT() AS filas_afectadas;
