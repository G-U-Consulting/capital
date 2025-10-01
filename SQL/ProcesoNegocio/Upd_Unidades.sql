-- =============================================
-- Proceso: ProcesoNegocio/Upd_Unidades
-- =============================================
--START_PARAM
set @id_cliente = '0',
    @id_proyecto = '3',
    @usuario = 'alejandros',
    @unidad = '414',
    @cotizacion = '4',
    @inv_terminado = '0',
    @tipo = 'TIPO A',
    @torre = '2',
    @observacion_apto = 'TIPO A + BALCÓN TIPO - BALCÓN BARANDA',
    @valor_descuento = '400000',
    @valor_unidad = '28070000',
    @lista = '5',
    @id_unidad = '26324',
    @numero_apartamento = 'Apto 414',
    @consecutivo = '2';
--END_PARAM

update fact_negocios_unidades fnu
set 
    fnu.id_cliente        = @id_cliente,
    fnu.id_proyecto       = @id_proyecto,
    fnu.usuario           = @usuario,
    fnu.unidad            = @unidad,
    fnu.cotizacion        = @cotizacion,
    fnu.consecutivo       = @consecutivo,
    fnu.inv_terminado     = @inv_terminado,
    fnu.tipo              = @tipo,
    fnu.torre             = @torre,
    fnu.observacion_apto  = @observacion_apto,
    fnu.valor_descuento   = @valor_descuento,
    fnu.valor_unidad      = @valor_unidad,
    fnu.lista             = @lista,
    fnu.numero_apartamento= @numero_apartamento
where fnu.id_unidad = @id_unidad;

select concat('ok-id_unidad:', @id_unidad, ' ', 'update') as result;