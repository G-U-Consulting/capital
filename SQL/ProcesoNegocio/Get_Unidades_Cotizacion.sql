-- =============================================
-- Proceso: ProcesoNegocio/Get_Unidades_Cotizacion
-- =============================================
--START_PARAM
set @id_cliente = '2',
    @id_proyecto = '3',
    @cotizacion = '7';
--END_PARAM

select 
    f.*,
    b.antes_p_equ,
    b.despues_p_equ,
    DATE_FORMAT(b.fecha_escrituracion, '%Y-%m-%d') as fecha_escrituracion,
    DATE_FORMAT(b.fecha_p_equ, '%Y-%m-%d') as fecha_p_equ,
    DATE_FORMAT(f.created_on, '%Y-%m-%d %H:%i:%s') as fecha_formateada
from fact_negocios_unidades f
join fact_torres b 
    on f.torre = b.consecutivo 
   and f.id_proyecto = b.id_proyecto
where f.id_cliente = @id_cliente
  and f.id_proyecto = @id_proyecto
  and f.cotizacion = @cotizacion
  and f.is_active = 1;