-- =============================================
-- Proceso: Gestion/Get_InitData
-- =============================================
--START_PARAM
--END_PARAM

select s.id_sede as id, s.sede as nombre,
    count(if(u.id_estado_unidad = 1, 1, null)) as libre,
    count(if(u.id_estado_unidad = 2, 1, null)) as opcionado,
    count(if(u.id_estado_unidad = 3, 1, null)) as consignado,
    count(if(u.id_estado_unidad = 4, 1, null)) as vendido
from dim_sede s
left join fact_proyectos p on s.id_sede = p.id_sede
left join fact_unidades u on p.id_proyecto = u.id_proyecto
where s.is_active = 1
group by s.id_sede
order by s.sede;

select z.id_zona_proyecto as id, z.zona_proyecto as nombre, z.id_sede,
    count(if(u.id_estado_unidad = 1, 1, null)) as libre,
    count(if(u.id_estado_unidad = 2, 1, null)) as opcionado,
    count(if(u.id_estado_unidad = 3, 1, null)) as consignado,
    count(if(u.id_estado_unidad = 4, 1, null)) as vendido
from dim_zona_proyecto z
left join fact_proyectos p on z.id_zona_proyecto = p.id_zona_proyecto
left join fact_unidades u on p.id_proyecto = u.id_proyecto
where z.is_active = 1
group by z.id_zona_proyecto
order by z.zona_proyecto;

select c.id_ciudadela as id, c.ciudadela as nombre, c.id_zona_proyecto,
    count(if(u.id_estado_unidad = 1, 1, null)) as libre,
    count(if(u.id_estado_unidad = 2, 1, null)) as opcionado,
    count(if(u.id_estado_unidad = 3, 1, null)) as consignado,
    count(if(u.id_estado_unidad = 4, 1, null)) as vendido
from dim_ciudadela c
left join fact_proyectos p on c.id_ciudadela = p.id_ciudadela
left join fact_unidades u on p.id_proyecto = u.id_proyecto
where c.is_active = 1
group by c.id_ciudadela
order by c.ciudadela;

select sv.id_sala_venta, sv.sala_venta, sv.id_sede, sv.id_zona_proyecto, sv.id_ciudadela, 
    group_concat(sp.id_proyecto separator ',') as ids_proyectos
from dim_sala_venta sv
left join dim_sala_proyecto sp on sv.id_sala_venta = sp.id_sala_venta
where sv.is_active = 1
group by sv.id_sala_venta
order by sv.sala_venta;

select p.id_proyecto, p.nombre, p.id_sede, p.id_zona_proyecto, p.id_ciudadela,
    count(if(u.id_estado_unidad = 1, 1, null)) as libre,
    count(if(u.id_estado_unidad = 2, 1, null)) as opcionado,
    count(if(u.id_estado_unidad = 3, 1, null)) as consignado,
    count(if(u.id_estado_unidad = 4, 1, null)) as vendido
from fact_proyectos p
left join fact_unidades u on p.id_proyecto = u.id_proyecto
where p.is_active = 1
group by p.id_proyecto
order by p.nombre;

select id_tipo_proyecto as id_clase, tipo_proyecto as clase
from dim_tipo_proyecto
where is_active = 1
order by tipo_proyecto;

select id_estado_unidad, estado_unidad, estado_unidad_plural, color_fondo, color_fuente
from dim_estado_unidad
where is_active = 1;

select * 
from fact_usuarios u
join fact_roles_usuarios ru on u.id_usuario = ru.id_usuario
where (ru.id_rol = 6 or ru.id_rol = 31) and u.is_active = 1;