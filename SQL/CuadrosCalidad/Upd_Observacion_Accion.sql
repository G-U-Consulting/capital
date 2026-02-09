--START_PARAM
set @id_observacion = NULL,
    @id_proyecto_cc = NULL,
    @parametro = NULL;
--END_PARAM

-- Mutual exclusion only for accion 1 (Cerrar Muestra) and 2 (Liberación)
-- Accion 3 (Defecto) has no mutual exclusion — multiple observations can hold it

-- For parametro=1: reset others where accion NOT IN (2,3)
-- For parametro=2: reset others where accion NOT IN (1,3)
-- For parametro=3: no reset (no mutual exclusion)

UPDATE fact_observacion_cc
SET accion = 0
WHERE id_proyecto_cc = @id_proyecto_cc
  AND id_observacion != @id_observacion
  AND @parametro = 1
  AND accion NOT IN (2, 3);

UPDATE fact_observacion_cc
SET accion = 0
WHERE id_proyecto_cc = @id_proyecto_cc
  AND id_observacion != @id_observacion
  AND @parametro = 2
  AND accion NOT IN (1, 3);

-- Set the target observation's accion (no toggle — always sets the value)
UPDATE fact_observacion_cc
SET accion = @parametro
WHERE id_observacion = @id_observacion;

SELECT 'OK' AS resultado;
