-- =============================================
-- Proceso: ProcesoNegocio/Get_Opcion
-- =============================================
--START_PARAM
set @id_cotizacion = '1',
    @id_proyecto = '3',
    @id_cliente = '2';
--END_PARAM

select
    o.id_opcion,
    o.id_cotizacion,
    o.fecha_entrega,
    o.valor_reformas,
    o.valor_acabados,
    o.valor_descuento_adicional,
    o.valor_separacion,
    o.valor_escrituras,
    o.notariales,
    o.beneficiencia,
    o.registro,
    o.pago_contado,
    o.pago_financiado,
    o.id_entidad,
    o.id_tipo,
    o.id_anios,
    o.id_modalidad,
    o.subsidio_activo,
    o.ingresos_familiares,
    o.cesantias,
    o.ahorros,
    o.fin_max_permisible,
    o.cuota_permisible,
    o.cuota_max_financiable,
    o.ingr_regs_max,
    o.anio_entrega,
    o.valor_subsidio,
    o.id_caja_compensacion,
    o.meses,
    o.importe_financiacion,
    o.cuota_inicial,
    o.fecha_primera_cuota,
    o.fecha_ultima_cuota,
    o.fecha_escrituracion,
    o.created_on,
    o.created_by,
    c.id_cliente,
    c.id_proyecto,
    c.cotizacion
from fact_opcion o
join fact_cotizaciones c on o.id_cotizacion = c.id_cotizacion
where o.id_cotizacion = @id_cotizacion
  and c.id_proyecto = @id_proyecto
  and c.id_cliente = @id_cliente
  and c.is_active = 1
order by o.created_on desc
limit 1;
