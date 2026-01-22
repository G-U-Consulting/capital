-- =============================================
-- Proceso: ProcesoNegocio/Get_DatosOpcionCorreo
-- =============================================
--START_PARAM
set @id_opcion = 1;
--END_PARAM

select
    o.id_opcion,
    date_format(o.created_on, '%d/%m/%Y') as fecha_opcion,
    p.nombre as proyecto,
    t.nombre_torre as torre,
    coalesce(ag.nombre, u.nombre_unidad) as nombre_unidad,
    coalesce(n.tipo, '') as tipo_unidad,
    round(coalesce(u.area_privada_cub, 0) + coalesce(u.area_privada_lib, 0), 2) as area_privada,
    round(u.area_total, 2) as area_construida,
    format(coalesce(pu.precio, 0), 0, 'es_CO') as valor_total,
    format(o.valor_separacion, 0, 'es_CO') as valor_separacion,
    format(o.cuota_inicial, 0, 'es_CO') as cuota_inicial,
    format(o.importe_financiacion, 0, 'es_CO') as valor_financiar,
    case
        when o.pago_financiado = 1 then 'Financiado'
        when o.pago_contado = 1 then 'Contado'
        else 'No especificado'
    end as forma_pago,
    coalesce(date_format(o.fecha_entrega, '%d/%m/%Y'), 'Por confirmar') as fecha_entrega,
    coalesce(us.nombres, '') as nombre_asesor,
    coalesce(us.email, '') as email_asesor,
    '' as telefono_asesor,
    (select fd.llave from fact_documento_proyecto fdp
     join fact_documentos fd on fdp.id_documento = fd.id_documento
     where fdp.id_proyecto = p.id_proyecto and fdp.tipo = 'logo' and fdp.is_active = 1
     limit 1) as logo_proyecto_llave
from fact_opcion o
join fact_cotizaciones co on o.id_cotizacion = co.id_cotizacion
join fact_proyectos p on co.id_proyecto = p.id_proyecto
join fact_negocios_unidades n on n.id_cotizacion = co.id_cotizacion
join fact_unidades u on n.id_unidad = u.id_unidad
join fact_torres t on u.id_torre = t.id_torre
join fact_usuarios us on o.created_by = us.usuario collate utf8mb4_general_ci
left join dim_agrupacion_unidad ag on u.id_agrupacion = ag.id_agrupacion
left join dim_lista_precios l on l.id_lista = coalesce(u.id_lista, p.id_lista)
left join dim_precio_unidad pu on pu.id_lista = coalesce(u.id_lista, p.id_lista) and pu.id_unidad = u.id_unidad
where o.id_opcion = @id_opcion
limit 1;

select
    c.id_cliente,
    concat(coalesce(c.nombres, ''), ' ', coalesce(c.apellido1, ''), ' ', coalesce(c.apellido2, '')) as nombre_cliente,
    c.tipo_documento,
    c.numero_documento,
    coalesce(c.telefono1, c.telefono2) as telefono,
    coalesce(c.email1, c.email2) as email,
    concat(coalesce(c.direccion, ''), ', ', coalesce(c.ciudad, ''), ', ', coalesce(c.departamento, '')) as direccion,
    coalesce(dco.porcentaje, 100) as porcentaje
from fact_opcion o
join fact_cotizaciones co on o.id_cotizacion = co.id_cotizacion
join fact_clientes c on co.id_cliente = c.id_cliente
left join dim_cuenta_opcion dco on dco.id_opcion = o.id_opcion and dco.id_cliente = c.id_cliente
where o.id_opcion = @id_opcion
union
select
    c.id_cliente,
    concat(coalesce(c.nombres, ''), ' ', coalesce(c.apellido1, ''), ' ', coalesce(c.apellido2, '')) as nombre_cliente,
    c.tipo_documento,
    c.numero_documento,
    coalesce(c.telefono1, c.telefono2) as telefono,
    coalesce(c.email1, c.email2) as email,
    concat(coalesce(c.direccion, ''), ', ', coalesce(c.ciudad, ''), ', ', coalesce(c.departamento, '')) as direccion,
    dco.porcentaje
from dim_cuenta_opcion dco
join fact_clientes c on dco.id_cliente = c.id_cliente
where dco.id_opcion = @id_opcion;

select
    ca.id_cupon,
    coalesce(a.nombre, u.nombre_unidad) as unidad,
    ca.invoice,
    ca.ecollect_url_enviar,
    ca.ecollect_url_descargar
from dim_cupon_avisor ca
join fact_unidades u on ca.id_unidad = u.id_unidad
left join dim_agrupacion_unidad a on u.id_agrupacion = a.id_agrupacion
where ca.id_opcion = @id_opcion;
