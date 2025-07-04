-- =============================================
-- Proceso: Maestros/Upd_ProyectoSala
-- =============================================
--START_PARAM
set @id_proyecto = NULL,
    @id_sala_venta = NULL,
    @descuento = NULL,
    @opcionar = '0',
    @visualizar = '0',
    @vigencia = NULL;

--END_PARAM
update dim_sala_proyecto
set descuento = @descuento, 
    opcionar = if(@opcionar = '0', 0, 1), 
    visualizar = if(@visualizar = '0', 0, 1), 
    vigencia = if(@vigencia = '', NULL, @vigencia)
where id_proyecto = @id_proyecto and id_sala_venta = @id_sala_venta;
SELECT 'OK' AS result;