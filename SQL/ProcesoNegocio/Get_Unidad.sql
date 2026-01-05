-- =============================================
-- Proceso: ProcesoNegocio/Get_Unidad
-- =============================================
--START_PARAM
set @id_unidad = '91032';

--END_PARAM
select a.*, b.*, tp.tipo_proyecto as clase
from fact_unidades a
join fact_proyectos b on a.id_proyecto = b.id_proyecto
join dim_tipo_proyecto tp on a.id_clase = tp.id_tipo_proyecto
where id_unidad = @id_unidad;
