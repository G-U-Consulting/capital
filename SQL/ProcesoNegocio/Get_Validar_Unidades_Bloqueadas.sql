-- =============================================
-- Proceso: ProcesoNegocio/Get_Validar_Unidades_Bloqueadas
-- =============================================
--START_PARAM
set @id_cotizacion = 0,
    @id_cliente = 0;
--END_PARAM

select
    n.id_unidad,
    n.numero_apartamento,
    otra.usuario as asesor_actual,
    otra.id_cotizacion as cotizacion_actual
from fact_negocios_unidades n
inner join fact_negocios_unidades otra
    on otra.id_unidad = n.id_unidad
    and otra.id_cotizacion != n.id_cotizacion
    and otra.is_active = 1
    and otra.id_cliente = @id_cliente
    and date(otra.created_on) = curdate()
    and otra.id_negocios_unidades > n.id_negocios_unidades
where n.id_cotizacion = @id_cotizacion
  and n.is_active = 1
group by n.id_unidad;
