-- =============================================
-- Proceso: ProcesoNegocio/Get_TiempoRestante_Atencion
-- =============================================
--START_PARAM
set @id_cotizacion = '0';
--END_PARAM

select
    min(c.fecha_programada) as fecha_expiracion,
    TIMESTAMPDIFF(SECOND, utc_timestamp(), min(c.fecha_programada)) as segundos_restantes,
    c.id_cola_tareas_rpa
from fact_negocios_unidades u
join cola_tareas_rpa c on c.llave = u.id_negocios_unidades
    and c.tipo = 'unassign'
    and c.sub_tipo = 'unidad'
    and c.is_active = 1
where u.id_cotizacion = @id_cotizacion
  and u.is_active = 1
group by c.id_cola_tareas_rpa
order by fecha_expiracion asc
limit 1;
