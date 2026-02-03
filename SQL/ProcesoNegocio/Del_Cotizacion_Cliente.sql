-- =============================================
-- Proceso: ProcesoNegocio/Del_Cotizacion_Cliente
-- =============================================
--START_PARAM
set @id_cliente = 0,
    @id_cotizacion = 0;
--END_PARAM

    delete from fact_cotizacion_cliente
    where id_cliente = @id_cliente
      and id_cotizacion = @id_cotizacion;

    select concat('OK-Eliminado') as result;

