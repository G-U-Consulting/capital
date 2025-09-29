-- =============================================
-- Proceso: ProcesoNegocio/Del_Item
-- =============================================
--START_PARAM
set @id_negocios_unidades = 0,
    @terminarAtencion = 0,
    @id_proyecto = 0,
    @id_visita = 0,
    @id_cliente = 0;
--END_PARAM


update
    fact_visitas
set
    is_active = 0
where
    id_visita = @id_visita;

if @terminarAtencion = 1 then
    delete from fact_negocios_unidades
    where id_proyecto = @id_proyecto
      and id_cliente = @id_cliente
      and date(created_on) < now();
else
    delete from fact_negocios_unidades
    where id_negocios_unidades = @id_negocios_unidades;
end if;

select 'OK' as result;
