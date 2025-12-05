-- =============================================
-- Proceso: ProcesoNegocio/Get_Validar_Unidades_Opcionadas
-- =============================================
--START_PARAM
set @id_cotizacion = '523',
    @id_cliente = 2,
    @id_proyecto = '3';
--END_PARAM

select
    count(distinct nu_actual.id_unidad) as unidades_opcionadas,
    group_concat(distinct nu_actual.numero_apartamento separator ', ') as apartamentos_opcionados
from fact_negocios_unidades nu_actual
where nu_actual.id_cotizacion = @id_cotizacion
  and nu_actual.id_cliente = @id_cliente
  and nu_actual.id_proyecto = @id_proyecto
  and nu_actual.is_active = 1
  and exists (
      select 1
      from fact_opcion o
      inner join fact_cotizaciones c on o.id_cotizacion = c.id_cotizacion
      inner join fact_negocios_unidades nu_otra on nu_otra.id_cotizacion = c.id_cotizacion
          and nu_otra.id_cliente = c.id_cliente
          and nu_otra.id_proyecto = c.id_proyecto
      where nu_otra.id_unidad = nu_actual.id_unidad
        and nu_otra.is_active = 1
        and c.id_proyecto = @id_proyecto
        and c.id_cotizacion != @id_cotizacion
  );
