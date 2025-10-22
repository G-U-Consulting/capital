-- =============================================
-- Proceso: Gestion/Get_Torres
-- =============================================
--START_PARAM
set @id_proyecto = NULL;
--END_PARAM

select t.id_torre, t.consecutivo, t.id_sinco, f.fiduciaria, t.en_venta
from fact_torres t
left join dim_fiduciaria f on t.id_fiduciaria = f.id_fiduciaria
where t.is_active = 1 and t.id_proyecto = @id_proyecto
order by t.consecutivo;

select id_tipo, tipo
from dim_tipo_unidad 
where id_proyecto = @id_proyecto and tipo != '';

select u.id_unidad, concat(coalesce(tp.codigo, ''), ' ', u.numero_apartamento) as unidad, u.piso, u.id_torre, u.id_lista,
    u.id_clase, u.id_estado_unidad, tp.tipo_proyecto as clase, e.estado_unidad, u.id_tipo, t.tipo, u.id_proyecto,
    v.id_venta, 
    case when u.id_estado_unidad = 4 then v.created_by else null end as gestionado_por
from fact_unidades u
left join dim_tipo_proyecto tp on u.id_clase = tp.id_tipo_proyecto
left join dim_estado_unidad e on u.id_estado_unidad = e.id_estado_unidad
left join dim_tipo_unidad t on u.id_tipo = t.id_tipo
left join fact_ventas v on u.id_unidad = v.id_unidad
where u.id_proyecto = @id_proyecto
order by u.piso, u.numero_apartamento;