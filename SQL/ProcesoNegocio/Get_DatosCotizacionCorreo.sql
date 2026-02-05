-- =============================================
-- Proceso: ProcesoNegocio/Get_DatosCotizacionCorreo
-- =============================================
--START_PARAM
set @id_negocios_unidades = 162;
--END_PARAM

select
    co.id_cotizacion,
    p.nombre as proyecto,
    date_format(nu.created_on, '%d/%m/%Y %H:%i') as fecha_cotizacion,
    coalesce(us.nombres, '') as nombre_asesor,
    coalesce(us.email, '') as email_asesor,
    '' as telefono_asesor,
    (select fd.llave from fact_documento_proyecto fdp
     join fact_documentos fd on fdp.id_documento = fd.id_documento
     where fdp.id_proyecto = p.id_proyecto and fdp.tipo = 'logo' and fdp.is_active = 1
     limit 1) as logo_proyecto_llave,
    s.sede,
    concat(coalesce(p.email_receptor_1, ''), ',', coalesce(p.email_receptor_2, ''), ',', 
     coalesce(p.email_receptor_3, ''), ',', coalesce(p.email_receptor_4, '')) as emails_receptores
from fact_negocios_unidades nu
join fact_cotizaciones co on nu.id_cotizacion = co.id_cotizacion
join fact_proyectos p on co.id_proyecto = p.id_proyecto
left join fact_usuarios us on co.created_by = us.usuario collate utf8mb4_general_ci
left join dim_sede s on p.id_sede = s.id_sede
where nu.id_negocios_unidades = @id_negocios_unidades
limit 1;

select
    c.id_cliente,
    concat(coalesce(c.nombres, ''), ' ', coalesce(c.apellido1, ''), ' ', coalesce(c.apellido2, '')) as nombre_cliente,
    c.tipo_documento,
    c.numero_documento,
    coalesce(c.telefono1, c.telefono2) as telefono,
    coalesce(c.email1, c.email2) as email
from fact_negocios_unidades nu
join fact_cotizaciones co on nu.id_cotizacion = co.id_cotizacion
join fact_clientes c on co.id_cliente = c.id_cliente
where nu.id_negocios_unidades = @id_negocios_unidades;

select
    coalesce(ag.nombre, u.nombre_unidad) as nombre_unidad,
    t.nombre_torre as torre,
    coalesce(nu.tipo, '') as tipo_unidad,
    round(coalesce(u.area_privada_cub, 0) + coalesce(u.area_privada_lib, 0), 2) as area_privada,
    round(u.area_total, 2) as area_construida,
    format(coalesce(nu.valor_unidad, pu.precio, 0), 0, 'es_CO') as valor_unidad,
    format(coalesce(nu.valor_descuento, 0), 0, 'es_CO') as valor_descuento,
    format(coalesce(nu.valor_unidad, pu.precio, 0) - coalesce(nu.valor_descuento, 0), 0, 'es_CO') as valor_final
from fact_negocios_unidades nu
join fact_cotizaciones co on nu.id_cotizacion = co.id_cotizacion
join fact_proyectos p on co.id_proyecto = p.id_proyecto
join fact_unidades u on nu.id_unidad = u.id_unidad
join fact_torres t on u.id_torre = t.id_torre
left join dim_agrupacion_unidad ag on u.id_agrupacion = ag.id_agrupacion
left join dim_lista_precios lp on lp.id_lista = coalesce(u.id_lista, p.id_lista)
left join dim_precio_unidad pu on pu.id_lista = coalesce(u.id_lista, p.id_lista) and pu.id_unidad = u.id_unidad
where nu.id_cotizacion = (
    select id_cotizacion from fact_negocios_unidades where id_negocios_unidades = @id_negocios_unidades
)
and nu.is_asignado = 1;
