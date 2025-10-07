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
    @usuario = '',
    @id_proyecto = 0; 
--END_PARAM

if exists (
    select 1
    from fact_cotizaciones fc
    where fc.id_cliente = @id_cliente
      and fc.id_proyecto = @id_proyecto
      and date(fc.fecha) = curdate()
) then
    select -1 as id_cotizacion;
else
    update fact_cotizaciones
    set descripcion = @descripcion,
        importe = @importeTotal
    where id_cotizacion = @id_cotizacion;

    insert into fact_cotizaciones (id_cliente, fecha, descripcion, cotizacion, importe, id_proyecto, created_by)
    select @id_cliente, now(), @descripcion, @cotizacion, @importeTotal, @id_proyecto, @usuario
    where row_count() = 0;

    select if(row_count() > 0, last_insert_id(), @id_cotizacion) + 0 as id_cotizacion;
end if;
