--START_PARAM
set @id_tipo_muestra = NULL,
    @edad = NULL,
    @color = NULL;
--END_PARAM

INSERT INTO dim_edad_muestra_cc (id_tipo_muestra, edad, color, is_active)
VALUES (@id_tipo_muestra, @edad, @color, 1);

SELECT LAST_INSERT_ID() AS id_edad_muestra;
