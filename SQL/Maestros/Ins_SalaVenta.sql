-- =============================================
-- Proceso: Maestros/Ins_SalaVenta
-- =============================================
--START_PARAM
set @sala_venta = NULL,
    @encuesta_vpn = NULL,
    @id_playlist = NULL,
    @id_sede = NULL,
    @id_zona_proyecto = NULL,
    @id_ciudadela = NULL,
    @pro_futuros = '0',
    @is_feria = '0';

--END_PARAM
INSERT INTO dim_sala_venta (sala_venta, encuesta_vpn, id_sede, id_playlist, id_zona_proyecto, id_ciudadela, is_feria, pro_futuros) 
VALUES (@sala_venta, @encuesta_vpn, if(@id_sede = '', NULL, @id_sede), @id_playlist, 
    if(@id_zona_proyecto = '', NULL, @id_zona_proyecto), if(@id_ciudadela = '', NULL, @id_ciudadela), 
    if(@is_feria = '0' or @is_feria is NULL, 0, 1), if(@pro_futuros = '0' or @pro_futuros is NULL, 0, 1));
SELECT concat('OK-id_sala_venta:', (SELECT id_sala_venta from dim_sala_venta where sala_venta = @sala_venta)) AS result;