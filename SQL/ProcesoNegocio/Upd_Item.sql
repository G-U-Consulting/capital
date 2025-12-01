-- =============================================
-- Proceso: ProcesoNegocio/Upd_Item
-- =============================================
--START_PARAM
set @id_negocios_unidades = 0;
--END_PARAM


update fact_negocios_unidades
 set is_asignado = 0
  where id_negocios_unidades = @id_negocios_unidades;

update cola_tareas_rpa
 set is_active = 0
  where llave = @id_negocios_unidades
     and tipo = 'unassign';

select 'OK' as result;
