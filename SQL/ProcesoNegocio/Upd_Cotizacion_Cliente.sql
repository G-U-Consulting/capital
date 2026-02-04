-- =============================================
-- Proceso: ProcesoNegocio/Upd_Cotizacion_Cliente
-- =============================================
--START_PARAM
set @id_cliente = '1',
    @porcentaje = '50',
    @id_cotizacion = '0';
--END_PARAM

update fact_cotizacion_cliente
set porcentaje_copropiedad = @porcentaje
where id_cliente = @id_cliente
  and id_cotizacion = @id_cotizacion;

select concat('ok-id_cliente:', @id_cliente, ' porcentaje:', @porcentaje) as result;
