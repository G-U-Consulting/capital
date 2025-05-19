-- =============================================
-- Proceso: General/Ins_Ciudadela
-- =============================================
--START_PARAM
set @ciudadela = NULL

--END_PARAM

INSERT INTO dim_ciudadela (ciudadela) VALUES (@ciudadela);
SELECT concat('OK-id_ciudadela:', (SELECT id_ciudadela from dim_ciudadela where ciudadela = @ciudadela)) AS result;