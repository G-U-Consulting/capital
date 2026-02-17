--START_PARAM
set @id_proyecto_cc = NULL,
    @fecha_desde = NULL,
    @fecha_hasta = NULL,
    @id_concretera = NULL;
--END_PARAM

SELECT
    fm.id_formato_mixer,
    fm.id_proyecto_cc,
    fm.id_concretera,
    c.nombre AS nombre_concretera,
    fm.fecha,
    fm.cantidad_m3,
    fm.resistencia_psi,
    fm.resistencia_mpa,
    fm.asentamiento_esperado,
    fm.asentamiento_real,
    fm.temperatura,
    fm.recibido,
    fm.numero_remision,
    fm.seleccionado_muestra,
    fm.id_muestra,
    mu.numero_muestra_obra,
    fm.observaciones,
    fm.is_active,
    CASE WHEN fm.is_active = 1 THEN 'Activo' ELSE 'Inactivo' END AS estado
FROM fact_formato_mixer_cc fm
LEFT JOIN dim_concretera_cc c ON c.id_concretera = fm.id_concretera
LEFT JOIN fact_muestra_cc mu ON mu.id_muestra = fm.id_muestra
WHERE fm.id_proyecto_cc = @id_proyecto_cc
  AND fm.is_active = 1
  AND (@fecha_desde IS NULL OR @fecha_desde = '' OR fm.fecha >= CAST(CONCAT(@fecha_desde, ' 00:00:00') AS DATETIME))
  AND (@fecha_hasta IS NULL OR @fecha_hasta = '' OR fm.fecha <= CAST(CONCAT(@fecha_hasta, ' 23:59:59') AS DATETIME))
  AND (@id_concretera IS NULL OR @id_concretera = '' OR fm.id_concretera = @id_concretera)
ORDER BY fm.fecha DESC;
