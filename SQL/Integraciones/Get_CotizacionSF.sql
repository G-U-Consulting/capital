-- =============================================
-- Proceso: Integraciones/Get_CotizacionSF
-- =============================================
--START_PARAM
set @id_cotizacion = 407,
    @id_unidad = 152642,
    @quotestate = NULL;
--END_PARAM
set @state = coalesce(@quotestate, 'Cotizado');
select 
    if(@state = 'Cotizado', NULL, date_format(o.created_on, '%Y-%m-%d')),
    if(@state = 'Cotizado' or @state = 'Opcionado' or @state = 'Consignado', NULL, 
        date_format(v.created_on, '%Y-%m-%d')),
    if(@state != 'Desistimiento', NULL, date_format(d.updated_on, '%Y-%m-%d')),
    if(@state != 'Desistimiento', NULL, cd.categoria)
into @optiondate, @closedate, @dismissdate, @dismisscause
from fact_unidades u
join dim_estado_unidad e on u.id_estado_unidad = e.id_estado_unidad
left join fact_negocios_unidades n on n.id_unidad = @id_unidad
left join dim_desistimiento d on u.id_unidad = d.id_unidad and d.id_estado = 5
left join fact_ventas v on (d.id_venta is not null and d.id_venta = v.id_venta) or 
    ((select o2.id_opcion from fact_opcion o2 where o2.id_cotizacion = n.id_cotizacion) = v.id_opcion)
left join fact_opcion o on (v.id_opcion is not null and v.id_opcion = o.id_opcion) or 
    (n.id_cotizacion = o.id_cotizacion)
left join dim_categoria_desistimiento cd on d.id_categoria = cd.id_categoria
where u.id_unidad = @id_unidad
order by coalesce(d.fec_com_gerencia, 0) desc, v.created_on desc, o.created_on desc limit 1;

select @state as `quoteState`, u.za1_id as `apartmentZAId`, u.salesforce_id as `apartmentSLId`, u.nombre_unidad as `apartment`, 
    t.consecutivo as `tower`, cast(u.area_total as char) as `areas`, a.nombre as `agrupation`, date_format(u.fecha_edi, '%Y-%m-%d') as `deliveryDate`, 
    u.localizacion as `view`, round(coalesce(pu.precio, 0)) as `_grossPrice`,
    round(coalesce(pu.precio, 0) + coalesce(u.valor_reformas, 0) + coalesce(u.valor_acabados, 0)) as `_netPrice`, 
    cast(if(u.valor_descuento = 0, null, u.valor_descuento) as char) as `_discount`, 
    round(if(pu.precio_m2 is not null and pu.precio_m2 != 0, pu.precio_m2, coalesce(pu.precio, 0) / u.area_total)) as `_m2Value`, 
    l.lista as `listPrice`, b.banco as `financialBank`, date_format(@optiondate, '%Y-%m-%d') as `optionDate`, 
    date_format(co.created_on, '%Y-%m-%d') as `vinculationDate`, f.fiduciaria as `trusteeship`,
    date_format(@closedate, '%Y-%m-%d') as `closeDate`, date_format(@dismissdate, '%Y-%m-%d') as `dismissDate`,
    @dismisscause as `dismissCause`, p.za1_id as `projectId`, cl.salesforce_id as `clientSalesforceId`, u.id_unidad, n.id_negocios_unidades
from fact_cotizaciones co
left join fact_negocios_unidades n on co.id_cotizacion = n.id_cotizacion
left join fact_unidades u on n.id_unidad = u.id_unidad
left join fact_torres t on u.id_torre = t.id_torre
left join fact_proyectos p on u.id_proyecto = p.id_proyecto
left join dim_agrupacion_unidad a on u.id_agrupacion = a.id_agrupacion
left join fact_clientes cl on co.id_cliente = cl.id_cliente
left join dim_lista_precios l on u.id_lista = l.id_lista
left join dim_banco_constructor b on t.id_banco_constructor = b.id_banco
left join dim_fiduciaria f on t.id_fiduciaria = f.id_fiduciaria
left join dim_precio_unidad pu on u.id_unidad = pu.id_unidad and l.id_lista = pu.id_lista
where co.id_cotizacion = @id_cotizacion and u.id_unidad = @id_unidad;
/* 
select * from fact_unidades where id_unidad = 91032;
select * from fact_cotizaciones where id_cotizacion = 336;
 */