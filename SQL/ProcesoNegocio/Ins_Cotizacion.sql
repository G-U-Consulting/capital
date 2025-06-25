-- =============================================
-- Proceso: ProcesoNegocio/Ins_Cotizacion
-- =============================================
--START_PARAM
set @id_cliente = 0,
    @cotizacion = 0,
    @fecha = '',
    @descripcion = '',
    @result = '',
    @importe = 0; 
--END_PARAM

if exists (select 1 from fact_cotizaciones where cotizacion = @cotizacion and id_cliente = @id_cliente) then
    update fact_cotizaciones
    set descripcion = @descripcion
    where cotizacion = @cotizacion;
    select concat('ok-id_archivo:', last_insert_id(), ' ', 'update') as result;
else
    insert into fact_cotizaciones (id_cliente, cotizacion, fecha, descripcion, importe)
    values (@id_cliente, @cotizacion, @fecha, @descripcion, @importe);
    select concat('ok-id_archivo:', last_insert_id(), ' ', 'insert') as result;
end if;


