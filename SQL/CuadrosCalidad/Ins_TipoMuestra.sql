--START_PARAM
set @id_clase_muestra = NULL,
    @descripcion = NULL,
    @rango_verde = NULL,
    @rango_amarillo = NULL,
    @rango_rojo = NULL,
    @diametro = NULL;
--END_PARAM

INSERT INTO dim_tipo_muestra_cc (id_clase_muestra, descripcion, rango_verde, rango_amarillo, rango_rojo, diametro, is_active)
VALUES (@id_clase_muestra, @descripcion, @rango_verde, @rango_amarillo, @rango_rojo, @diametro, 1);

SELECT LAST_INSERT_ID() AS id_tipo_muestra;
