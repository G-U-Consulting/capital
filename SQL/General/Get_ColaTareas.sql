-- =============================================
-- Proceso: General/Get_ColaTareas
-- =============================================
--START_PARAM
--END_PARAM

select id_cola_tareas_rpa, tipo, sub_tipo, llave, datos
from cola_tareas_rpa
where is_active = 1 and fecha_programada <= current_timestamp
order by prioridad desc, fecha_programada
limit 1;