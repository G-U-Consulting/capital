-- =============================================
-- Proceso: Auditoria/Ins_Auditoria
-- =============================================
--START_PARAM
set @operacion = 'Gerente',
    @datos = '',
    @username = ''

--END_PARAM

INSERT INTO AuditoriaSQL (operacion, datos, username) VALUES (@operacion, @datos, @username);
SELECT 'OK' AS result;