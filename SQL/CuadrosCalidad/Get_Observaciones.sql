--START_PARAM
set @id_proyecto_cc = NULL,
    @descripcion = NULL;
--END_PARAM

SELECT id_observacion, id_proyecto_cc, descripcion, accion, is_active,
       CASE WHEN is_active = 1 THEN 'Activo' ELSE 'Inactivo' END AS estado
FROM fact_observacion_cc
WHERE id_proyecto_cc = @id_proyecto_cc
  AND (@descripcion IS NULL OR descripcion LIKE CONCAT('%', @descripcion, '%'))
ORDER BY is_active DESC, descripcion;
