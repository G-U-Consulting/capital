--START_PARAM
set @id_proyecto_cc = NULL,
    @usuario = NULL;
--END_PARAM

UPDATE fact_proyecto_cc
SET is_active = 0,
    updated_by = @usuario,
    updated_on = NOW()
WHERE id_proyecto_cc = @id_proyecto_cc;

SELECT 'OK' as resultado;
