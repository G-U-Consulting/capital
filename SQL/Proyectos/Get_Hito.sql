-- =============================================
-- Proceso: Proyecto/Get_Hito
-- =============================================
--START_PARAM
set @id_sala = NULL,
    @id_proyecto NULL;
--END_PARAM

select id_sala_venta, sala_venta, id_sede
from dim_sala_venta 
where id_sala_venta = @id_sala and is_active = 1;

select id_hito, titulo, descripcion, date_format(fecha, '%Y-%m-%d %T') as fecha, color, festivo, id_proyecto
from dim_hito_sala
where id_sala_venta = @id_sala and id_proyecto is null or id_proyecto = @id_proyecto
order by fecha;