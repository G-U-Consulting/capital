-- =============================================
-- Proceso: Proyectos/Get_vairables
-- =============================================
--START_PARAM
 set @id_proyecto = 0;
--END_PARAM

select id_estado_publicacion, estado_publicacion
from dim_estado_publicacion
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
from dim_sede
where is_active = 1;

select id_zona_proyecto, zona_proyecto, id_sede
from dim_zona_proyecto
where is_active = 1;

select id_tipo_proyecto, tipo_proyecto 
from dim_tipo_proyecto
where is_active = 1;

select id_ciudadela, ciudadela, id_sede
from dim_ciudadela 
where is_active = 1;

select id_pie_legal, pie_legal
from dim_pie_legal
where is_active = 1;

select id_fiduciaria, fiduciaria
from dim_fiduciaria
where is_active = 1;

select id_banco as id_banco_constructor, banco
from dim_banco_constructor
where is_active = 1;

select id_banco as id_bancos_financiador, banco
from dim_banco_constructor
where is_active = 1;

select a.id_sala_venta, a.sala_venta
from dim_sala_venta a
where a.is_active = 1;

select a.id_sala_venta, a.sala_venta, id_proyecto
from dim_sala_venta a
join dim_sala_proyecto b on a.id_sala_venta = b.id_sala_venta
where a.is_active = 1 and b.id_proyecto = @id_proyecto;
