-- =============================================
-- Proceso: Gestion/Get_InitData
-- =============================================
--START_PARAM
--END_PARAM

select id_sede, sede
from dim_sede
where is_active = 1
order by sede;

select id_zona_proyecto, zona_proyecto, id_sede
from dim_zona_proyecto
where is_active = 1
order by zona_proyecto;

select id_ciudadela, ciudadela, id_zona_proyecto
from dim_ciudadela
where is_active = 1
order by ciudadela;

select sv.id_sala_venta, sv.sala_venta, sv.id_sede, sv.id_zona_proyecto, sv.id_ciudadela, 
    group_concat(sp.id_proyecto separator ',') as ids_proyectos
from dim_sala_venta sv
left join dim_sala_proyecto sp on sv.id_sala_venta = sp.id_sala_venta
where sv.is_active = 1
group by sv.id_sala_venta
order by sv.sala_venta;

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

select * 
from fact_usuarios u
join fact_roles_usuarios ru on u.id_usuario = ru.id_usuario
where (ru.id_rol = 6 or ru.id_rol = 31) and u.is_active = 1;