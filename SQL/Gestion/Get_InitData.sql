-- =============================================
-- Proceso: Gestion/Get_InitData
-- =============================================
--START_PARAM
--END_PARAM

select id_sede, sede
from dim_sede
where is_active = 1
order by sede;

select id_ciudadela, ciudadela, id_sede
from dim_ciudadela
where is_active = 1
order by ciudadela;

select id_proyecto, nombre, id_sede, id_zona_proyecto, id_ciudadela
from fact_proyectos
where is_active = 1
order by nombre;

select id_tipo_proyecto as id_clase, tipo_proyecto as clase
from dim_tipo_proyecto
where is_active = 1
order by tipo_proyecto;

select id_estado_unidad, estado_unidad
from dim_estado_unidad
where is_active = 1;
