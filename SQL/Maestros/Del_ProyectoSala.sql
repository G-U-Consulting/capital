-- =============================================
-- Proceso: Proyectos/Del_ProyectoSala
-- =============================================
--START_PARAM
set @id_sala_venta = NULL,
    @id_proyecto = NULL;
--END_PARAM

delete from dim_sala_proyecto where id_proyecto = @id_proyecto and id_sala_venta = @id_sala_venta;

select 'OK' as result;