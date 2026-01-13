-- =============================================
-- Proceso: Proyectos/Upd_TipoNoVis
-- =============================================
--START_PARAM
set @data = NULL,
    @id_proyecto = NULL;
--END_PARAM

update dim_props_tipo_torre p
join fact_torres t on p.id_torre = t.id_torre
set p.excluir_vis = 0
where t.id_proyecto = @id_proyecto;

drop temporary table if exists tmp_tipo_no_vis;
create temporary table tmp_tipo_no_vis as
select *
from json_table(
    @data,
    '$[*]'
    columns (
        id_tipo int path '$.id_tipo',
        id_torre int path '$.id_torre'
    )
) as t;

update dim_props_tipo_torre p
join tmp_tipo_no_vis t on p.id_tipo = t.id_tipo and p.id_torre = t.id_torre
set p.excluir_vis = 1;

drop temporary table if exists tmp_tipo_no_vis;

select 'OK' as result;