-- =============================================
-- Proceso: ProcesoNegocio/Get_Unidad
-- =============================================
--START_PARAM
set @id_unidad = '91032';

--END_PARAM
select *
from fact_unidades a
join fact_proyectos b on a.id_proyecto = b.id_proyecto
where id_unidad = @id_unidad;
