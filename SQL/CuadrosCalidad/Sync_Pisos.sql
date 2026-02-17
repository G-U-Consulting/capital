--START_PARAM
set @id_proyecto_cc = NULL,
    @cod_acc = NULL,
    @numero = NULL,
    @usuario = NULL;
--END_PARAM

INSERT INTO fact_piso_cc (id_proyecto_cc, cod_acc, numero, activado_acc, fecha_sincronizacion, created_by, is_active)
VALUES (@id_proyecto_cc, @cod_acc, @numero, 1, NOW(), @usuario, 1)
ON DUPLICATE KEY UPDATE
    numero = @numero,
    activado_acc = 1,
    fecha_sincronizacion = NOW();

SELECT 'OK' AS resultado;
