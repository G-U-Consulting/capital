-- =============================================
-- Proceso: ProcesoNegocio/Get_Unidades_Cotizacion
-- =============================================
--START_PARAM
set @id_cliente = '2',
    @id_proyecto = '3',
    @cotizacion = '1';
--END_PARAM

select 
    f.*,
    DATE_FORMAT(f.created_on, '%Y-%m-%d %H:%i:%s') as fecha_formateada
from fact_negocios_unidades f
where f.id_cliente = @id_cliente
  and f.id_proyecto = @id_proyecto
  and f.cotizacion = @cotizacion
  and f.is_active = 1;