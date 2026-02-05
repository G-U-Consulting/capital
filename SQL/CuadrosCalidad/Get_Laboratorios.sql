--START_PARAM
set @nombre = NULL;
--END_PARAM

SELECT
    id_laboratorio,
    nombre,
    logo,
    is_active,
    CASE WHEN is_active = 1 THEN 'Activo' ELSE 'Inactivo' END AS estado
FROM dim_laboratorio_cc
WHERE (@nombre IS NULL OR nombre LIKE CONCAT('%', @nombre, '%'))
ORDER BY is_active DESC, nombre;
