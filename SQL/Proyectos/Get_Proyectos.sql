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
    DATE_FORMAT(a.fecha_asignacion_sala, '%Y-%m-%d %T') AS fecha_asignacion_sala, 
    a.id_sala_venta,
    i.sala_venta,
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
    a.id_zona_proyecto
from fact_proyectos a
left join dim_ciudadela b on a.id_ciudadela = b.id_ciudadela
left join dim_estado_publicacion c on a.id_estado_publicacion = c.id_estado_publicacion
left join dim_tipo_proyecto d on a.id_tipo_proyecto = d.id_tipo_proyecto
left join dim_pie_legal e on a.id_pie_legal = e.id_pie_legal
left join dim_fiduciaria f on a.id_fiduciaria = f.id_fiduciaria
left join dim_sede g on a.id_sede = g.id_sede   
left join dim_zona_proyecto h on a.id_zona_proyecto = h.id_zona_proyecto
left join dim_sala_venta i on a.id_sala_venta = i.id_sala_venta;
