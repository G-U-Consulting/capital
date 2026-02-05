--START_PARAM
set @id_laboratorio = NULL,
    @nombre = NULL,
    @logo = NULL;
--END_PARAM

UPDATE dim_laboratorio_cc
SET nombre = @nombre,
    logo = COALESCE(@logo, logo)
WHERE id_laboratorio = @id_laboratorio;

SELECT 'OK' AS resultado;
