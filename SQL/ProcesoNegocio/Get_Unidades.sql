-- =============================================
-- Proceso: ProcesoNegocio/Get_Unidades
-- =============================================
--START_PARAM
set @id_proyecto = 3;

--END_PARAM
select id_torre, id_proyecto, consecutivo, orden_salida, en_venta, aptos_piso, aptos_fila, id_sinco, 
    date_format(fecha_p_equ,'%Y-%m-%d') as fecha_p_equ, date_format(fecha_inicio_obra,'%Y-%m-%d') as fecha_inicio_obra, 
    date_format(fecha_escrituracion,'%Y-%m-%d') as fecha_escrituracion, tasa_base, antes_p_equ, despues_p_equ, 
    id_fiduciaria, cod_proyecto_fid, nit_fid_doc_cliente, id_instructivo, propuesta_pago, consecutivo as idtorre, banco
from fact_torres a 
 left join dim_banco_constructor b on a.id_banco_constructor = b.id_banco
where id_proyecto = @id_proyecto;

select
  date_format(u.fecha_fec, '%Y-%m-%d %T') as fecha_fec,
  date_format(u.fecha_edi, '%Y-%m-%d %T') as fecha_edi,
  date_format(u.fecha_edi_mostrar, '%Y-%m-%d %T') as fecha_edi_mostrar,
  pu.precio as valor_unidad,
  l.lista as lista,
  u.*,
  c.*,
  e.estado_unidad as estatus,
  u.numero_apartamento as apartamento,
  (d.id_unidad is not null) as asignado,
  d.id_cliente as id_cliente,
  at.nombre as agrupacion_nombre,
  at.descripcion as agrupacion_descripcion,
  at.total as agrupacion_total,
  f.id_tipo_proyecto,
  t.fecha_escrituracion
from fact_unidades u
left join fact_proyectos p on p.id_proyecto = u.id_proyecto
left join dim_lista_precios l on l.id_lista = COALESCE(u.id_lista, p.id_lista)
left join dim_precio_unidad pu on pu.id_lista = COALESCE(u.id_lista, p.id_lista) and pu.id_unidad = u.id_unidad
left join dim_estado_unidad e on u.id_estado_unidad = e.id_estado_unidad
left join dim_cuenta_convenio c on u.id_cuenta_convenio = c.id_cuenta_convenio
left join fact_negocios_unidades d on u.id_unidad = d.id_unidad
left join dim_tipo_proyecto f on f.tipo_proyecto in (u.clase, concat(u.clase, 's'))
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
    where a.id_proyecto = @id_proyecto
    group by a.id_agrupacion, a.nombre, a.descripcion, a.id_proyecto
) as at on u.id_agrupacion = at.id_agrupacion
where u.id_proyecto = @id_proyecto
order by u.numero_apartamento;


select id_estado_unidad, estado_unidad, estado_unidad_plural, color_fondo, color_fuente
from dim_estado_unidad
where is_active = 1;

select id_fiduciaria, fiduciaria 
from dim_fiduciaria
where is_active = 1;

select id_instructivo, instructivo
from dim_instructivo
where is_active = 1;

select tp.id_tipo_proyecto as id_clase, tp.tipo_proyecto as clase
from fact_unidades u 
join dim_tipo_proyecto tp on u.id_clase = tp.id_tipo_proyecto
where u.id_proyecto = @id_proyecto
group by tp.id_tipo_proyecto;

select b.id_tipo_financiacion , tipo_financiacion
from fact_tipos_financiacion a
join dim_tipo_financiacion b on a.id_tipo_financiacion = b.id_tipo_financiacion
where id_proyecto = @id_proyecto;

select meses_ci
from fact_proyectos
where id_proyecto = @id_proyecto;