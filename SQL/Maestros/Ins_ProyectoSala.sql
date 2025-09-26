-- =============================================
-- Proceso: Maestros/Ins_ProyectoSala
-- =============================================
--START_PARAM
set @id_proyecto = NULL,
    @id_sala_venta = NULL;

--END_PARAM
INSERT INTO dim_sala_proyecto (id_proyecto, id_sala_venta) 
VALUES (@id_proyecto, @id_sala_venta);
SELECT 'OK' AS result;