-- =============================================
-- Proceso: ProcesoNegocio/Del_Cotizacion
-- =============================================
--START_PARAM
set @id_cotizacion = 0;
--END_PARAM

delete from fact_cotizaciones
where
    id_cotizacion = @id_cotizacion;

select 'OK' as result;