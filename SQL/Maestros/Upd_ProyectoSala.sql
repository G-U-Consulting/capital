-- =============================================
-- Proceso: Maestros/Upd_ProyectoSala
-- =============================================
--START_PARAM
set @id_proyecto = NULL,
    @id_sala = NULL,
    @descuento = NULL,
    @opcionar = '0',
    @visualizar = '0',
    @vigencia = NULL;

--END_PARAM
update dim_sala_proyecto
set descuento = @descuento, 
    opcionar = if(@opcionar = '0', 0, 1), 
    visualizar = if(@visualizar = '0', 0, 1), 
    vigencia = @vigencia
where id_proyecto = @id_proyecto and id_sala_venta = @id_sala;
SELECT 'OK' AS result;