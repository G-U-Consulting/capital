-- =============================================
-- Proceso: ProcesoNegocio/Ins_Cotizacion
-- =============================================
--START_PARAM
set @id_cliente = 0,
    @cotizacion = 0,
    @fecha = '',
    @descripcion = '',
    @importeTotal = 0,
    @usuario = '',
    @id_proyecto = 0; 
--END_PARAM

insert into fact_cotizaciones (id_cliente, fecha, descripcion, cotizacion, importe, id_proyecto, created_by)
select @id_cliente, now(), @descripcion, @cotizacion, @importeTotal, @id_proyecto, @usuario
where row_count() = 0;
set @inserted = last_insert_id();
insert into cola_tareas_rpa(tipo, llave) 
values('fact_cotizaciones', @inserted);

select concat('OK-id_cotizacion:', @inserted) as id_cotizacion;
