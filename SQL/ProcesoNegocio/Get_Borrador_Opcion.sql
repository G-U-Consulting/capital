-- =============================================
-- Proceso: ProcesoNegocio/Get_Borrador_Opcion
-- =============================================
--START_PARAM
set @id_opcion = null,
    @id_cotizacion = '1',
    @id_cliente = '2',
    @id_proyecto = '3';
--END_PARAM

select
    b.id_borrador,
    b.id_opcion,
    b.id_cotizacion,
    b.id_cliente,
    b.id_proyecto,
    b.datos_json,
    b.fecha_creacion,
    b.fecha_modificacion,
    b.usuario_creacion,
    TIMESTAMPDIFF(MINUTE, b.fecha_modificacion, NOW()) as minutos_desde_modificacion,
    DATE_FORMAT(b.fecha_modificacion, '%d/%m/%Y %H:%i') as fecha_formato,
    (
        select count(distinct nu_actual.id_unidad)
        from fact_negocios_unidades nu_actual
        where nu_actual.id_cotizacion = b.id_cotizacion
          and nu_actual.id_cliente = b.id_cliente
          and nu_actual.id_proyecto = b.id_proyecto
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
                and c.id_proyecto = b.id_proyecto
                and c.id_cotizacion != b.id_cotizacion
          )
    ) as unidades_opcionadas
from fact_borrador_opcion b
where b.id_cotizacion = @id_cotizacion
  and b.id_cliente = @id_cliente
  and b.id_proyecto = @id_proyecto
  and (
    (@id_opcion is null and b.id_opcion is null) or
    (@id_opcion is not null and b.id_opcion = @id_opcion)
  )
order by b.fecha_modificacion desc
LIMIT 1;
