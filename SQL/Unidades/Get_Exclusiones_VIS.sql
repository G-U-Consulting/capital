-- =============================================
-- Proceso: Unidades/Get_Exclusiones_VIS
-- =============================================
--START_PARAM
set @id_proyecto = '3';
--END_PARAM

select
    tu.id_tipo,
    tu.tipo,
    t.id_torre,
    t.nombre_torre,
    t.consecutivo
from dim_props_tipo_torre pt
join fact_torres t on pt.id_torre = t.id_torre
join dim_tipo_unidad tu on pt.id_tipo = tu.id_tipo
where t.id_proyecto = @id_proyecto
  and pt.excluir_vis = 1;
