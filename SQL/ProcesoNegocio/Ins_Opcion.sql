-- =============================================
-- Proceso: ProcesoNegocio/Ins_Opcion
-- =============================================
--START_PARAM
set @id_cotizacion = '1',
    @fecha_entrega = '2030-05-17',
    @created_by = 'alejandros',
    @valor_reformas = '0',
    @valor_acabados = '0',
    @valor_descuento_adicional = '0',
    @valor_separacion = '6600000',
    @valor_escrituras = '0',
    @notariales = '0',
    @beneficiencia = '0',
    @registro = '0',
    @pago_contado = '0',
    @pago_financiado = '1',
    @id_entidad = NULL,
    @id_tipo = NULL,
    @id_anios = NULL,
    @id_modalidad = NULL,
    @subsidio_activo = '0',
    @ingresos_familiares = '0',
    @cesantias = '0',
    @ahorros = '0',
    @fin_max_permisible = '0',
    @cuota_permisible = '0',
    @cuota_max_financiable = '0',
    @ingr_regs_max = '0',
    @anio_entrega = NULL,
    @valor_subsidio = '0',
    @id_caja_compensacion = NULL,
    @meses = '0',
    @importe_financiacion = '0',
    @cuota_inicial = '0',
    @fecha_primera_cuota = NULL,
    @fecha_ultima_cuota = NULL,
    @fecha_escrituracion = NULL,
    @id_banco_factor = NULL,
    @id_pie_legal = NULL;
--END_PARAM

insert into fact_opcion (
    id_cotizacion,
    fecha_entrega,
    valor_reformas,
    valor_acabados,
    valor_descuento_adicional,
    valor_separacion,
    valor_escrituras,
    notariales,
    beneficiencia,
    registro,
    pago_contado,
    pago_financiado,
    id_entidad,
    id_tipo,
    id_anios,
    id_modalidad,
    subsidio_activo,
    ingresos_familiares,
    cesantias,
    ahorros,
    fin_max_permisible,
    cuota_permisible,
    cuota_max_financiable,
    ingr_regs_max,
    anio_entrega,
    valor_subsidio,
    id_caja_compensacion,
    meses,
    importe_financiacion,
    cuota_inicial,
    fecha_primera_cuota,
    fecha_ultima_cuota,
    fecha_escrituracion,
    created_by,
    id_banco_factor,
    id_pie_legal
) values (
    @id_cotizacion,
    @fecha_entrega,
    @valor_reformas,
    @valor_acabados,
    @valor_descuento_adicional,
    @valor_separacion,
    @valor_escrituras,
    @notariales,
    @beneficiencia,
    @registro,
    @pago_contado,
    @pago_financiado,
    @id_entidad,
    @id_tipo,
    @id_anios,
    @id_modalidad,
    @subsidio_activo,
    @ingresos_familiares,
    @cesantias,
    @ahorros,
    @fin_max_permisible,
    @cuota_permisible,
    @cuota_max_financiable,
    @ingr_regs_max,
    @anio_entrega,
    @valor_subsidio,
    @id_caja_compensacion,
    @meses,
    @importe_financiacion,
    @cuota_inicial,
    @fecha_primera_cuota,
    @fecha_ultima_cuota,
    @fecha_escrituracion,
    @created_by,
    if(@id_banco_factor = '', null, @id_banco_factor),
    if(@id_pie_legal = '', null, @id_pie_legal)
);

set @id_opcion = last_insert_id();

insert into cola_tareas_rpa(tipo, sub_tipo, datos) 
select 'salesforce', 'CotizacionSF',
    concat('{"id_cotizacion":', @id_cotizacion, ',"id_unidad":', u.id_unidad, ',"quotestate":"Opcionado"}')
from fact_negocios_unidades n
join fact_unidades u on n.id_unidad = u.id_unidad
where n.id_cotizacion = @id_cotizacion and u.id_clase = 8;
    
update fact_unidades u
join fact_negocios_unidades n on n.id_unidad = u.id_unidad
set u.id_estado_unidad = 2, n.is_asignado = 0
where n.id_cotizacion = @id_cotizacion;

insert into dim_cuenta_opcion(id_opcion, id_cliente, porcentaje)
select
    @id_opcion,
    c.id_cliente,
    coalesce(c.porcentaje_copropiedad, 100) as porcentaje
from fact_cotizacion_cliente cc
join fact_clientes c on c.id_cliente = cc.id_cliente
where cc.id_cotizacion = @id_cotizacion;


/*
select distinct p.bloqueo_libres, p.inmuebles_opcionados
into @is_bloq, @num_opc
from fact_proyectos p
join fact_unidades u on p.id_proyecto = u.id_proyecto
join fact_negocios_unidades n on n.id_unidad = u.id_unidad
where n.id_cotizacion = @id_cotizacion;
*/

select concat('ok-id_opcion:', @id_opcion) as result;
