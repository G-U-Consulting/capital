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

select distinct round(@importe_original) as `importeOriginal`, 
    round(o.valor_acabados) as `f_valor_acabados`, 
    round(o.valor_reformas) as `reformaActivo`,
    round(o.valor_descuento_adicional) as `f_valor_descuento_adicional`, 
    round((@importe_original - o.valor_descuento_adicional)) as `importeActiva`,
    tf.tipo_financiacion as `tipoFinanciacionSeleccionada`, 
    id_anios as `anioSeleccionado`, 
    coalesce(bf.valor, 0) as `f_factorBanco`,
    round((@importe_original - o.valor_descuento_adicional) * tf.porcentaje / 100) as `valor_credito_base`,
    round(o.ingr_regs_max * 0.4) as `valorCreditoMillonFormateado`,
    round(o.ingresos_familiares) as `f_ingresos_mensuales`,
    round(o.ingresos_familiares * 0.4) as `cuotaMaxima`,
    round(o.ingr_regs_max) as `minimoFamiliar`,
    round(o.importe_financiacion) as `valor_maxfinanciable`,
    round(o.valor_separacion) as `f_valor_separacion`,
    round(o.valor_escrituras) as `f_valor_escrituras`,
    round(o.notariales) as `f_valor_notariales`,
    round(o.beneficiencia) as `f_valor_beneficiencia`,
    round(o.registro) as `f_valor_registro`,
    round(o.valor_subsidio) as `valor_subsidio`,
    round(o.cesantias) as `f_valor_cesantias`,
    round(o.ahorros) as `f_valor_ahorros`,
    date_format(o.fecha_entrega, '%Y-%m-%d') as `display_fecha_entrega`,
    date_format(o.fecha_escrituracion, '%Y-%m-%d') as `display_fecha_escrituracion`,
    date_format(o.fecha_primera_cuota, '%Y-%m-%d') as `display_fecha_primera_cuota`,
    date_format(o.fecha_ultima_cuota, '%Y-%m-%d') as `display_fecha_ultima_cuota`,
    o.meses as `d_meses`,
    round(o.cuota_inicial) as `cuota_inicial`,
    tf.porcentaje as `porcentajeFinanciacion`,
    date_format(t.fecha_p_equ, '%Y-%m-%d') as `fechaPE`,
    cast(t.antes_p_equ as char) as `tna_antes`,
    cast(t.despues_p_equ as char) as `tna_despues`,
    o.pago_financiado
from fact_negocios_unidades nu
join fact_opcion o on nu.id_cotizacion = o.id_cotizacion
join fact_unidades u on nu.id_unidad = u.id_unidad
join dim_precio_unidad p on p.id_lista = u.id_lista and p.id_unidad = u.id_unidad
join dim_tipo_financiacion tf on o.id_modalidad = tf.id_tipo_financiacion
join fact_torres t on u.id_torre = t.id_torre
left join dim_banco_factor bf on o.id_banco_factor = bf.id_banco_factor
where o.id_opcion = @id_opcion
limit 1;