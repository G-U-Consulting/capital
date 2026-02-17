--START_PARAM
set @id_proyecto_cc = NULL;
--END_PARAM

SELECT id_piso, id_proyecto_cc, cod_acc, numero, activado_acc,
       fecha_sincronizacion, is_active,
       CASE WHEN is_active = 1 THEN 'Activo' ELSE 'Inactivo' END AS estado
FROM fact_piso_cc
WHERE id_proyecto_cc = @id_proyecto_cc
ORDER BY is_active DESC, numero;
