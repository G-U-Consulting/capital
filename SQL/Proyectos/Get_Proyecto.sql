-- =============================================
-- Proceso: Proyecto/Get_Proyecto
-- =============================================
--START_PARAM
set @id_proyecto = '9';
--END_PARAM


select 
    a.id_proyecto,
    a.id_sede,
    a.id_estado_publicacion,
    a.nombre,
    a.id_tipo_proyecto,
    a.id_ciudadela,
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
    a.id_pie_legal,
    a.id_fiduciaria,
    a.email_receptor_1,
    a.email_receptor_2,
    a.email_receptor_3,
    a.email_receptor_4,
    a.id_zona_proyecto,
    a.link_waze,
    a.latitud,
    a.otra_info,
    a.linea_whatsapp,
    a.direccion,
    a.lanzamiento,
    a.ciudad_lanzamiento,
    DATE_FORMAT(a.fecha_lanzamiento, '%Y-%m-%d') as fecha_lanzamiento,
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
    a.is_active,
    a.created_on,
    a.created_by,
    a.id_tipo_financiacion,
    a.id_tipo_vis,
    a.id_banco_constructor,
    a.id_bancos_financiador,
    a.id_lista,
    a.alerta_cambio_lista,
    a.za1_id,
    id_opcion_visual,
    a.descripcion_comercial,
    c.edge_estado,
    (
        select group_concat(id_estado_publicacion)
        from fact_estado_publicacion
        where id_proyecto = a.id_proyecto
    ) as estado_publicacion,
    (
        select group_concat(id_banco_financiador)
        from fact_banco_financiador
        where id_proyecto = a.id_proyecto
    ) as bancos_financiadores,
    (
        select group_concat(id_banco_constructor)
        from fact_banco_constructor
        where id_proyecto = a.id_proyecto
    ) as banco_constructor,
    (
        select group_concat(id_tipo_proyecto)
        from fact_tipo_proyecto
        where id_proyecto = a.id_proyecto
    ) as tipo_proyecto,
    (
        select group_concat(id_sala_venta)
        from fact_sala_venta
        where id_proyecto = a.id_proyecto
    ) as salas_venta,
    (
        select group_concat(id_tipo_financiacion)
        from fact_tipos_financiacion
        where id_proyecto = a.id_proyecto
    ) as tipos_financiacion

from fact_proyectos a
join dim_tipo_proyecto b on a.id_tipo_proyecto = b.id_tipo_proyecto
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
) c on a.id_proyecto = c.id_proyecto
where a.id_proyecto = @id_proyecto;
