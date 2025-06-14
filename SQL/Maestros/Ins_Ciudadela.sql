-- =============================================
-- Proceso: Maestros/Ins_Ciudadela
-- =============================================
--START_PARAM
set @ciudadela = NULL,
    @id_sede = NULL

--END_PARAM

INSERT INTO dim_ciudadela (ciudadela, id_sede) VALUES (@ciudadela, @id_sede);
SELECT concat('OK-id_ciudadela:', (SELECT id_ciudadela from dim_ciudadela where ciudadela = @ciudadela)) AS result;