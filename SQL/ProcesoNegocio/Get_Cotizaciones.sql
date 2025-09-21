-- =============================================
-- Proceso: ProcesoNegocio/Get_Cotizaciones
-- =============================================
--START_PARAM
set @id_cliente = '2',
    @id_proyecto = '3';
--END_PARAM

select
    id_cotizacion,
    id_cliente,
    cotizacion,
    DATE_FORMAT(fecha, '%Y-%m-%d %H:%i:%s') as fecha,
    descripcion,
    importe
from fact_cotizaciones
where
    id_cliente = @id_cliente
    and id_proyecto = @id_proyecto;





