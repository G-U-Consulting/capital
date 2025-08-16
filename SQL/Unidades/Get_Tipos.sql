-- =============================================
-- Proceso: Unidades/Get_Tipos
-- =============================================
--START_PARAM
set @id_proyecto = NULL;

--END_PARAM

select id_tipo, tipo, id_proyecto, id_archivo_planta, id_archivo_recorrido
from dim_tipo_unidad
where id_proyecto = @id_proyecto and tipo != '';
