-- =============================================
-- Proceso: General/Ins_CajasCompensacion
-- =============================================
--START_PARAM
set @caja = NULL,

--END_PARAM

INSERT INTO dim_caja_compensacion (caja) VALUES (@caja);
SELECT concat('OK-id_caja:', (SELECT id_caja from dim_caja_compensacion where caja = @caja)) AS result;
