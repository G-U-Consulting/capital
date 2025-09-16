-- =============================================
-- Proceso: Clientes/Upd_Desistimiento
-- =============================================
--START_PARAM
set @id_desistimiento = NULL,
    @id_venta = NULL,
    @id_estado = NULL,
    @ultima_fecha = NULL,
    @cant_incumplida = 0,
    @interes = NULL,
    @gasto = NULL,
    @descuento = NULL,
    @id_categoria = NULL,
    @id_fiduciaria = NULL,
    @etapa = NULL,
    @id_penalidad = NULL,
    @observacion = NULL,
    @fecha_resolucion = NULL;
--END_PARAM

update dim_desistimiento
set id_venta = @id_venta,
    id_estado = @id_estado,
    ultima_fecha = str_to_date(@ultima_fecha, '%d/%m/%Y %T'),
    cant_incumplida = @cant_incumplida,
    interes = @interes,
    gasto = @gasto,
    descuento = @descuento,
    id_categoria = @id_categoria,
    id_fiduciaria = @id_fiduciaria,
    etapa = @etapa,
    id_penalidad = @id_penalidad,
    observacion = @observacion,
    fecha_resolucion = if(@fecha_resolucion = '', null, str_to_date(@fecha_resolucion, '%d/%m/%Y %T'))
where id_desistimiento = @id_desistimiento;


select 'OK' as result;