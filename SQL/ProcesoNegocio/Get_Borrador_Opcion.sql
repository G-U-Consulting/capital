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
    DATE_FORMAT(b.fecha_modificacion, '%d/%m/%Y %H:%i') as fecha_formato
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
