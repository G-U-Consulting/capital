-- =============================================
-- Proceso: Proyecto/Get_Hitos 
-- =============================================
--START_PARAM
set @id_sala = NULL;
--END_PARAM

select id_sala_venta, sala_venta, id_sede
from dim_sala_venta 
where id_sala_venta = @id_sala and is_active = 1;

select id_hito, titulo, descripcion, fecha, color, festivo
from dim_hito_sala
where id_sala_venta = @id_sala;