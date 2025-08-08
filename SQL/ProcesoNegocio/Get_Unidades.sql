-- =============================================
-- Proceso: ProcesoNegocio/Get_Unidades
-- =============================================
--START_PARAM
set @id_cliente = '2',
    @id_cotizacion = '3';
--END_PARAM

select *
from fact_negocios_unidades a
join fact_unidades b on a.id_unidad = b.id_unidad
where a.is_active = 1
  and b.is_active = 1
  and a.id_cliente = @id_cliente
  and a.id_cotizacion = @id_cotizacion;