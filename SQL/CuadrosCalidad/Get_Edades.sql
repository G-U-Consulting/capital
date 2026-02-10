--START_PARAM
set @id_tipo_muestra = NULL;
--END_PARAM

SELECT id_edad_muestra, id_tipo_muestra, edad, color, is_active,
       CASE WHEN is_active = 1 THEN 'Activo' ELSE 'Inactivo' END AS estado
FROM dim_edad_muestra_cc
WHERE id_tipo_muestra = @id_tipo_muestra
ORDER BY is_active DESC, edad ASC;
