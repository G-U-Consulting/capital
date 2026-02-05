--START_PARAM
set @nombre = NULL;
--END_PARAM

SELECT
    id_concretera,
    nombre,
    logo,
    CASE WHEN is_active = 1 THEN 'Activo' ELSE 'Inactivo' END AS estado
FROM dim_concretera_cc
WHERE is_active = 1
  AND (@nombre IS NULL OR nombre LIKE CONCAT('%', @nombre, '%'))
ORDER BY nombre;
