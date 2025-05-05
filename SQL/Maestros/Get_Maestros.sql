-- =============================================
-- Proceso: General/Get_Maestros
-- =============================================
--START_PARAM

--END_PARAM

select id_grupo_img, orden, grupo
from dim_grupo_img
order by orden;

select id_instructivo, instructivo, procedimiento, documentacion_cierre, notas
from dim_instructivo;

select id_tipo_financiacion, tipo_financiacion
from dim_tipo_financiacion
where is_active = 1;

select id_opcion_visual, opcion_visual
from dim_opcion_visual
where is_active = 1;

select id_sede , sede
from dim_sede;

select id_zona_proyecto, zona_proyecto
from dim_zona_proyecto;

select id_tipo_proyecto, tipo_proyecto 
from dim_tipo_proyecto
where is_active = 1;

select id_ciudadela, ciudadela
from dim_ciudadela 
where is_active = 1;

select id_pie_legal, pie_legal, texto, notas_extra
from dim_pie_legal
where is_active = 1;

select id_fiduciaria, fiduciaria
from dim_fiduciaria
where is_active = 1;

select id_banco, banco
from dim_banco_constructor;

select id_factor, factor from dim_factor;
select id_tipo_factor, tipo_factor from dim_tipo_factor;

select id_banco, id_factor, id_tipo_factor, valor from dim_banco_factor;