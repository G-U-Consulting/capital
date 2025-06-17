-- =============================================
-- Proceso: Maestros/Ins_SalaVenta
-- =============================================
--START_PARAM
set @sala_venta = NULL,
    @encuesta_vpn = NULL,
    @id_playlist = NULL,
    @id_sede = NULL

--END_PARAM
INSERT INTO dim_sala_venta (sala_venta, encuesta_vpn, id_sede, id_playlist) VALUES (@sala_venta, @encuesta_vpn, @id_sede, @id_playlist);
SELECT concat('OK-id_sala_venta:', (SELECT id_sala_venta from dim_sala_venta where sala_venta = @sala_venta)) AS result;