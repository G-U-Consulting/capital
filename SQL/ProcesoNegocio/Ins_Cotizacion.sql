-- =============================================
-- Proceso: ProcesoNegocio/Ins_Cotizacion
-- =============================================
--START_PARAM
set @id_cliente = 0,
    @cotizacion = 0,
    @id_cotizacion = 0,
    @fecha = '',
    @descripcion = '',
    @importeTotal = 0,
    @id_proyecto = 0; 
--END_PARAM

-- intentar actualizar
update fact_cotizaciones
set fecha = @fecha,
    descripcion = @descripcion,
    importe = @importeTotal,
    id_cliente = @id_cliente,
    id_proyecto = @id_proyecto,
    cotizacion = @cotizacion
where id_cotizacion = @id_cotizacion;

-- si no existía, insertar
insert into fact_cotizaciones (id_cliente, fecha, descripcion, cotizacion, importe, id_proyecto)
select @id_cliente, now(), @descripcion, @cotizacion, @importeTotal, @id_proyecto
where row_count() = 0;

-- devolver siempre el id correcto como número
select if(row_count() > 0, last_insert_id(), @id_cotizacion) + 0 as id_cotizacion;
