-- =============================================
-- Proceso: Proyecto/Get_Proyectos
-- =============================================
--START_PARAM
--END_PARAM

select 
    a.id_proyecto, 
    a.nombre, 
    DATE_FORMAT(a.created_on, '%Y-%m-%d %T') AS created_on, 
    if(a.is_active = true, 1, 0) AS is_active,
    h.zona_proyecto,
    b.ciudadela,
    c.estado_publicacion, 
    d.tipo_proyecto, 
    e.pie_legal, 
    f.fiduciaria,
    g.sede, 
    a.subsidios_vis, 
    a.dias_separacion, 
    a.dias_cierre_sala, 
    a.meses_ci, 
    a.dias_pago_ci_banco_amigo, 
    a.dias_pago_ci_banco_no_amigo, 
    a.email_cotizaciones, 
    a.email_coordinacion_sala,
    a.meta_ventas, 
    a.centro_costos, 
    a.email_receptor_1, 
    a.email_receptor_2, 
    a.email_receptor_3, 
    a.email_receptor_4, 
    a.link_waze, 
    a.latitud, 
    a.otra_info, 
    a.linea_whatsapp, 
    a.id_sede,
    a.id_ciudadela,
    a.direccion, 
    a.lanzamiento, 
    a.ciudad_lanzamiento, 
    a.fecha_lanzamiento, 
    a.bloqueo_libres, 
    a.inmuebles_opcionados, 
    a.tipos_excluidos, 
    a.frame_seguimiento_visible, 
    a.link_seguimiento_leads, 
    a.link_general_onelink, 
    a.frame_evaluacion_conocimiento, 
    a.link_evaluacion_conocimiento, 
    a.link_especifico_onelink, 
    a.avance_obra_visible, 
    a.link_avance_obra, 
    a.incluir_brochure, 
    a.link_brochure, 
    a.incluir_especificaciones_tecnicias, 
    a.link_especificaciones_tecnicias, 
    a.incluir_cartilla_negocios_cotizacion, 
    a.incluir_cartilla_negocios_opcion, 
    a.link_cartilla_negocios,
    a.id_banco_constructor,
    a.id_bancos_financiador,
    a.id_zona_proyecto,
    a.id_lista,
    a.alerta_cambio_lista,
    case when j.tipo_vis = 'No VIS' then 'No VIS' else 'VIS' end as tipo_vis,
    k.edge_estado,
    o.total_torres,
    o.area_total_proyecto,
    o.min_area_privada_cub,
    o.area_total_mas_acue,
    t.fecha_escrituracion_min,
    t.fecha_escrituracion_max,
    v.valor_unidad_min,
    v.valor_unidad_max
from fact_proyectos a
left join dim_ciudadela b on a.id_ciudadela = b.id_ciudadela
left join dim_estado_publicacion c on a.id_estado_publicacion = c.id_estado_publicacion
left join dim_tipo_proyecto d on a.id_tipo_proyecto = d.id_tipo_proyecto
left join dim_pie_legal e on a.id_pie_legal = e.id_pie_legal
left join dim_fiduciaria f on a.id_fiduciaria = f.id_fiduciaria
left join dim_sede g on a.id_sede = g.id_sede   
left join dim_zona_proyecto h on a.id_zona_proyecto = h.id_zona_proyecto
left join dim_tipo_vis j on a.id_tipo_vis = j.id_tipo_vis
left join (
    select 
        id_proyecto,
        case
            when find_in_set('6', group_concat(id_estado_publicacion)) then 'vigente'
            when find_in_set('5', group_concat(id_estado_publicacion)) then 'próxima'
            else 'N/A'
        end as edge_estado
    from fact_estado_publicacion
    where id_estado_publicacion in (5, 6)
    group by id_proyecto
) k on a.id_proyecto = k.id_proyecto
left join (
    select 
        id_proyecto,
        date_format(min(fecha_escrituracion), '%d/%m/%Y') as fecha_escrituracion_min,
        date_format(max(fecha_escrituracion), '%d/%m/%Y') as fecha_escrituracion_max
    from fact_torres
    group by id_proyecto
) t on a.id_proyecto = t.id_proyecto
left join (
    select 
        id_proyecto,
        count(*) as total_torres,
        replace(format(sum(area_total), 2), ',', '.') as area_total_proyecto,
        replace(format(min(area_privada_cub), 2), ',', '.') as min_area_privada_cub,
        replace(format(min(area_total_mas_acue), 2), ',', '.') as area_total_mas_acue
    from fact_unidades
    group by id_proyecto
) o on a.id_proyecto = o.id_proyecto
left join (
    select 
        u.id_proyecto,

        concat(
            '$',
            replace(format(min((
                select pu.precio 
                from dim_precio_unidad pu
                where pu.id_lista = if(u.id_lista is null, 
                    (select p.id_lista from fact_proyectos p where p.id_proyecto = u.id_proyecto), 
                    u.id_lista
                ) 
                and pu.id_unidad = u.id_unidad
            )), 2), ',', '.')
        ) as valor_unidad_min,

        concat(
            '$',
            replace(format(max((
                select pu.precio 
                from dim_precio_unidad pu
                where pu.id_lista = if(u.id_lista is null, 
                    (select p.id_lista from fact_proyectos p where p.id_proyecto = u.id_proyecto), 
                    u.id_lista
                ) 
                and pu.id_unidad = u.id_unidad
            )), 2), ',', '.')
        ) as valor_unidad_max

    from fact_unidades u
    group by u.id_proyecto
) v on a.id_proyecto = v.id_proyecto

