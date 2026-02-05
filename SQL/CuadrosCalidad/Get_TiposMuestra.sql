--START_PARAM
set @descripcion = NULL;
--END_PARAM

SELECT
    tm.id_tipo_muestra,
    tm.id_clase_muestra,
    cm.descripcion AS clase_descripcion,
    tm.descripcion,
    tm.rango_verde,
    tm.rango_amarillo,
    tm.rango_rojo,
    tm.diametro,
    CASE WHEN tm.is_active = 1 THEN 'Activo' ELSE 'Inactivo' END AS estado
FROM dim_tipo_muestra_cc tm
INNER JOIN dim_clase_muestra_cc cm ON cm.id_clase_muestra = tm.id_clase_muestra
WHERE tm.is_active = 1
  AND (@descripcion IS NULL OR tm.descripcion LIKE CONCAT('%', @descripcion, '%'))
ORDER BY tm.descripcion;
