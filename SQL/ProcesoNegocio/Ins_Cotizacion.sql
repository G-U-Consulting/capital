-- =============================================
-- Proceso: ProcesoNegocio/Ins_Cotizacion
-- =============================================
--START_PARAM
set @id_cliente = 0,
    @cotizacion = 0,
    @fecha = '',
    @descripcion = '',
    @result = '',
    @importeTotal = 0,
    @id_proyecto = 0; 
--END_PARAM

insert into fact_cotizaciones (id_cliente, cotizacion, fecha, descripcion, importe, id_proyecto)
values (@id_cliente, @cotizacion, @fecha, @descripcion, @importeTotal, @id_proyecto);

select concat('OK-id_archivo:', last_insert_id(), ' insert') as result;



