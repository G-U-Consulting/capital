-- =============================================
-- Proceso: Clientes/Get_DetalleCliente
-- =============================================
--START_PARAM
set @id_cliente = NULL;
--END_PARAM

select id_visita, p.id_proyecto, p.nombre as proyecto, v.descripcion,
    date_format(v.created_on, '%Y/%m/%d') as fecha, m.id_medio, m.medio
from fact_visitas v
join fact_proyectos p on v.id_proyecto = p.id_proyecto
join dim_medio_publicitario m on v.id_medio = m.id_medio
where id_cliente = @id_cliente
order by v.created_on desc;