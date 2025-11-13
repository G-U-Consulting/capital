-- =============================================
-- Proceso: Dashboard/View_Unidades
-- =============================================
--START_PARAM
--END_PARAM

create view vw_dash_unidades as
select u.altura, u.numero_apartamento as apartamento, cast(u.area_total as char) as area_total, u.asoleacion, 
    u.cerca_juegos_infantiles, u.cerca_piscina, u.cerca_porteria, tp.tipo_proyecto as clase, u.codigo_planta, 
    e.estado_unidad as estatus, date_format(u.fecha_fec, '%Y-%m-%d') as fecha_fec, date_format(fecha_edi, '%Y-%m-%d') as fecha_edi, 
    l.lista, u.localizacion, u.nombre_unidad, u.num_alcobas, u.num_banos, u.piso, p.nombre as proyecto, u.tiene_acabados, 
    u.tiene_balcon, u.tiene_deposito, u.tiene_parq_doble, u.tiene_parq_sencillo, 
    replace(c.ciudadela, ',', ';') as ciudadela, replace(z.zona_proyecto, ',', ';') as zona, replace(s.sede, ',', ';') as sede,
    t.consecutivo as torre, cast(coalesce(pu.precio, coalesce(pu.precio_alt, u.valor_complemento)) as char) as valor_unidad
from fact_unidades u
join fact_torres t on u.id_torre = t.id_torre
join fact_proyectos p on u.id_proyecto = p.id_proyecto
join dim_tipo_proyecto tp on u.id_clase = tp.id_tipo_proyecto
left join dim_estado_unidad e on u.id_estado_unidad = e.id_estado_unidad
left join dim_lista_precios l on u.id_lista = l.id_lista
left join dim_precio_unidad pu on l.id_lista = pu.id_lista and u.id_unidad = pu.id_unidad
left join dim_ciudadela c on p.id_ciudadela = c.id_ciudadela
left join dim_zona_proyecto z on p.id_zona_proyecto = z.id_zona_proyecto
left join dim_sede s on p.id_sede = s.id_sede
order by p.nombre, t.consecutivo, tp.tipo_proyecto, cast(u.numero_apartamento as unsigned);
