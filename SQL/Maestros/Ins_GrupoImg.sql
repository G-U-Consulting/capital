-- =============================================
-- Proceso: General/Ins_grupo_img
-- =============================================
--START_PARAM
set @grupo = '',
set @orden = '0'

--END_PARAM

INSERT INTO dim_grupo_img (grupo, orden) VALUES (@grupo, @orden);
SELECT concat('OK-id_grupo_img:', (SELECT id_grupo_img from dim_grupo_img where grupo = @grupo)) AS result;