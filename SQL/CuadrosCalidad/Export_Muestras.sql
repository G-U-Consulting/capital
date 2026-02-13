--START_PARAM
set @id_proyecto_cc = NULL,
    @id_tipo_muestra = NULL,
    @id_ubicacion = NULL,
    @id_piso = NULL,
    @fecha_desde = NULL,
    @fecha_hasta = NULL;
--END_PARAM

SELECT
    m.id_muestra AS 'ID Muestra',
    m.numero_muestra_obra AS 'No. Muestra Obra',
    m.fecha AS 'Fecha',
    CASE m.dia_recoleccion
        WHEN 1 THEN 'Lunes'
        WHEN 2 THEN 'Martes'
        WHEN 3 THEN 'Miércoles'
        WHEN 4 THEN 'Jueves'
        WHEN 5 THEN 'Viernes'
        WHEN 6 THEN 'Sábado'
        WHEN 7 THEN 'Domingo'
        ELSE ''
    END AS 'Día Recolección',
    tm.descripcion AS 'Tipo Muestra',
    cm.descripcion AS 'Clase Muestra',
    u.descripcion AS 'Ubicación',
    p.numero AS 'Piso',
    c.nombre AS 'Concretera',
    m.localizacion AS 'Localización',
    e.descripcion AS 'Estado',
    r.consecutivo AS 'No. Remisión',
    m.observaciones AS 'Observaciones'
FROM fact_muestra_cc m
LEFT JOIN dim_tipo_muestra_cc tm ON tm.id_tipo_muestra = m.id_tipo_muestra
LEFT JOIN dim_clase_muestra_cc cm ON cm.id_clase_muestra = tm.id_clase_muestra
LEFT JOIN fact_ubicacion_cc u ON u.id_ubicacion = m.id_ubicacion
LEFT JOIN fact_piso_cc p ON p.id_piso = m.id_piso
LEFT JOIN dim_concretera_cc c ON c.id_concretera = m.id_concretera
LEFT JOIN dim_estado_cc e ON e.id_estado_cc = m.id_estado
LEFT JOIN fact_remision_cc r ON r.id_remision = m.id_remision
WHERE m.id_proyecto_cc = @id_proyecto_cc
  AND m.is_active = 1
  AND (@id_tipo_muestra IS NULL OR m.id_tipo_muestra = @id_tipo_muestra)
  AND (@id_ubicacion IS NULL OR m.id_ubicacion = @id_ubicacion)
  AND (@id_piso IS NULL OR m.id_piso = @id_piso)
  AND (@fecha_desde IS NULL OR m.fecha >= @fecha_desde)
  AND (@fecha_hasta IS NULL OR m.fecha <= @fecha_hasta)
ORDER BY m.fecha DESC, m.id_muestra DESC;
