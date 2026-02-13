--START_PARAM
set @id_proyecto_cc = NULL,
    @procesado = NULL,
    @fecha_desde = NULL,
    @fecha_hasta = NULL;
--END_PARAM

SELECT
    r.id_remision,
    r.id_proyecto_cc,
    r.consecutivo,
    r.fecha_creacion,
    r.fecha_envio,
    r.procesado,
    CASE WHEN r.procesado = 1 THEN 'Procesada' ELSE 'Abierta' END AS estado_remision,
    r.observaciones,
    r.is_active,
    (SELECT COUNT(*) FROM fact_muestra_cc m WHERE m.id_remision = r.id_remision AND m.is_active = 1) AS total_muestras
FROM fact_remision_cc r
WHERE r.id_proyecto_cc = @id_proyecto_cc
  AND r.is_active = 1
  AND (@procesado IS NULL OR r.procesado = @procesado)
  AND (@fecha_desde IS NULL OR r.fecha_creacion >= @fecha_desde)
  AND (@fecha_hasta IS NULL OR r.fecha_creacion <= @fecha_hasta)
ORDER BY r.consecutivo DESC;
