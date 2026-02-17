--START_PARAM
set @id_muestra = NULL,
    @id_tipo_muestra = NULL,
    @id_ubicacion = NULL,
    @id_piso = NULL,
    @id_concretera = NULL,
    @id_formato_mixer = NULL,
    @numero_muestra_obra = NULL,
    @fecha = NULL,
    @dia_recoleccion = NULL,
    @localizacion = NULL,
    @observaciones = NULL,
    @usuario = NULL;
--END_PARAM

UPDATE fact_muestra_cc
SET id_tipo_muestra = @id_tipo_muestra,
    id_ubicacion = @id_ubicacion,
    id_piso = @id_piso,
    id_concretera = @id_concretera,
    id_formato_mixer = @id_formato_mixer,
    numero_muestra_obra = @numero_muestra_obra,
    fecha = @fecha,
    dia_recoleccion = @dia_recoleccion,
    localizacion = @localizacion,
    observaciones = @observaciones,
    updated_by = @usuario
WHERE id_muestra = @id_muestra;

SELECT 'OK' AS resultado;
