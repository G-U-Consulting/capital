--START_PARAM
set @id_proyecto_cc = NULL,
    @id_remision = NULL,
    @sin_remision = NULL,
    @id_tipo_muestra = NULL,
    @id_estado = NULL,
    @fecha_desde = NULL,
    @fecha_hasta = NULL;
--END_PARAM

SELECT
    m.id_muestra,
    m.id_formato_mixer,
    m.id_proyecto_cc,
    m.id_tipo_muestra,
    tm.descripcion AS tipo_muestra,
    cm.descripcion AS clase_muestra,
    m.id_ubicacion,
    u.descripcion AS ubicacion,
    m.id_piso,
    p.numero AS piso,
    m.id_estado,
    e.descripcion AS estado_muestra,
    m.id_remision,
    m.id_concretera,
    c.nombre AS nombre_concretera,
    m.numero_muestra_obra,
    m.fecha,
    m.dia_recoleccion,
    m.localizacion,
    m.observaciones,
    m.archivo_1,
    m.archivo_2,
    m.is_active,
    CASE WHEN m.is_active = 1 THEN 'Activo' ELSE 'Inactivo' END AS estado
FROM fact_muestra_cc m
LEFT JOIN dim_tipo_muestra_cc tm ON tm.id_tipo_muestra = m.id_tipo_muestra
LEFT JOIN dim_clase_muestra_cc cm ON cm.id_clase_muestra = tm.id_clase_muestra
LEFT JOIN fact_ubicacion_cc u ON u.id_ubicacion = m.id_ubicacion
LEFT JOIN fact_piso_cc p ON p.id_piso = m.id_piso
LEFT JOIN dim_estado_cc e ON e.id_estado_cc = m.id_estado
LEFT JOIN dim_concretera_cc c ON c.id_concretera = m.id_concretera
WHERE m.id_proyecto_cc = @id_proyecto_cc
  AND m.is_active = 1
  AND (@id_remision IS NULL OR @id_remision = '' OR m.id_remision = @id_remision)
  AND (@sin_remision IS NULL OR @sin_remision = '' OR (@sin_remision = 1 AND m.id_remision IS NULL))
  AND (@id_tipo_muestra IS NULL OR @id_tipo_muestra = '' OR m.id_tipo_muestra = @id_tipo_muestra)
  AND (@id_estado IS NULL OR @id_estado = '' OR m.id_estado = @id_estado)
  AND (@fecha_desde IS NULL OR @fecha_desde = '' OR m.fecha >= @fecha_desde)
  AND (@fecha_hasta IS NULL OR @fecha_hasta = '' OR m.fecha <= @fecha_hasta)
ORDER BY m.fecha DESC, m.id_muestra DESC;
