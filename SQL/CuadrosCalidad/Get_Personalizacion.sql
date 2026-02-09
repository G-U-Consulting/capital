--START_PARAM
set @id_proyecto_cc = NULL;
--END_PARAM

SELECT id_parametrizacion, id_proyecto_cc, politica_recoleccion
FROM fact_parametrizacion_obra_cc
WHERE id_proyecto_cc = @id_proyecto_cc AND is_active = 1;
