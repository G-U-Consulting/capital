-- =============================================
-- Proceso: Unidades/Upd_ListasAlerta
-- =============================================
--START_PARAM
set @data = '[]';
--END_PARAM

drop temporary table if exists tmp_listas_alerta;
create temporary table tmp_listas_alerta as
select *
from json_table(
    @data,
    '$[*]'
    columns (
        id_lista int path '$.id_lista',
        is_active char(1) path '$.is_active'
    )
) as t;

update fact_lista_espera l
join tmp_listas_alerta t on l.id_lista = t.id_lista
set l.is_active = if(t.is_active = '0', 0, l.is_active);

drop temporary table if exists tmp_listas_alerta;

select 'OK' as result;