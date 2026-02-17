--START_PARAM
set @id_muestra = NULL,
    @id_remision = NULL,
    @accion = NULL,
    @usuario = NULL;
--END_PARAM

-- accion: 'assign' or 'unassign'

UPDATE fact_muestra_cc
SET id_remision = CASE WHEN @accion = 'assign' THEN @id_remision ELSE NULL END,
    id_estado = CASE WHEN @accion = 'assign' THEN 2 ELSE 1 END,
    updated_by = @usuario
WHERE id_muestra = @id_muestra
  AND is_active = 1;

SELECT 'OK' AS resultado;
