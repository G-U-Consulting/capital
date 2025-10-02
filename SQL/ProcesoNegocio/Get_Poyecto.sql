-- =============================================
-- Proceso: ProcesoNegocio/Get_Proyecto
-- =============================================
--START_PARAM
set @id_proyecto = '3';
--END_PARAM


select 
    a.id_proyecto,
    a.id_tipo_vis

from fact_proyectos a
where a.id_proyecto = @id_proyecto;
