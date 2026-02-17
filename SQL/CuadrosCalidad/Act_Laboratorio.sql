--START_PARAM
set @id_laboratorio = NULL,
    @usuario = NULL;
--END_PARAM

UPDATE dim_laboratorio_cc
SET is_active = 1
WHERE id_laboratorio = @id_laboratorio;

SELECT 'OK' AS resultado;
