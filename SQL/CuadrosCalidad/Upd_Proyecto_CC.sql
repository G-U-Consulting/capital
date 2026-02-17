--START_PARAM
set @id_proyecto_cc = NULL,
    @id_laboratorio = NULL,
    @codigo_laboratorio = NULL,
    @usuario = NULL;
--END_PARAM

UPDATE fact_proyecto_cc
SET id_laboratorio = @id_laboratorio,
    codigo_laboratorio = @codigo_laboratorio,
    updated_by = @usuario,
    updated_on = NOW()
WHERE id_proyecto_cc = @id_proyecto_cc;

SELECT 'OK' as resultado;
