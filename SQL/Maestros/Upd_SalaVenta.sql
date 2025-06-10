-- =============================================
-- Proceso: Maestros/Upd_SalaVenta
-- =============================================
--START_PARAM
set
    @id_sala_venta = NULL,
    @sala_venta = NULL,
    @encuesta_vpn = NULL,
    @is_active = '0'
--END_PARAM

UPDATE dim_sala_venta
    SET sala_venta = @sala_venta,
        encuesta_vpn = @encuesta_vpn,
        is_active = if(@is_active = '0', 0, 1)
    WHERE id_sala_venta = @id_sala_venta;

select 'OK' as result;