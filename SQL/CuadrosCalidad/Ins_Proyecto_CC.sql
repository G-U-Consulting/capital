--START_PARAM
set @id_proyecto = NULL,
    @politica_recoleccion = 0,
    @usuario = NULL;
--END_PARAM

INSERT INTO fact_parametrizacion_obra_cc
    (id_proyecto, politica_recoleccion, created_by, is_active)
VALUES
    (@id_proyecto, @politica_recoleccion, @usuario, 1)
ON DUPLICATE KEY UPDATE
    is_active = 1,
    politica_recoleccion = @politica_recoleccion,
    updated_by = @usuario,
    updated_on = NOW();

SELECT 'OK' as resultado;
