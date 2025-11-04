-- =============================================
-- Proceso: Clientes/Get_Trazabilidad
-- =============================================
--START_PARAM

--END_PARAM

select * from (
select id_visita as id_obj, v.id_cliente, 
    concat(coalesce(c.nombres, ''), ' ', coalesce(c.apellido1, ''), ' ', coalesce(c.apellido2, '')) as nombre_cliente, 
    null as id_unidad, null as unidad, p.id_proyecto, p.nombre as proyecto,
    date_format(v.created_on, '%Y-%m-%d') as created_on, v.created_by as asesor, us.nombres as nombre_asesor, 'Visita' as obj,
    p.id_sede, p.id_zona_proyecto, p.id_ciudadela
from fact_visitas v 
join fact_clientes c on v.id_cliente = c.id_cliente
join fact_proyectos p on v.id_proyecto = p.id_proyecto
left join fact_usuarios us on v.created_by = us.usuario collate utf8mb4_unicode_ci
union
select co.id_cotizacion as id_obj, co.id_cliente, 
    concat(coalesce(c.nombres, ''), ' ', coalesce(c.apellido1, ''), ' ', coalesce(c.apellido2, '')) as nombre_cliente,
    n.id_unidad, coalesce(a.nombre, un.nombre_unidad) as unidad, p.id_proyecto, p.nombre as proyecto,
    date_format(co.created_on, '%Y-%m-%d') as created_on, co.created_by as asesor, us.nombres as nombre_asesor, 'Cotización' as obj,
    p.id_sede, p.id_zona_proyecto, p.id_ciudadela
from fact_cotizaciones co
left join fact_clientes c on co.id_cliente = c.id_cliente
left join fact_negocios_unidades n on co.id_cotizacion = n.id_cotizacion
left join fact_unidades un on n.id_unidad = un.id_unidad
left join dim_agrupacion_unidad a on un.id_agrupacion = a.id_agrupacion
left join fact_usuarios us on co.created_by = us.usuario collate utf8mb4_unicode_ci 
join fact_proyectos p on co.id_proyecto = p.id_proyecto
union
select o.id_opcion as id_obj, co.id_cliente, 
    concat(coalesce(c.nombres, ''), ' ', coalesce(c.apellido1, ''), ' ', coalesce(c.apellido2, '')) as nombre_cliente,
    n.id_unidad, coalesce(a.nombre, un.nombre_unidad) as unidad, p.id_proyecto, p.nombre as proyecto,
    date_format(o.created_on, '%Y-%m-%d') as created_on, o.created_by as asesor, us.nombres as nombre_asesor, 'Opción' as obj,
    p.id_sede, p.id_zona_proyecto, p.id_ciudadela
from fact_opcion o
left join fact_cotizaciones co on o.id_cotizacion = co.id_cotizacion
left join fact_clientes c on co.id_cliente = c.id_cliente
left join fact_negocios_unidades n on co.id_cotizacion = n.id_cotizacion
left join fact_unidades un on n.id_unidad = un.id_unidad
left join dim_agrupacion_unidad a on un.id_agrupacion = a.id_agrupacion
left join fact_usuarios us on co.created_by = us.usuario collate utf8mb4_unicode_ci 
join fact_proyectos p on co.id_proyecto = p.id_proyecto
union
select id_venta as id_obj, co.id_cliente, 
    concat(coalesce(c.nombres, ''), ' ', coalesce(c.apellido1, ''), ' ', coalesce(c.apellido2, '')) as nombre_cliente, 
    un.id_unidad, coalesce(a.nombre, un.nombre_unidad) as unidad, p.id_proyecto, p.nombre as proyecto,
    date_format(v.created_on, '%Y-%m-%d') as created_on, v.created_by as asesor, us.nombres as nombre_asesor, 'Venta' as obj,
    p.id_sede, p.id_zona_proyecto, p.id_ciudadela 
from fact_ventas v 
left join fact_opcion o on v.id_opcion = o.id_opcion
left join fact_cotizaciones co on o.id_cotizacion = co.id_cotizacion
left join fact_clientes c on co.id_cliente = c.id_cliente
left join fact_negocios_unidades n on co.id_cotizacion = n.id_cotizacion
left join fact_unidades un on n.id_unidad = un.id_unidad
join fact_proyectos p on un.id_proyecto = p.id_proyecto
left join dim_agrupacion_unidad a on un.id_agrupacion = a.id_agrupacion
left join fact_usuarios us on v.created_by = us.usuario collate utf8mb4_unicode_ci
union
select d.id_desistimiento as id_obj, co.id_cliente, 
    concat(coalesce(c.nombres, ''), ' ', coalesce(c.apellido1, ''), ' ', coalesce(c.apellido2, '')) as nombre_cliente, 
    un.id_unidad, coalesce(a.nombre, un.nombre_unidad) as unidad, p.id_proyecto, p.nombre as proyecto,
    date_format(d.created_on, '%Y-%m-%d') as created_on, d.created_by as asesor, us.nombres as nombre_asesor, 'Desistimiento' as obj,
    p.id_sede, p.id_zona_proyecto, p.id_ciudadela
from dim_desistimiento d 
join fact_ventas v on d.id_venta = v.id_venta
left join fact_opcion o on v.id_opcion = o.id_opcion
left join fact_cotizaciones co on o.id_cotizacion = co.id_cotizacion
left join fact_clientes c on co.id_cliente = c.id_cliente
left join fact_negocios_unidades n on co.id_cotizacion = n.id_cotizacion
left join fact_unidades un on n.id_unidad = un.id_unidad
join fact_proyectos p on un.id_proyecto = p.id_proyecto
left join dim_agrupacion_unidad a on un.id_agrupacion = a.id_agrupacion
left join fact_usuarios us on d.created_by = us.usuario collate utf8mb4_unicode_ci
) as res
order by res.created_on desc;

select u.id_usuario, u.nombres, u.usuario, group_concat(ps.id_sala_venta separator ',') as ids_sala_venta
from fact_usuarios u
join fact_roles_usuarios ru on u.id_usuario = ru.id_usuario
left join dim_personal_sala ps on u.id_usuario = ps.id_usuario
where (ru.id_rol = 6 or ru.id_rol = 31) and u.is_active = 1
group by u.id_usuario
order by u.nombres;

select id_sede, sede
from dim_sede
where is_active = 1;

select id_zona_proyecto, zona_proyecto
from dim_zona_proyecto
where is_active = 1;

select id_ciudadela, ciudadela
from dim_ciudadela
where is_active = 1;

select sv.id_sala_venta, sv.sala_venta, sv.id_sede, sv.id_zona_proyecto, sv.id_ciudadela, 
    group_concat(sp.id_proyecto separator ',') as ids_proyectos
from dim_sala_venta sv
left join dim_sala_proyecto sp on sv.id_sala_venta = sp.id_sala_venta
where sv.is_active = 1
group by sv.id_sala_venta
order by sv.sala_venta;

select id_proyecto, nombre as proyecto
from fact_proyectos
order by nombre;