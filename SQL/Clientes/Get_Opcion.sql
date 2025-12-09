-- =============================================
-- Proceso: Clientes/Get_Opcion
-- =============================================
--START_PARAM
set @id_opcion = 77;
--END_PARAM

select sum(coalesce(p.precio, 0) - coalesce(u.valor_descuento, 0)) into @importe_original
from fact_negocios_unidades nu
join fact_opcion o on nu.id_cotizacion = o.id_cotizacion
join fact_unidades u on nu.id_unidad = u.id_unidad
join dim_precio_unidad p on p.id_lista = u.id_lista and p.id_unidad = u.id_unidad
where o.id_opcion = @id_opcion;

select distinct cast(@importe_original as char) as `importeOriginal`, 
    cast(o.valor_acabados as char) as `f_valor_acabados`, 
    cast(o.valor_reformas as char) as `reformaActivo`,
    cast(o.valor_descuento_adicional as char) as `f_valor_descuento_adicional`, 
    cast((@importe_original - o.valor_descuento_adicional) as char) as `importeActiva`,
    tf.tipo_financiacion as `tipoFinanciacionSeleccionada`, 
    id_anios as `anioSeleccionado`, 
    cast(0 as char) as `f_factorBanco`, -- cual es el factor?
    cast(0 as char) as `excedentePagoCuotaInicial`, -- como se calcula?
    cast(0 as char) as `valor_credito_final_base`, -- como se calcula?
    cast(0 as char) as `importeFinanciacionAjustado`, -- como se calcula?
    cast((@importe_original - o.valor_descuento_adicional) * 0.7 as char) as `valor_credito_base`, -- no coincide
    cast(o.ingr_regs_max * 0.4 as char) as `valorCreditoMillonFormateado`, -- se calcula factorBanco*valor_credito_base/1000000
    cast(o.ingresos_familiares as char) as `f_ingresos_mensuales`,
    cast(o.ingresos_familiares * 0.4 as char) as `cuotaMaxima`,
    cast(o.ingr_regs_max as char) as `minimoFamiliar`, -- se calcula valorCreditoMillonFormateado/0.4
    cast(o.importe_financiacion as char) as `valor_maxfinanciable`,
    cast(o.valor_separacion as char) as `f_valor_separacion`,
    cast(o.valor_escrituras as char) as `f_valor_escrituras`,
    cast(o.notariales as char) as `f_valor_notariales`, -- no se guarda en la opcion
    cast(o.beneficiencia as char) as `f_valor_beneficiencia`, -- no se guarda en la opcion
    cast(o.registro as char) as `f_valor_registro`, -- no se guarda en la opcion
    cast(o.valor_subsidio as char) as `valor_subsidio`,
    cast(o.cesantias as char) as `f_valor_cesantias`,
    cast(o.ahorros as char) as `f_valor_ahorros`,
    date_format(o.fecha_entrega, '%Y-%m-%d') as `display_fecha_entrega`,
    date_format(o.fecha_escrituracion, '%Y-%m-%d') as `display_fecha_escrituracion`,
    date_format(o.fecha_primera_cuota, '%Y-%m-%d') as `display_fecha_primera_cuota`,
    date_format(o.fecha_ultima_cuota, '%Y-%m-%d') as `display_fecha_ultima_cuota`,
    o.meses as `d_meses`
from fact_negocios_unidades nu
join fact_opcion o on nu.id_cotizacion = o.id_cotizacion
join fact_unidades u on nu.id_unidad = u.id_unidad
join dim_precio_unidad p on p.id_lista = u.id_lista and p.id_unidad = u.id_unidad
join dim_tipo_financiacion tf on o.id_modalidad = tf.id_tipo_financiacion
where o.id_opcion = @id_opcion;