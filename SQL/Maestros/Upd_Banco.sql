-- =============================================
-- Proceso: General/Upd_Banco
-- =============================================
--START_PARAM
set
    @id_banco = '',
    @banco = ''
--END_PARAM

IF NOT EXISTS (SELECT 1 FROM dim_banco_constructor WHERE banco = @banco) THEN
    UPDATE dim_banco_constructor
    SET banco = @banco
    WHERE id_banco = @id_banco;
ELSE
    SELECT 'El banco ya existe' AS result;
END IF;

select 'OK' as result;