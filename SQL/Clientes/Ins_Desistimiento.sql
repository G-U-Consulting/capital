-- =============================================
-- Proceso: Clientes/Ins_Desistimiento
-- =============================================
--START_PARAM
set @id_venta = NULL,
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

insert into dim_desistimiento(
    id_venta, ultima_fecha, cant_incumplida, interes, gasto, descuento,
    id_categoria, id_fiduciaria, etapa, id_penalidad, observacion, fecha_resolucion
) values (
    @id_venta, str_to_date(@ultima_fecha, '%d/%m/%Y %T'), @cant_incumplida, @interes, @gasto, @descuento,
    @id_categoria, @id_fiduciaria, @etapa, @id_penalidad, @observacion,
    if(@fecha_resolucion = '', null, str_to_date(@fecha_resolucion, '%d/%m/%Y %T'))
);

select concat('OK-id_desistimiento:', last_insert_id()) as result;