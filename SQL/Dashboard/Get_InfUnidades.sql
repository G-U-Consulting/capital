-- =============================================
-- Proceso: Dashboard/Get_InfUnidades
-- =============================================
--START_PARAM
set @id_proyecto = NULL;
--END_PARAM

select u.altura, u.numero_apartamento as apartamento, cast(u.area_total as char) as area_total, u.asoleacion, 
    u.cerca_juegos_infantiles, u.cerca_piscina, u.cerca_porteria, tp.tipo_proyecto as clase, u.codigo_planta, 
    e.estado_unidad as estatus, date_format(u.fecha_fec, '%Y-%m-%d') as fecha_fec, date_format(fecha_edi, '%Y-%m-%d') as fecha_edi, 
    l.lista, u.localizacion, u.nombre_unidad, u.num_alcobas, u.num_banos, u.piso, p.nombre as proyecto, 
    u.tiene_acabados, u.tiene_balcon, u.tiene_deposito, u.tiene_parq_doble, u.tiene_parq_sencillo,
    t.consecutivo as torre, cast(coalesce(pu.precio, coalesce(pu.precio_alt, u.valor_complemento)) as char) as valor_unidad
from fact_unidades u
join fact_torres t on u.id_torre = t.id_torre
join fact_proyectos p on u.id_proyecto = p.id_proyecto
join dim_tipo_proyecto tp on u.id_clase = tp.id_tipo_proyecto
left join dim_estado_unidad e on u.id_estado_unidad = e.id_estado_unidad
left join dim_lista_precios l on u.id_lista = l.id_lista
left join dim_precio_unidad pu on l.id_lista = pu.id_lista and u.id_unidad = pu.id_unidad
where @id_proyecto is null or u.id_proyecto = @id_proyecto limit 10000;
