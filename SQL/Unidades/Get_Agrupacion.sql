-- =============================================
-- Proceso: Unidades/Get_Agrupacion
-- =============================================
--START_PARAM
set @id_proyecto = NULL;

--END_PARAM

select a.id_agrupacion, a.nombre, a.descripcion, a.id_proyecto, 
    coalesce(sum((select pu.precio from dim_precio_unidad pu
        where pu.id_lista = if(u.id_lista is null, 
        (select p.id_lista from fact_proyectos p where p.id_proyecto = u.id_proyecto), u.id_lista) and pu.id_unidad = u.id_unidad
    )), 0) as total
from dim_agrupacion_unidad a
left join fact_unidades u on a.id_agrupacion = u.id_agrupacion
where a.id_proyecto = @id_proyecto
group by a.id_agrupacion
order by a.nombre;