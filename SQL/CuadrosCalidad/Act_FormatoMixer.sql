--START_PARAM
set @id_formato_mixer = NULL,
    @usuario = NULL;
--END_PARAM

UPDATE fact_formato_mixer_cc
SET is_active = 1,
    updated_by = @usuario
WHERE id_formato_mixer = @id_formato_mixer;

SELECT 'OK' AS resultado;
