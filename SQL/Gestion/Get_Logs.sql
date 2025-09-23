-- =============================================
-- Proceso: Gestion/Get_Logs
-- =============================================
--START_PARAM
set @id_unidad = NULL;
--END_PARAM

select l.id_log, l.titulo, l.texto, l.fecha, u.nombres as usuario
from dim_log_unidades l
join fact_usuarios u on l.id_usuario = u.id_usuario
where l.id_unidad = @id_unidad
order by l.fecha desc;
