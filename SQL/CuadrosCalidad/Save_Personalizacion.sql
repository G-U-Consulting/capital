--START_PARAM
set @id_proyecto_cc = NULL,
    @politica_recoleccion = NULL,
    @usuario = NULL;
--END_PARAM

INSERT INTO fact_parametrizacion_obra_cc (id_proyecto_cc, politica_recoleccion, created_by)
VALUES (@id_proyecto_cc, @politica_recoleccion, @usuario)
ON DUPLICATE KEY UPDATE
    politica_recoleccion = @politica_recoleccion,
    updated_by = @usuario;

SELECT 'OK' AS resultado;
