--START_PARAM
set @nombre = NULL;
--END_PARAM

SELECT
    p.id_proyecto,
    p.nombre,
    'Disponible' as estado
FROM fact_proyectos p
LEFT JOIN fact_parametrizacion_obra_cc pc
    ON p.id_proyecto = pc.id_proyecto
WHERE p.is_active = 1
  AND pc.id_proyecto IS NULL
  AND (@nombre IS NULL OR p.nombre LIKE CONCAT('%', @nombre, '%'))
ORDER BY p.nombre;
