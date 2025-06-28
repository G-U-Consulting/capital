-- =============================================
-- Proceso: Proyecto/Get_Tarea
-- =============================================
--START_PARAM
set @username = NULL,
    @id_proyecto = NULL,
    @id_usuario = NULL;
--END_PARAM

select id_usuario into @id_usuario from fact_usuarios where usuario = @username;

select id_usuario, usuario, nombres, identificacion, email, id_cargo
from fact_usuarios
where id_usuario = @id_usuario and is_active = 1;

select id_proyecto, nombre, id_sala_venta
from fact_proyectos
where is_active = 1;

select date_format(t.alta, '%Y-%m-%d') as alta, date_format(t.deadline, '%Y-%m-%d') as deadline,
    t.descripcion, t.id_estado, t.id_prioridad, t.id_proyecto, t.id_usuario, t.id_tarea, 
    p.nombre as prioridad, e.nombre as estado, pro.nombre as proyecto, if(e.id_estado = 4, '0', '1') as activa
from dim_tarea_usuario t join dim_prioridad_tarea p
on t.id_prioridad = p.id_prioridad join dim_estado_tarea e
on t.id_estado = e.id_estado join fact_proyectos pro
on t.id_proyecto = pro.id_proyecto
where t.id_usuario = @id_usuario
order by t.deadline, p.prioridad desc;

select * from dim_prioridad_tarea;
select * from dim_estado_tarea;
