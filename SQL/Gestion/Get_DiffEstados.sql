-- =============================================
-- Proceso: Clientes/Get_DiffEstados
-- =============================================
--START_PARAM
--END_PARAM

select date_format(l.fecha, '%Y-%m-%d') as fecha, id_estado_unidad1, id_estado_unidad2, p.id_proyecto
from dim_log_unidades l
join fact_unidades u on l.id_unidad = u.id_unidad
join fact_proyectos p on u.id_proyecto = p.id_proyecto
where l.id_estado_unidad1 is not null and l.id_estado_unidad2 is not null
order by l.fecha desc;