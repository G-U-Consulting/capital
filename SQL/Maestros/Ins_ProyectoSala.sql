-- =============================================
-- Proceso: Maestros/Ins_ProyectoSala
-- =============================================
--START_PARAM
set @id_proyecto = NULL,
    @id_sala = NULL;

--END_PARAM
INSERT INTO dim_sala_proyecto (id_proyecto, id_sala_venta) 
VALUES (@id_proyecto, @id_sala);
SELECT 'OK' AS result;