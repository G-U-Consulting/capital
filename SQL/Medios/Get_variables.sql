-- =============================================
-- Proceso: Medios/Get_variables
-- =============================================
--START_PARAM
set @id_proyecto = 1
    @modulo;
--END_PARAM

select id_grupo_proyecto, orden, grupo
from dim_grupo_proyecto
where id_proyecto = @id_proyecto and modulo = @modulo
order by orden;


