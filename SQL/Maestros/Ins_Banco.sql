-- =============================================
-- Proceso: General/Ins_Banco
-- =============================================
--START_PARAM
set @banco = ''

--END_PARAM

IF NOT EXISTS (SELECT 1 FROM dim_banco_constructor WHERE banco = @banco) THEN
    INSERT INTO dim_banco_constructor (banco) VALUES (@banco);
    SELECT concat('OK-id_banco:', (SELECT id_banco from dim_banco_constructor where banco = @banco)) AS result;
ELSE
    SELECT 'El banco ya existe' AS result;
END IF;