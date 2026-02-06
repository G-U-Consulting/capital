--START_PARAM
set @id_proyecto = NULL,
    @id_laboratorio = NULL,
    @codigo_laboratorio = NULL,
    @usuario = NULL;
--END_PARAM

INSERT INTO fact_proyecto_cc
    (id_proyecto, id_laboratorio, codigo_laboratorio, created_by, is_active)
VALUES
    (@id_proyecto, @id_laboratorio, @codigo_laboratorio, @usuario, 1)
ON DUPLICATE KEY UPDATE
    is_active = 1,
    id_laboratorio = @id_laboratorio,
    codigo_laboratorio = @codigo_laboratorio,
    updated_by = @usuario,
    updated_on = NOW();

SELECT 'OK' as resultado;
