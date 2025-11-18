-- =============================================
-- Proceso: ProcesoNegocio/Ins_Cotizacion_Cliente
-- =============================================
--START_PARAM
set @id_cliente = 0,
    @id_cotizacion = 0; 
--END_PARAM

    insert into fact_cotizacion_cliente (id_cliente, id_cotizacion)
    select @id_cliente, @id_cotizacion
    where row_count() = 0;

    select if(row_count() > 0, last_insert_id(), @id_cotizacion) + 0 as id_cotizacion;

