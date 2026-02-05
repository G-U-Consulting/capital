--START_PARAM
set @nombre = NULL;
--END_PARAM

SELECT
    p.id_proyecto,
    p.nombre,
    pc.politica_recoleccion,
    CASE pc.politica_recoleccion
        WHEN 0 THEN 'Antes del festivo'
        WHEN 1 THEN 'Después del festivo'
    END as politica_descripcion,
    d.llave as logo,
    pc.created_on,
    'Habilitado' as estado
FROM fact_proyectos p
INNER JOIN fact_parametrizacion_obra_cc pc ON p.id_proyecto = pc.id_proyecto
LEFT JOIN fact_documento_proyecto dp ON p.id_proyecto = dp.id_proyecto
    AND dp.tipo = 'logo' AND dp.is_active = 1
LEFT JOIN fact_documentos d ON dp.id_documento = d.id_documento
WHERE p.is_active = 1
  AND pc.is_active = 1
  AND (@nombre IS NULL OR p.nombre LIKE CONCAT('%', @nombre, '%'))
ORDER BY p.nombre;
