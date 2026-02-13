--START_PARAM
set @id_remision = NULL,
    @usuario = NULL;
--END_PARAM

-- Unassign all samples from this remision (revert to estado 1)
UPDATE fact_muestra_cc
SET id_remision = NULL,
    id_estado = 1,
    updated_by = @usuario
WHERE id_remision = @id_remision;

-- Soft delete the remision
UPDATE fact_remision_cc
SET is_active = 0,
    updated_by = @usuario
WHERE id_remision = @id_remision
  AND procesado = 0;

SELECT ROW_COUNT() AS filas_afectadas;
