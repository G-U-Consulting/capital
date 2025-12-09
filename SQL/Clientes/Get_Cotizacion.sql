-- =============================================
-- Proceso: Clientes/Get_Cotizacion
-- =============================================
--START_PARAM
set @id_cotizacion = 537;
--END_PARAM

select co.cotizacion, co.descripcion, cl.tipo_documento, cl.numero_documento, p.nombre as proyecto,
    concat(coalesce(cl.nombres, ''), ' ', coalesce(cl.apellido1, ''), ' ', coalesce(cl.apellido2, '')) as nombre,
    if(cl.telefono1 is not null and cl.telefono1 != '', cl.telefono1, cl.telefono2) as telefono, 
    if(cl.telefono1 is not null and cl.telefono1 != '', cl.codigo_tel1, cl.codigo_tel2) as codigo_tel,
    coalesce(cl.email1, cl.email2) as email, u.nombres as asesor, date_format(co.created_on, '%Y-%m-%d %T') as fecha
from fact_cotizaciones co
join fact_clientes cl on co.id_cliente = cl.id_cliente
join fact_proyectos p on co.id_proyecto = p.id_proyecto
join fact_usuarios u on co.created_by = u.usuario collate utf8mb4_unicode_ci
where id_cotizacion = @id_cotizacion;

select
  date_format(u.fecha_fec, '%Y-%m-%d') as fecha_fec,
  date_format(u.fecha_edi, '%Y-%m-%d') as fecha_edi,
  date_format(u.fecha_edi_mostrar, '%Y-%m-%d') as fecha_edi_mostrar,
  pu.precio as valor_unidad,
  l.lista as lista,
  u.id_unidad, u.id_agrupacion, u.valor_descuento, u.codigo_planta, u.localizacion, u.inv_terminado, 
  u.area_privada_cub, u.area_total, u.asoleacion, u.observacion_apto, u.nombre_unidad,
  c.*,
  e.estado_unidad as estatus,
  u.numero_apartamento as apartamento,
  d.id_cliente as id_cliente,
  date_format(d.created_on, '%Y-%m-%d %T') as fecha,
  at.nombre as agrupacion_nombre,
  at.descripcion as agrupacion_descripcion,
  at.total as agrupacion_total,
  tp.id_tipo_proyecto,
  t.consecutivo as torre,
  p.id_proyecto
from fact_unidades u
left join fact_proyectos p on p.id_proyecto = u.id_proyecto
left join dim_lista_precios l on l.id_lista = COALESCE(u.id_lista, p.id_lista)
left join dim_precio_unidad pu on pu.id_lista = COALESCE(u.id_lista, p.id_lista) and pu.id_unidad = u.id_unidad
left join dim_estado_unidad e on u.id_estado_unidad = e.id_estado_unidad
left join dim_cuenta_convenio c on u.id_cuenta_convenio = c.id_cuenta_convenio
left join fact_negocios_unidades d on u.id_unidad = d.id_unidad
left join dim_tipo_proyecto tp on u.id_clase = tp.id_tipo_proyecto
left join fact_torres t on t.id_torre = u.id_torre
left join (
    select
        a.id_agrupacion,
        a.nombre,   
        a.descripcion,
        a.id_proyecto,
        COALESCE(SUM(
            case when u2.id_clase = 8 then pu2.precio else u2.valor_complemento end
        ), 0) as total
    from dim_agrupacion_unidad a
    left join fact_unidades u2 on a.id_agrupacion = u2.id_agrupacion
    left join fact_proyectos p2 on p2.id_proyecto = u2.id_proyecto
    left join dim_precio_unidad pu2 on pu2.id_lista = COALESCE(u2.id_lista, p2.id_lista) and pu2.id_unidad = u2.id_unidad
    group by a.id_agrupacion, a.nombre, a.descripcion, a.id_proyecto
) as at on u.id_agrupacion = at.id_agrupacion
where d.id_cotizacion = @id_cotizacion
order by u.numero_apartamento;