-- =============================================
-- Proceso: Maestros/Ins_SalaVenta
-- =============================================
--START_PARAM
set @sala_venta = NULL,
    @encuesta_vpn = NULL

--END_PARAM
INSERT INTO dim_sala_venta (sala_venta, encuesta_vpn) VALUES (@sala_venta, @encuesta_vpn);
SELECT concat('OK-id_sala_venta:', (SELECT id_sala_venta from dim_sala_venta where sala_venta = @sala_venta)) AS result;