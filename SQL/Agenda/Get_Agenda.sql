-- =============================================
-- Proceso: Agenda/Get_Agenda
-- =============================================
--START_PARAM
set @username = 'prueba';

--END_PARAM

select sv.id_sala_venta, sv.sala_venta
from dim_sala_venta sv 
join dim_personal_sala ps on sv.id_sala_venta = ps.id_sala_venta 
join fact_usuarios u on ps.id_usuario = u.id_usuario
where u.usuario = @username and sv.is_active = 1;

select p.id_proyecto, p.nombre, group_concat(sp.id_sala_venta separator ',') as salas
from fact_proyectos p 
join dim_sala_proyecto sp on p.id_proyecto = sp.id_proyecto 
join dim_personal_sala ps on sp.id_sala_venta = ps.id_sala_venta 
join fact_usuarios u on ps.id_usuario = u.id_usuario
where u.usuario = @username and p.is_active = 1
group by id_proyecto 
order by p.nombre;

select h.id_hito, h.titulo, h.descripcion, date_format(h.fecha, '%Y-%m-%d %T') as fecha, h.color, h.festivo, h.id_sala_venta, 
    h.id_proyecto, h.id_torre, h.id_unidad, h.frecuencia, concat('Torre ', t.consecutivo) as torre, 
    concat(un.clase, ' ', un.numero_apartamento) as unidad, date_format(h.limite, '%Y-%m-%d') as limite, 
    sv.sala_venta, pro.nombre as nombre_pro, group_concat(c.cargo order by c.cargo separator ',') as categorias
from dim_hito_sala h
join dim_sala_venta sv on h.id_sala_venta = sv.id_sala_venta
join dim_personal_sala ps on sv.id_sala_venta = ps.id_sala_venta
join fact_usuarios u on ps.id_usuario = u.id_usuario
left join dim_hito_cargo hc on hc.id_hito = h.id_hito
left join dim_cargo c on c.id_cargo = hc.id_cargo
left join fact_proyectos pro on h.id_proyecto = pro.id_proyecto
left join fact_torres t on h.id_torre = t.id_torre
left join fact_unidades un on h.id_unidad = un.id_unidad
where u.usuario = @username and sv.is_active = 1 and (h.id_proyecto is null or pro.is_active = 1) and u.id_cargo = c.id_cargo
group by h.id_hito
order by fecha;

select id_cargo, cargo, `Descripcion` as descripcion 
from dim_cargo
where is_active = 1
order by cargo;

select date_format(ps.fecha, '%Y-%m-%d') as fecha, ps.id_sala_venta, ps.id_estado, e.estado, e.is_laboral, e.color
from dim_programacion_sala ps
join dim_estado_programacion e on ps.id_estado = e.id_estado
join dim_sala_venta sv on ps.id_sala_venta = sv.id_sala_venta
join fact_usuarios u on ps.id_usuario = u.id_usuario
where u.usuario = @username;

select date_format(t.alta, '%Y-%m-%d') as alta, date_format(t.deadline, '%Y-%m-%d') as deadline,
    t.descripcion, t.id_estado, t.id_prioridad, t.id_proyecto, t.id_usuario, t.id_tarea, p.prioridad as orden_p,
    p.nombre as prioridad, p.color, e.nombre as estado, pro.nombre as proyecto, if(e.id_estado = 4, '0', '1') as activa
from dim_tarea_usuario t 
join dim_prioridad_tarea p on t.id_prioridad = p.id_prioridad 
join dim_estado_tarea e on t.id_estado = e.id_estado 
join fact_proyectos pro on t.id_proyecto = pro.id_proyecto
join fact_usuarios u on t.id_usuario = u.id_usuario
where u.usuario = @username
order by t.deadline, p.prioridad desc;