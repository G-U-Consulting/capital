-- =============================================
-- Proceso: Clientes/Get_StatsProyecto
-- =============================================
--START_PARAM
set @id_proyecto = NULL;
--END_PARAM

select t.id_torre, t.consecutivo, 
    count(if(u.id_estado_unidad = 1, 1, null)) as libre,
    count(if(u.id_estado_unidad = 2, 1, null)) as opcionado,
    count(if(u.id_estado_unidad = 3, 1, null)) as consignado,
    count(if(u.id_estado_unidad = 4, 1, null)) as vendido
from fact_torres t
join fact_unidades u on t.id_torre = u.id_torre
where t.id_proyecto = @id_proyecto or @id_proyecto is null
group by t.id_torre
order by t.consecutivo;