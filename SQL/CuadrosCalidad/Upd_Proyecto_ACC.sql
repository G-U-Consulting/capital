--START_PARAM
set @id_proyecto_cc = NULL,
    @acc_project_id = NULL,
    @acc_container_id = NULL,
    @usuario = NULL;
--END_PARAM

UPDATE fact_proyecto_cc
SET acc_project_id = @acc_project_id,
    acc_container_id = @acc_container_id,
    updated_by = @usuario,
    updated_on = NOW()
WHERE id_proyecto_cc = @id_proyecto_cc;

SELECT 'OK' AS resultado;
