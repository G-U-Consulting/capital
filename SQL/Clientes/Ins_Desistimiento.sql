-- =============================================
-- Proceso: Clientes/Ins_Desistimiento
-- =============================================
--START_PARAM
set @id_venta = NULL,
    @ultima_fecha = NULL,
    @radicado = NULL,
    @cant_incumplida = 0,
    @interes = NULL,
    @gasto = NULL,
    @descuento = NULL,
    @id_categoria = NULL,
    @id_fiduciaria = NULL,
    @etapa = NULL,
    @id_penalidad = NULL,
    @observacion = NULL,
    @fecha_resolucion = NULL,
    @Monto = NULL,
    @Porcentaje = NULL,
    @v_venta_neto = NULL,
    @a_capital = NULL,
    @a_intereses = NULL,
    @condonacion = NULL,
    @imp_reformas = NULL,
    @pnl_pcv = NULL,
    @pnl_aplicada_ptg = NULL,
    @fecha_fpc = NULL,
    @fecha_program = NULL,
    @created_by = NULL;
--END_PARAM

insert into dim_desistimiento(
    id_venta, ultima_fecha, cant_incumplida, interes, gasto, descuento, radicado,
    id_categoria, id_fiduciaria, etapa, id_penalidad, observacion, fecha_resolucion, fecha_fpc, fecha_program,
    pnl_monto, pnl_porcentaje, v_venta_neto, a_capital, a_intereses, condonacion, imp_reformas, pnl_pcv, pnl_aplicada_ptg, created_by, updated_by
) values (
    @id_venta, if(@ultima_fecha = '' or @ultima_fecha is null, null, str_to_date(@ultima_fecha, '%d/%m/%Y %T')), 
    @cant_incumplida, @interes, @gasto, @descuento, @radicado, @id_categoria, @id_fiduciaria, @etapa, @id_penalidad, @observacion,
    if(@fecha_resolucion = '', null, @fecha_resolucion),
    if(@fecha_fpc = '', null, @fecha_fpc),
    if(@fecha_program = '', null, @fecha_program),
    @Monto, @Porcentaje, @v_venta_neto, @a_capital, @a_intereses, @condonacion, @imp_reformas, @pnl_pcv, @pnl_aplicada_ptg, @created_by, @created_by
);

select concat('OK-id_desistimiento:', last_insert_id()) as result;