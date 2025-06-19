-- =============================================
-- Proceso: ProcesoNegocio/Ins_Cotizacion
-- =============================================
--START_PARAM
set @id_cliente = '',
    @cotizacion = '',
    @fecha = '',
    @descripcion = '',
    @importe = '';  
--END_PARAM

insert into fact_cotizaciones (id_cliente, cotizacion, fecha, descripcion, importe)
    values (@id_cliente, @cotizacion, @fecha, @descripcion, @importe);

    select concat('OK-id_archivo:', last_insert_id(), ' ', 'Insert') as result;
