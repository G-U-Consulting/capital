-- =============================================
-- Proceso: Medios/Get_Grupos
-- =============================================
--START_PARAM
set @id_proyecto = 1,
    @modulo = '';
--END_PARAM

select grupo, orden, id_secuencia, modulo
from dim_grupo_proyecto a
left join dim_secuencia_proyecto b on a.id_proyecto = b.id_proyecto
where a.id_proyecto = @id_proyecto and  (modulo is null or modulo = @modulo)
order by orden;