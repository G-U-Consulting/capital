--START_PARAM
set @id_formato_mixer = NULL,
    @id_proyecto_cc = NULL,
    @id_tipo_muestra = NULL,
    @fecha = NULL,
    @usuario = NULL;
--END_PARAM

-- Get next numero_muestra_obra for this project
SET @next_num = (SELECT COALESCE(MAX(numero_muestra_obra), 0) + 1 FROM fact_muestra_cc WHERE id_proyecto_cc = @id_proyecto_cc);

-- Create muestra linked to the mixer record, inheriting concretera
INSERT INTO fact_muestra_cc (
    id_formato_mixer, id_proyecto_cc, id_tipo_muestra, id_concretera,
    numero_muestra_obra, fecha, id_estado, created_by, is_active
)
SELECT
    fm.id_formato_mixer,
    @id_proyecto_cc,
    @id_tipo_muestra,
    fm.id_concretera,
    @next_num,
    CASE WHEN @fecha IS NULL OR @fecha = '' THEN DATE(fm.fecha) ELSE @fecha END,
    1,
    @usuario,
    1
FROM fact_formato_mixer_cc fm
WHERE fm.id_formato_mixer = @id_formato_mixer;

SET @new_id = LAST_INSERT_ID();

-- Flag the mixer as having generated a muestra
UPDATE fact_formato_mixer_cc
SET seleccionado_muestra = 1,
    id_muestra = @new_id,
    updated_by = @usuario
WHERE id_formato_mixer = @id_formato_mixer;

SELECT @next_num AS numero_muestra_obra;
