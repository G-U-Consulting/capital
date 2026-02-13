--START_PARAM
set @id_proyecto_cc = NULL;
--END_PARAM

SELECT
    COUNT(*) AS total_muestras,
    SUM(CASE WHEN m.id_estado = 1 THEN 1 ELSE 0 END) AS en_proceso,
    SUM(CASE WHEN m.id_estado = 2 THEN 1 ELSE 0 END) AS en_remision,
    SUM(CASE WHEN m.id_estado = 3 THEN 1 ELSE 0 END) AS entregadas,
    SUM(CASE WHEN m.id_estado = 4 THEN 1 ELSE 0 END) AS con_resultados,
    SUM(CASE WHEN m.id_estado = 5 THEN 1 ELSE 0 END) AS cerradas,
    (SELECT COUNT(*) FROM fact_remision_cc r WHERE r.id_proyecto_cc = @id_proyecto_cc AND r.is_active = 1) AS total_remisiones,
    (SELECT COUNT(*) FROM fact_formato_mixer_cc f WHERE f.id_proyecto_cc = @id_proyecto_cc AND f.is_active = 1) AS total_mixers
FROM fact_muestra_cc m
WHERE m.id_proyecto_cc = @id_proyecto_cc
  AND m.is_active = 1;
