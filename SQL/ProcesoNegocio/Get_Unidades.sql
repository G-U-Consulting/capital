-- =============================================
-- Proceso: ProcesoNegocio/Get_Unidades
-- =============================================
--START_PARAM
set @id_cliente = '2',
    @id_cotizacion = '4',
    @id_proyecto = '3';
--END_PARAM

select 
    d.consecutivo,
    case when b.inv_terminado = 1 then 'SI' else 'NO' end as inv_terminado,
    b.numero_apartamento,
    a.created_on,
    b.tipo,
    b.observacion_apto,
    c.nombre as proyecto,
    valor_descuento,
    (
        select pu.precio
        from dim_precio_unidad pu
        where pu.id_lista = if(b.id_lista is null, 
            (select p.id_lista 
             from fact_proyectos p 
             where p.id_proyecto = b.id_proyecto), 
            b.id_lista)
          and pu.id_unidad = b.id_unidad
    ) as valor_unidad,
    (
        select l.lista 
        from dim_lista_precios l 
        where l.id_lista = if(b.id_lista is null, 
            (select p.id_lista 
             from fact_proyectos p 
             where p.id_proyecto = b.id_proyecto), 
            b.id_lista)
    ) as lista
from fact_negocios_unidades a
join fact_unidades b on a.id_unidad = b.id_unidad
join fact_proyectos c on a.id_proyecto = c.id_proyecto
join fact_torres d on b.id_torre = d.id_torre
where a.is_active = 1
  and b.is_active = 1
  and a.id_cliente = @id_cliente
  and a.id_cotizacion = @id_cotizacion
  and a.id_proyecto = @id_proyecto;
