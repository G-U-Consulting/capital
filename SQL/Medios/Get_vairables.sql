-- =============================================
-- Proceso: Medios/Get_vairables
-- =============================================
--START_PARAM
--END_PARAM

select id_grupo_img, orden, grupo
from dim_grupo_img
order by orden;
