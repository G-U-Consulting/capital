--START_PARAM
set @descripcion = NULL;
--END_PARAM

INSERT INTO dim_clase_muestra_cc (descripcion, is_active)
VALUES (@descripcion, 1);

SELECT LAST_INSERT_ID() AS id_clase_muestra;
