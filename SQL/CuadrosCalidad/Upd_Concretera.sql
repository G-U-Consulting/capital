--START_PARAM
set @id_concretera = NULL,
    @nombre = NULL,
    @logo = NULL;
--END_PARAM

UPDATE dim_concretera_cc
SET nombre = @nombre,
    logo = COALESCE(@logo, logo)
WHERE id_concretera = @id_concretera;

SELECT 'OK' AS resultado;
