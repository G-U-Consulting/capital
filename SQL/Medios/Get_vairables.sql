-- =============================================
-- Proceso: Medios/Get_vairables
-- =============================================
--START_PARAM
--END_PARAM

select id_documento, documento, is_img
from dim_documento
where is_active = 1
order by documento;

select id_grupo_img, orden, grupo
from dim_grupo_img
order by orden;


