-- =============================================
-- Proceso: Agenda/Get_Tareas
-- =============================================
--START_PARAM
set @id_usuario = 2,
    @username = NULL;
--END_PARAM


select date_format(t.alta, '%Y-%m-%d') as alta, date_format(t.deadline, '%Y-%m-%d') as deadline,
    t.descripcion, t.id_estado, t.id_prioridad, t.id_proyecto, t.id_usuario, t.id_tarea, p.prioridad as orden_p,
    p.nombre as prioridad, p.color, e.nombre as estado, pro.nombre as proyecto, if(e.id_estado = 4, '0', '1') as activa
from dim_tarea_usuario t join dim_prioridad_tarea p
on t.id_prioridad = p.id_prioridad join dim_estado_tarea e
on t.id_estado = e.id_estado left join fact_proyectos pro
on t.id_proyecto = pro.id_proyecto
where t.id_usuario = @id_usuario or t.id_usuario = 
    (select id_usuario from fact_usuarios where usuario = @username)
order by t.deadline, p.prioridad desc;
