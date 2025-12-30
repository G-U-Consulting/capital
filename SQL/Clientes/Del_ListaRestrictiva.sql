-- =============================================
-- Proceso: Clientes/Get_ListaRestrictiva
-- =============================================
--START_PARAM
set @id_lista = NULL;
--END_PARAM

update fact_unidades u
join fact_negocios_unidades n on u.id_unidad = n.id_unidad
join fact_opcion o on n.id_cotizacion = o.id_cotizacion
join dim_lista_restrictiva l on o.id_opcion = l.id_opcion
set u.id_estado_unidad = 2
where l.id_lista = @id_lista;

update dim_lista_restrictiva
set is_active = 0
where id_lista = @id_lista;

select 'OK' as result;