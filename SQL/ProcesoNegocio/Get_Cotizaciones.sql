-- =============================================
-- Proceso: ProcesoNegocio/Get_Cotizaciones
-- =============================================
--START_PARAM
set @id_cliente = '';  
--END_PARAM

select id_cotizacion, id_cliente,cotizacion, fecha, descripcion, importe from fact_cotizaciones where id_cliente = @id_cliente;





