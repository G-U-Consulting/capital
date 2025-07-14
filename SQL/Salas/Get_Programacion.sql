-- =============================================
-- Proceso: Salas/Get_Programacion
-- =============================================
--START_PARAM
set @id_sala = NULL;
--END_PARAM

select p.id_programacion, p.id_usuario, p.id_sala_venta, date_format(p.fecha, '%Y-%m-%d') as fecha,
    p.id_estado, e.estado, u.id_usuario, u.nombres, u.identificacion, c.id_cargo, c.cargo
from dim_programacion_sala p join fact_usuarios u
on p.id_usuario = u.id_usuario join dim_estado_programacion e
on p.id_estado = e.id_estado join dim_cargo c
on u.id_cargo = c.id_cargo
where p.id_sala_venta = @id_sala
order by fecha, u.nombres;

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

select u.id_usuario, u.usuario, u.nombres, u.identificacion, c.cargo, u.is_active, ps.permanente
from fact_usuarios u 
left join dim_cargo c on u.id_cargo = c.id_cargo
join dim_personal_sala ps on u.id_usuario = ps.id_usuario
where ps.id_sala_venta = @id_sala;

select id_estado, estado
from dim_estado_programacion
order by estado;

select id_cargo, cargo, `Descripcion` as descripcion 
from dim_cargo
where is_active = 1
order by cargo;