--START_PARAM
set @id_proyecto_cc = NULL,
    @id_tipo_muestra = NULL,
    @id_ubicacion = NULL,
    @id_piso = NULL,
    @fecha_desde = NULL,
    @fecha_hasta = NULL;
--END_PARAM

SELECT
    m.id_muestra,
    m.numero_muestra_obra,
    m.fecha,
    tm.descripcion AS tipo_muestra,
    em.edad,
    em.color AS edad_color,
    dm.fecha_rotura,
    dm.resultado,
    dm.porcentaje,
    tm.rango_verde,
    tm.rango_amarillo,
    tm.rango_rojo
FROM fact_datos_muestra_cc dm
INNER JOIN fact_muestra_cc m ON m.id_muestra = dm.id_muestra
INNER JOIN dim_tipo_muestra_cc tm ON tm.id_tipo_muestra = m.id_tipo_muestra
INNER JOIN dim_edad_muestra_cc em ON em.id_edad_muestra = dm.id_edad_muestra
WHERE m.id_proyecto_cc = @id_proyecto_cc
  AND m.is_active = 1
  AND dm.is_active = 1
  AND dm.resultado IS NOT NULL
  AND (@id_tipo_muestra IS NULL OR m.id_tipo_muestra = @id_tipo_muestra)
  AND (@id_ubicacion IS NULL OR m.id_ubicacion = @id_ubicacion)
  AND (@id_piso IS NULL OR m.id_piso = @id_piso)
  AND (@fecha_desde IS NULL OR m.fecha >= @fecha_desde)
  AND (@fecha_hasta IS NULL OR m.fecha <= @fecha_hasta)
ORDER BY m.fecha, em.edad;
