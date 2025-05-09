-- =============================================
-- Proceso: General/Ins_banco_factor
-- =============================================
--START_PARAM
set @id_banco = '',
    @id_factor = '',
    @valor = '0'

--END_PARAM

IF NOT EXISTS (SELECT 1 FROM dim_banco_factor WHERE id_banco = @id_banco AND id_factor = @id_factor) THEN
    INSERT INTO dim_banco_factor (banco_factor) VALUES (@banco_factor);
    SELECT concat('OK-id_banco_factor:', (SELECT id_banco_factor from dim_banco_factor where id_banco = @id_banco AND id_factor = @id_factor)) AS result;
ELSE
    SELECT 'El banco factor ya existe' AS result;
END IF;