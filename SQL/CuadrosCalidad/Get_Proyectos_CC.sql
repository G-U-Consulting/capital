--START_PARAM
set @nombre = NULL;
--END_PARAM

SELECT
    pc.id_proyecto_cc,
    p.id_proyecto,
    p.nombre,
    l.id_laboratorio,
    l.nombre AS nombre_laboratorio,
    pc.codigo_laboratorio,
    pc.acc_project_id,
    d.llave as logo,
    pc.created_on,
    pc.is_active,
    CASE WHEN pc.is_active = 1 THEN 'Habilitado' ELSE 'Deshabilitado' END as estado
FROM fact_proyectos p
INNER JOIN fact_proyecto_cc pc ON p.id_proyecto = pc.id_proyecto
INNER JOIN dim_laboratorio_cc l ON pc.id_laboratorio = l.id_laboratorio
LEFT JOIN fact_documento_proyecto dp ON p.id_proyecto = dp.id_proyecto
    AND dp.tipo = 'logo' AND dp.is_active = 1
LEFT JOIN fact_documentos d ON dp.id_documento = d.id_documento
WHERE p.is_active = 1
  AND (@nombre IS NULL OR p.nombre LIKE CONCAT('%', @nombre, '%'))
ORDER BY pc.is_active DESC, p.nombre;
