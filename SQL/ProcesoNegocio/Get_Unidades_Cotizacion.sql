-- =============================================
-- Proceso: ProcesoNegocio/Get_Unidades_Cotizacion
-- =============================================
--START_PARAM
set @id_cliente = '2',
    @id_proyecto = '3',
    @cotizacion = '1';
--END_PARAM

select *
from fact_negocios_unidades
where id_cliente = @id_cliente
  and id_proyecto = @id_proyecto
  and cotizacion = @cotizacion
  and is_active = 1;