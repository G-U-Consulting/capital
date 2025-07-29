-- =============================================
-- Proceso: Salas/Get_Hito
-- =============================================
--START_PARAM
set @id_sala = NULL;
--END_PARAM

select p.id_proyecto, p.nombre
from fact_proyectos p join dim_sala_proyecto sp
on p.id_proyecto = sp.id_proyecto
where sp.id_sala_venta = @id_sala and p.is_active = 1
order by p.nombre;

select h.id_hito, h.titulo, h.descripcion, date_format(h.fecha, '%Y-%m-%d %T') as fecha, 
    h.color, h.festivo, h.id_proyecto, h.frecuencia, date_format(h.limite, '%Y-%m-%d') as limite,
    (select p.nombre from fact_proyectos p where h.id_proyecto is not null and p.id_proyecto = h.id_proyecto) as nombre_pro,
    group_concat(c.cargo order by c.cargo separator ',') as categorias
from dim_hito_sala h
left join dim_hito_cargo hc on hc.id_hito = h.id_hito
left join dim_cargo c on c.id_cargo = hc.id_cargo
where h.id_sala_venta = @id_sala
group by h.id_hito
order by fecha;

select id_cargo, cargo, `Descripcion` as descripcion 
from dim_cargo
where is_active = 1
order by cargo;