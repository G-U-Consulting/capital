-- =============================================
-- Proceso: Proyectos/Get_vairables
-- =============================================
--START_PARAM
--END_PARAM

select id_estado_publicacion, estado_publicacion
from dim_estado_pubicacion
where is_active = 1;
select id_tipo_vis, tipo_vis
from dim_tipo_vis
where is_active = 1;
select id_tipo_financiacion, tipo_financiacion
from dim_tipo_financiacion
where is_active = 1;
select id_opcion_visual, opcion_visual
from dim_opcion_visual
where is_active = 1;

select id_sede , sede
from dim_sede;

select id_zona, zona
from dim_zona;

select id_tipo_proyecto, tipo_proyecto 
from dim_tipo_proyecto
where is_active = 1;

select id_ubicacion_proyecto, ubicacion
from dim_ubicacion_proyecto 
where is_active = 1;

