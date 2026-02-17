--START_PARAM
set @id_proyecto_cc = NULL,
    @observaciones = NULL,
    @usuario = NULL;
--END_PARAM

SET @next_consecutivo = (
    SELECT COALESCE(MAX(consecutivo), 0) + 1
    FROM fact_remision_cc
    WHERE id_proyecto_cc = @id_proyecto_cc
);

INSERT INTO fact_remision_cc (
    id_proyecto_cc, consecutivo, fecha_creacion,
    procesado, observaciones, created_by, is_active
)
VALUES (
    @id_proyecto_cc, @next_consecutivo, CURDATE(),
    0, @observaciones, @usuario, 1
);

SELECT LAST_INSERT_ID() AS id_remision, @next_consecutivo AS consecutivo;
