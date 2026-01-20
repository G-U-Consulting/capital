-- =============================================
-- Proceso: Proyectos/Upd_TipoTorreBloq
-- =============================================
--START_PARAM
set @data = NULL,
    @id_proyecto = NULL;
--END_PARAM

update dim_props_tipo_torre p
join fact_torres t on p.id_torre = t.id_torre
set p.excluir_bloqueados = 0
where t.id_proyecto = @id_proyecto;

drop temporary table if exists tmp_tipo_torre_bloq;
create temporary table tmp_tipo_torre_bloq as
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
join tmp_tipo_torre_bloq t on p.id_tipo = t.id_tipo and p.id_torre = t.id_torre
set p.excluir_bloqueados = 1;

drop temporary table if exists tmp_tipo_torre_bloq;

select 'OK' as result;