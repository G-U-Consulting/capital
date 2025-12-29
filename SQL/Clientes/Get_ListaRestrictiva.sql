-- =============================================
-- Proceso: Clientes/Get_ListaRestrictiva
-- =============================================
--START_PARAM

--END_PARAM

select id_proyecto, nombre
from fact_proyectos;

select l.id_cliente, l.id_opcion, l.resultados, date_format(l.created_on, '%Y-%m-%d') as created_on, 
    c.numero_documento, p.id_proyecto, p.nombre as proyecto,
    concat(coalesce(c.nombres, ''), ' ', coalesce(c.apellido1, ''), ' ', coalesce(c.apellido2, '')) as nombre
from dim_lista_restrictiva l
join fact_clientes c on l.id_cliente = c.id_cliente
join fact_opcion o on l.id_opcion = o.id_opcion
join fact_cotizaciones co on o.id_cotizacion = co.id_cotizacion
join fact_proyectos p on co.id_proyecto = p.id_proyecto
order by l.created_on desc;
