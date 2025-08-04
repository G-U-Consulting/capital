-- =============================================
-- Proceso: Unidades/Get_Agrupacion
-- =============================================
--START_PARAM
set @id_proyecto = NULL;

--END_PARAM

select *, 0 as total_importe 
from dim_agrupacion_unidad 
where id_proyecto = @id_proyecto
order by nombre;