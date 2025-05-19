-- =============================================
-- Proceso: General/Ins_Fiduciaria
-- =============================================
--START_PARAM
set @fiduciaria = NULL

--END_PARAM
INSERT INTO dim_fiduciaria (fiduciaria) VALUES (@fiduciaria);
SELECT concat('OK-id_fiduciaria:', (SELECT id_fiduciaria from dim_fiduciaria where fiduciaria = @fiduciaria)) AS result;