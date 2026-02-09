--START_PARAM
set @id_proyecto_cc = NULL,
    @descripcion = NULL,
    @usuario = NULL;
--END_PARAM

INSERT INTO fact_observacion_cc (id_proyecto_cc, descripcion, accion, created_by, is_active)
VALUES (@id_proyecto_cc, @descripcion, NULL, @usuario, 1);

SELECT LAST_INSERT_ID() AS id_observacion;
