--START_PARAM
set @nombre = NULL;
--END_PARAM

SELECT
    id_clase_muestra,
    descripcion,
    is_active,
    CASE WHEN is_active = 1 THEN 'Activo' ELSE 'Inactivo' END AS estado
FROM dim_clase_muestra_cc
WHERE (@nombre IS NULL OR descripcion LIKE CONCAT('%', @nombre, '%'))
ORDER BY is_active DESC, descripcion;
