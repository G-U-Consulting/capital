-- =============================================
-- Proceso: Clientes/Get_Trazabilidad
-- =============================================
--START_PARAM

--END_PARAM

select * from (
select id_visita as id_obj, v.id_cliente, 
    concat(coalesce(c.nombres, ''), ' ', coalesce(c.apellido1, ''), ' ', coalesce(c.apellido2, '')) as nombre_cliente, 
    null as id_unidad, null as unidad,
    date_format(v.created_on, '%Y-%m-%d') as created_on, v.created_by as asesor, us.nombres as nombre_asesor, 'Visita' as obj 
from fact_visitas v 
join fact_clientes c on v.id_cliente = c.id_cliente
left join fact_usuarios us on v.created_by = us.usuario collate utf8mb4_unicode_ci
union
select id_venta as id_obj, v.id_cliente, 
    concat(coalesce(c.nombres, ''), ' ', coalesce(c.apellido1, ''), ' ', coalesce(c.apellido2, '')) as nombre_cliente, 
    un.id_unidad, coalesce(a.nombre, un.nombre_unidad) as unidad,
    date_format(v.created_on, '%Y-%m-%d') as created_on, v.created_by as asesor, us.nombres as nombre_asesor, 'Venta' as obj 
from fact_ventas v 
join fact_clientes c on v.id_cliente = c.id_cliente
join fact_unidades un on v.id_unidad = un.id_unidad
left join dim_agrupacion_unidad a on un.id_agrupacion = a.id_agrupacion
left join fact_usuarios us on v.created_by = us.usuario collate utf8mb4_unicode_ci
union
select d.id_desistimiento as id_obj, v.id_cliente, 
    concat(coalesce(c.nombres, ''), ' ', coalesce(c.apellido1, ''), ' ', coalesce(c.apellido2, '')) as nombre_cliente, 
    un.id_unidad, coalesce(a.nombre, un.nombre_unidad) as unidad,
    date_format(d.created_on, '%Y-%m-%d') as created_on, d.created_by as asesor, us.nombres as nombre_asesor, 'Desistimiento' as obj
from dim_desistimiento d 
join fact_ventas v on d.id_venta = v.id_venta
join fact_clientes c on v.id_cliente = c.id_cliente
join fact_unidades un on v.id_unidad = un.id_unidad
left join dim_agrupacion_unidad a on un.id_agrupacion = a.id_agrupacion
left join fact_usuarios us on d.created_by = us.usuario collate utf8mb4_unicode_ci
) as res
order by res.created_on desc;

select u.id_usuario, u.nombres, u.usuario
from fact_usuarios u
join fact_roles_usuarios ru on u.id_usuario = ru.id_usuario
where (ru.id_rol = 6 or ru.id_rol = 31) and u.is_active = 1;

/* select * from fact_cotizaciones;
select * from fact_negocios_unidades; */