-- =============================================
-- Proceso: ProcesoNegocio/Get_Proyecto
-- =============================================
--START_PARAM
set @id_proyecto = '13';
--END_PARAM

select distinct
    a.id_tipo_vis,
    a.id_proyecto,
    case 
        when c.estado_publicacion = 'Excluir de Ad@' then ''
        else 'SOSTENIBLE'
    end as estado_publicacion_final
from fact_proyectos a
join dim_estado_publicacion c on a.id_estado_publicacion = c.id_estado_publicacion
where a.id_proyecto = @id_proyecto LIMIT 1;

