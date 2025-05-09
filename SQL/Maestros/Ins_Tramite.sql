-- =============================================
-- Proceso: General/Ins_tramite
-- =============================================
--START_PARAM
set @tramite = ''

--END_PARAM

INSERT INTO dim_tramite (tramite) VALUES (@tramite);
SELECT concat('OK-id_tramite:', (SELECT id_tramite from dim_tramite where tramite = @tramite)) AS result;
