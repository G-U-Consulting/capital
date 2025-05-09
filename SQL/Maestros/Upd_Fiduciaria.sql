-- =============================================
-- Proceso: General/Upd_Fiduciaria
-- =============================================
--START_PARAM
set
    @id_fiduciaria = '',
    @fiduciaria = ''
--END_PARAM

IF NOT EXISTS (SELECT 1 FROM dim_fiduciaria WHERE fiduciaria = @fiduciaria) THEN
    UPDATE dim_fiduciaria
    SET fiduciaria = @fiduciaria
    WHERE id_fiduciaria = @id_fiduciaria;
ELSE
    SELECT 'La fiduciaria ya existe' AS result;
END IF;

select 'OK' as result;