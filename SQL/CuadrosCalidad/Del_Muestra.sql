--START_PARAM
set @id_muestra = NULL,
    @usuario = NULL;
--END_PARAM

UPDATE fact_muestra_cc
SET is_active = 0,
    updated_by = @usuario
WHERE id_muestra = @id_muestra
  AND id_remision IS NULL;

SELECT ROW_COUNT() AS filas_afectadas;
