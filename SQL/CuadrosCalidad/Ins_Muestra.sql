--START_PARAM
set @id_proyecto_cc = NULL,
    @id_formato_mixer = NULL,
    @id_tipo_muestra = NULL,
    @id_ubicacion = NULL,
    @id_piso = NULL,
    @id_concretera = NULL,
    @numero_muestra_obra = NULL,
    @fecha = NULL,
    @dia_recoleccion = NULL,
    @localizacion = NULL,
    @observaciones = NULL,
    @usuario = NULL;
--END_PARAM

INSERT INTO fact_muestra_cc (
    id_proyecto_cc, id_formato_mixer, id_tipo_muestra,
    id_ubicacion, id_piso, id_concretera,
    numero_muestra_obra, fecha, dia_recoleccion,
    localizacion, observaciones,
    id_estado, created_by, is_active
)
VALUES (
    @id_proyecto_cc, @id_formato_mixer, @id_tipo_muestra,
    @id_ubicacion, @id_piso, @id_concretera,
    @numero_muestra_obra, @fecha, @dia_recoleccion,
    @localizacion, @observaciones,
    1, @usuario, 1
);

SELECT LAST_INSERT_ID() AS id_muestra;
