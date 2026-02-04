-- =============================================
-- Proceso: ProcesoNegocio/Upd_ExtenderTiempo_Atencion
-- =============================================
--START_PARAM
set @id_cotizacion = '0';
--END_PARAM

update cola_tareas_rpa c
join fact_negocios_unidades u on c.llave = u.id_negocios_unidades
set c.fecha_programada = c.fecha_programada + interval 30 minute
where u.id_cotizacion = @id_cotizacion
  and u.is_active = 1
  and c.tipo = 'unassign'
  and c.sub_tipo = 'unidad'
  and c.is_active = 1;

select concat('OK-Tiempo extendido 30 minutos') as result;
