--START_PARAM
set @id_proyecto = NULL,
    @politica_recoleccion = NULL,
    @usuario = NULL;
--END_PARAM

UPDATE fact_parametrizacion_obra_cc
SET politica_recoleccion = @politica_recoleccion,
    updated_by = @usuario,
    updated_on = NOW()
WHERE id_proyecto = @id_proyecto;

SELECT 'OK' as resultado;
