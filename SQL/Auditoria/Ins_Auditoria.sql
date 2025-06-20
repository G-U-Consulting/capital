-- =============================================
-- Proceso: Auditoria/Ins_Auditoria
-- =============================================
--START_PARAM
set @operacion = NULL,
    @datos = NULL,
    @username = NULL,
    @error = NULL;

--END_PARAM

INSERT INTO AuditoriaSQL (operacion, datos, username, error) VALUES (@operacion, @datos, @username, @error);
SELECT 'OK' AS result;