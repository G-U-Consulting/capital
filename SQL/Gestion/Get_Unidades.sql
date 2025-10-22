-- =============================================
-- Proceso: Gestion/Get_Unidades
-- =============================================
--START_PARAM
set @id_torre = 465;
--END_PARAM

select u.id_unidad, concat(coalesce(tp.codigo, ''), ' ', u.numero_apartamento) as unidad, u.piso, u.id_torre, u.id_lista,
    u.id_clase, u.id_estado_unidad, tp.tipo_proyecto as clase, e.estado_unidad, u.id_tipo, t.tipo, u.id_proyecto,
    v.id_venta, 
    case when u.id_estado_unidad = 4 then v.created_by else null end as gestionado_por
from fact_unidades u
left join dim_tipo_proyecto tp on u.id_clase = tp.id_tipo_proyecto
left join dim_estado_unidad e on u.id_estado_unidad = e.id_estado_unidad
left join dim_tipo_unidad t on u.id_tipo = t.id_tipo
left join fact_ventas v on u.id_unidad = v.id_unidad
where u.id_torre = @id_torre
order by u.piso, u.numero_apartamento;
