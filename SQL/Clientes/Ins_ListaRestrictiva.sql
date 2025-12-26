-- =============================================
-- Proceso: Clientes/Ins_ListaRestrictiva
-- =============================================
--START_PARAM
set @id_cliente = NULL,
    @id_opcion = 80,
    @resultados = NULL;
--END_PARAM

insert into dim_lista_restrictiva(id_cliente, id_opcion, resultados)
values(@id_cliente, @id_opcion, @resultados)
on duplicate key update
id_cliente = values(id_cliente),
id_opcion = values(id_opcion),
resultados = values(resultados);

update fact_unidades u
join fact_negocios_unidades n on u.id_unidad = n.id_unidad
join fact_opcion o on n.id_cotizacion = o.id_cotizacion
set u.id_estado_unidad = 6
where o.id_opcion = @id_opcion;

select 'OK' as result;