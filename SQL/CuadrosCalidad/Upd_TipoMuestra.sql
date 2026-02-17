--START_PARAM
set @id_tipo_muestra = NULL,
    @id_clase_muestra = NULL,
    @descripcion = NULL,
    @rango_verde = NULL,
    @rango_amarillo = NULL,
    @rango_rojo = NULL,
    @diametro = NULL;
--END_PARAM

UPDATE dim_tipo_muestra_cc
SET id_clase_muestra = @id_clase_muestra,
    descripcion = @descripcion,
    rango_verde = @rango_verde,
    rango_amarillo = @rango_amarillo,
    rango_rojo = @rango_rojo,
    diametro = @diametro
WHERE id_tipo_muestra = @id_tipo_muestra;

SELECT 'OK' AS resultado;
