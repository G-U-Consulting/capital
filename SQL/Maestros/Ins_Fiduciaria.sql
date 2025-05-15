-- =============================================
-- Proceso: General/Ins_Fiduciaria
-- =============================================
--START_PARAM
set @fiduciaria = ''

--END_PARAM

IF NOT EXISTS (SELECT 1 FROM dim_fiduciaria WHERE fiduciaria = @fiduciaria) THEN
    INSERT INTO dim_fiduciaria (fiduciaria) VALUES (@fiduciaria);
    SELECT concat('OK-id_fiduciaria:', (SELECT id_fiduciaria from dim_fiduciaria where fiduciaria = @fiduciaria)) AS result;
ELSE
    SELECT 'La fiduciaria ya existe' AS result;
END IF;