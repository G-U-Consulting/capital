--START_PARAM
set @id_concretera = NULL,
    @usuario = NULL;
--END_PARAM

UPDATE dim_concretera_cc
SET is_active = 1
WHERE id_concretera = @id_concretera;

SELECT 'OK' AS resultado;
