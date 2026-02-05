--START_PARAM
set @nombre = NULL,
    @logo = NULL,
    @usuario = NULL;
--END_PARAM

INSERT INTO dim_laboratorio_cc (nombre, logo, created_by, is_active)
VALUES (@nombre, @logo, @usuario, 1);

SELECT LAST_INSERT_ID() AS id_laboratorio;
