-- =============================================
-- Proceso: General/Ins_tramite
-- =============================================
--START_PARAM
set @tramite = '',
    @texto = ''

--END_PARAM

INSERT INTO dim_tramite (tramite, texto) VALUES (@tramite, @texto);
SELECT concat('OK-id_tramite:', (SELECT id_tramite from dim_tramite where tramite = @tramite)) AS result;
