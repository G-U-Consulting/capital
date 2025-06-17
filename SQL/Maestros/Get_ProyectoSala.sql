-- =============================================
-- Proceso: Maestros/Get_ProyectoSala
-- =============================================
--START_PARAM
set @id_sala = NULL;

--END_PARAM

select id_proyecto, nombre, date_format(fecha_asignacion_sala, '%Y-%m-%d %T') as fecha_asignacion_sala
from fact_proyectos 
where id_sala_venta = @id_sala;