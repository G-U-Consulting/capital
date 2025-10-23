-- =============================================
-- Proceso: Unidades/Get_Unidades
-- =============================================
--START_PARAM
set @id_proyecto = NULL;

--END_PARAM
select id_torre, id_proyecto, consecutivo, orden_salida, en_venta, aptos_piso, aptos_fila, id_sinco, 
    date_format(fecha_p_equ,'%Y-%m-%d') as fecha_p_equ, date_format(fecha_inicio_obra,'%Y-%m-%d') as fecha_inicio_obra, 
    date_format(fecha_escrituracion,'%Y-%m-%d') as fecha_escrituracion, tasa_base, antes_p_equ, despues_p_equ, 
    id_fiduciaria, cod_proyecto_fid, nit_fid_doc_cliente, id_instructivo, propuesta_pago, consecutivo as idtorre
from fact_torres
where id_proyecto = @id_proyecto;

select date_format(u.fecha_fec, '%Y-%m-%d %T') as fecha_fec, 
    date_format(u.fecha_edi, '%Y-%m-%d %T') as fecha_edi, 
    date_format(u.fecha_edi_mostrar, '%Y-%m-%d %T') as fecha_edi_mostrar, 
    (select pu.precio from dim_precio_unidad pu
        where pu.id_lista = if(u.id_lista is null, 
        (select p.id_lista from fact_proyectos p where p.id_proyecto = u.id_proyecto), u.id_lista) and pu.id_unidad = u.id_unidad
    ) as valor_unidad,
    (select l.lista from dim_lista_precios l where l.id_lista = if(u.id_lista is null, 
        (select p.id_lista from fact_proyectos p where p.id_proyecto = u.id_proyecto), u.id_lista)
    ) as lista,
    tp.tipo_proyecto as clase,
    u.*, c.*, e.estado_unidad as estatus, u.numero_apartamento as apartamento, a.nombre as agrupacion
from fact_unidades u 
left join dim_estado_unidad e on u.id_estado_unidad = e.id_estado_unidad
left join dim_cuenta_convenio c on u.id_cuenta_convenio = c.id_cuenta_convenio
left join dim_tipo_proyecto tp on u.id_clase = tp.id_tipo_proyecto
left join dim_agrupacion_unidad a on u.id_agrupacion = a.id_agrupacion
where u.id_proyecto = @id_proyecto
order by cast(u.numero_apartamento as unsigned), u.numero_apartamento;

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

/*
select * from dim_agrupacion_unidad;
select * from fact_unidades where id_proyecto = 2 limit 2000;
select * from tmp_agrupaciones;
update fact_unidades set id_agrupacion = null where id_proyecto=2;
delete from dim_hito_cargo where id_hito in (select h.id_hito from fact_unidades u 
    join dim_hito_sala h on u.id_torre = h.id_torre where u.id_proyecto = 2 group by h.id_hito);
delete from dim_hito_sala where id_torre in (select id_torre from fact_torres where id_proyecto = 2);
delete from dim_agrupacion_unidad where id_proyecto=2;
delete from dim_lista_tipo_torre where id_torre in (select id_torre from fact_torres where id_proyecto = 2);
delete from dim_precio_unidad where id_unidad in (select id_unidad from fact_unidades where id_proyecto = 2);
delete from dim_log_unidades where id_unidad in (select id_unidad from fact_unidades where id_proyecto = 2);
delete from dim_cuenta_desistimiento where id_desistimiento in (
    select d.id_desistimiento from dim_desistimiento d join fact_ventas v on d.id_venta = v.id_venta
     join fact_unidades u on v.id_unidad = u.id_unidad where id_proyecto = 2
);
delete from dim_desistimiento
   where id_venta in (select v.id_venta from fact_ventas v join fact_unidades u on v.id_unidad = u.id_unidad where id_proyecto = 2);
delete from dim_venta_cliente
   where id_venta in (select v.id_venta from fact_ventas v join fact_unidades u on v.id_unidad = u.id_unidad where id_proyecto = 2);
delete from fact_ventas where id_unidad in (select id_unidad from fact_unidades where id_proyecto = 2);
delete from fact_lista_espera where id_unidad in (select id_unidad from fact_unidades where id_proyecto = 2);
delete from fact_unidades where id_proyecto = 2;
delete from fact_torres where id_proyecto = 2;
update fact_proyectos set id_lista = null where id_proyecto = 2;
delete from dim_lista_precios where id_proyecto=2;
*/