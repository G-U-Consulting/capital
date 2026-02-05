--START_PARAM
set @id_proyecto = NULL,
    @usuario = NULL;
--END_PARAM

UPDATE fact_parametrizacion_obra_cc
SET is_active = 0,
    updated_by = @usuario,
    updated_on = NOW()
WHERE id_proyecto = @id_proyecto;

SELECT 'OK' as resultado;
